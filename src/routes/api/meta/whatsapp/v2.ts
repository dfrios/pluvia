import type { WhatsAppMessage } from '#/interfaces/whatsapp';
import type { Snapshot } from 'xstate';

import { createFileRoute } from '@tanstack/react-router';
import { responseSuccessful, responseError } from '#/utils/http';
import { createActor } from 'xstate';
import { pluviaWorkflow } from '#/machines/pluviaWorkflow';

interface Props {
  request: Request;
}

const stateStore: Record<string, Snapshot<unknown>> = {};

async function loadState(idUser: string): Promise<Snapshot<unknown> | null> {
  console.debug('>> current snapshot', stateStore[idUser]);
  return stateStore[idUser] ?? null;
}

async function saveState(idUser: string, snapshot: Snapshot<unknown>) {
  stateStore[idUser] = snapshot;
  console.debug('>> new snapshot', snapshot);
  console.debug('>> stateStore[idUser]', stateStore[idUser]);
}

export const Route = createFileRoute('/api/meta/whatsapp/v2')({
  server: {
    handlers: {
      POST: async (props) => {
        const { request }: Props = props;
        try {
          const body = await request.formData();

          const bodyJson = {} as WhatsAppMessage;
          body.forEach((value, key) => {
            bodyJson[key as keyof WhatsAppMessage] = value.toString();
          });

          const idUser = bodyJson.From;
          const message = bodyJson.Body;

          const savedSnapshot = await loadState(idUser);
          const actor = savedSnapshot
            ? createActor(pluviaWorkflow, { snapshot: savedSnapshot })
            : createActor(pluviaWorkflow);

          actor.start();

          const isCancel = message.trim().toUpperCase() === 'CANCEL';
          actor.send(isCancel ? { type: 'CANCEL' } : { type: 'MESSAGE', message });

          const newSnapshot = actor.getPersistedSnapshot();
          await saveState(idUser, newSnapshot);
          actor.stop();

          return responseSuccessful('CREATED', { actorStatus: newSnapshot });
        } catch (error: unknown) {
          return responseError(
            'DATA_ERROR',
            `Error has been caught: ${error instanceof Error ? error.message : error}`,
          );
        }
      },
      GET: () => {
        return responseError('METHOD_NOT_ALLOWED', 'Method not allowed');
      },
      PUT: () => {
        return responseError('METHOD_NOT_ALLOWED', 'Method not allowed');
      },
      DELETE: () => {
        return responseError('METHOD_NOT_ALLOWED', 'Method not allowed');
      },
      PATCH: () => {
        return responseError('METHOD_NOT_ALLOWED', 'Method not allowed');
      },
      OPTIONS: () => {
        return responseError('METHOD_NOT_ALLOWED', 'Method not allowed');
      },
      HEAD: () => {
        return responseError('METHOD_NOT_ALLOWED', 'Method not allowed');
      },
    },
  },
});
