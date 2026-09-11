import type { WhatsAppMessage } from '#/interfaces/whatsapp';
import type { Snapshot } from 'xstate';

import { createFileRoute } from '@tanstack/react-router';
import { responseSuccessful, responseError } from '#/utils/http';
import { createActor } from 'xstate';
import { pluviaWorkflow } from '#/machines/pluviaWorkflow';
import { log } from '#/utils/supabaseFunctions';

interface Props {
  request: Request;
}

/**
 * ********************************************
 */
// TODO: El estado se debe obtener y guardar en la BD
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
/**
 * ********************************************
 */

export const Route = createFileRoute('/api/meta/whatsapp/v1')({
  server: {
    handlers: {
      POST: async (props) => {
        const { request }: Props = props;
        try {
          // const body = await request.formData();
          // const receivedData = {} as WhatsAppMessage;
          // body.forEach((value, key) => {
          //   receivedData[key as keyof WhatsAppMessage] = value.toString();
          // });

          // EJEMPLO DE MENSAJE RECIBIDO
          // {
          //   object: 'whatsapp_business_account',
          //   entry: [
          //     {
          //       id: '102290129340398',
          //       changes: [
          //         {
          //           value: {
          //             messaging_product: 'whatsapp',
          //             metadata: {
          //               display_phone_number: '15550783881',
          //               phone_number_id: '106540352242922',
          //             },
          //             contacts: [
          //               {
          //                 profile: {
          //                   name: 'Sheena Nelson',
          //                 },
          //                 wa_id: '16505551234',
          //               },
          //             ],
          //             messages: [
          //               {
          //                 from: '16505551234',
          //                 id: 'wamid.HBgLMTY1MDM4Nzk0MzkVAgASGBQzQTRBNjU5OUFFRTAzODEwMTQ0RgA=',
          //                 timestamp: '1749416383',
          //                 type: 'text',
          //                 text: {
          //                   body: 'Does it come in another color?',
          //                 },
          //               },
          //             ],
          //           },
          //           field: 'messages',
          //         },
          //       ],
          //     },
          //   ],
          // }

          const receivedData = await request.json();
          // const userId = receivedData.entry[0].changes[0].value.contacts[0].wa_id;
          // const userRealName = receivedData.entry[0].changes[0].value.contacts[0].profile.name;
          // const message = receivedData.entry[0].changes[0].value.messages[0].text.body;
          // console.debug('idUser: ', userId);
          // console.debug('userRealName: ', userRealName);
          // console.debug('message: ', message);

          // const savedSnapshot = await loadState(userId);
          // const actor = savedSnapshot
          //   ? createActor(pluviaWorkflow, { snapshot: savedSnapshot })
          //   : createActor(pluviaWorkflow);

          // actor.start();

          // const isCancel = message.trim().toUpperCase() === 'CANCEL';
          // actor.send(isCancel ? { type: 'CANCEL' } : { type: 'MESSAGE', message });

          // const newSnapshot = actor.getPersistedSnapshot();
          // await saveState(userId, newSnapshot);
          // actor.stop();

          // Registra log en BD
          const response = await log('meta', 'pluvia', receivedData);
          const result = await response.json();

          if (!response.ok) {
            return responseError(
              'DATA_ERROR',
              `Supabase function error: ${result.message || response.statusText}`,
            );
          }

          return responseSuccessful('OK', result);
          // return responseSuccessful('OK', newSnapshot);
        } catch (error: unknown) {
          return responseError(
            'DATA_ERROR',
            `Error has been caught: ${error instanceof Error ? error.message : error}`,
          );
        }
      },

      // La petición GET es para la validación del API de WhatsApp
      GET: async (props) => {
        const { request } = props;
        const VERIFICATION_TOKEN = import.meta.env.VITE_WHATSAPP_VERIFICATION_TOKEN;

        try {
          const url = new URL(request.url);
          const mode = url.searchParams.get('hub.mode');
          const challenge = url.searchParams.get('hub.challenge');
          const verifyToken = url.searchParams.get('hub.verify_token');

          if (mode === 'subscribe' && verifyToken === VERIFICATION_TOKEN && challenge) {
            return new Response(challenge, { status: 200 });
          }

          return responseError('DATA_ERROR', 'Verification failed');
        } catch (error: unknown) {
          return responseError(
            'DATA_ERROR',
            `Error has been caught: ${error instanceof Error ? error.message : error}`,
          );
        }
      },

      // El resto de peticiones HTTP no son aceptadas
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
