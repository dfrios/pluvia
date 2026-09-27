import type { Snapshot } from 'xstate';

import { createActor } from 'xstate';
import { pluviaWorkflow } from '#/machine/pluviaWorkflow';
import { updateStatus } from '#/utils/supabaseFunctions';

const processData = async (
  userId: string,
  _name: string,
  _agreedTerms: boolean,
  status: Snapshot<unknown> | null,
  message: string,
  // receivedData: Record<string, string>,
) => {
  // const response = await log('meta', 'pluvia', receivedData);

  // const userRealName = receivedData.entry[0].changes[0].value.contacts[0].profile.name;
  // const message = receivedData.entry[0].changes[0].value.messages[0].text.body;
  // console.debug('idUser: ', userId);
  // console.debug('userRealName: ', userRealName);
  // console.debug('message: ', message);

  // const savedSnapshot = status;

  console.debug('\n\n====== status:', status, '\n\n');

  const actor = status
    ? createActor(pluviaWorkflow, { snapshot: status })
    : createActor(pluviaWorkflow);

  // console.debug('>> actor', actor);

  actor.start();

  // const isCancel = message.trim().toUpperCase() === 'CANCEL';
  // actor.send(isCancel ? { type: 'CANCEL' } : { type: 'MESSAGE', message });

  // const message = 'TEST MESSAGE';
  actor.send({ type: 'MESSAGE', message });

  const newSnapshot = actor.getPersistedSnapshot();
  console.debug('\n\n====== newSnapshot:', newSnapshot, '\n\n');
  await updateStatus(userId, newSnapshot);
  actor.stop();

  return {
    ok: true,
    // message: response,
    message: 'OK',
  };
};

/**
 * ********************************************
 */
// // TODO: El estado se debe obtener y guardar en la BD
// const stateStore: Record<string, Snapshot<unknown>> = {};

// async function loadState(userId: string): Promise<Snapshot<unknown> | null> {
//   console.debug('>> current snapshot', userId, stateStore[userId]);
//   return stateStore[userId] ?? null;
// }

// async function saveState(userId: string, snapshot: Snapshot<unknown>) {
//   stateStore[userId] = snapshot;
//   console.debug('>> new snapshot', userId, snapshot);
// }
/**
 * ********************************************
 */

export { processData };
