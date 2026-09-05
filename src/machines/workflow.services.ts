import { createActor } from 'xstate';
import { workflowMachine } from '#/machines/workflow.machine';

// Replace with real database persistence
const mockDbStore: Record<string, string> = {
  id123: 'awaitingInitialMessage',
};

async function getUserState(idUser: string) {
  return mockDbStore[idUser] ?? null;
}

async function saveUserState(idUser: string, snapshotJson: string) {
  console.debug('* saveUserState: ', idUser, snapshotJson);
  mockDbStore[idUser] = snapshotJson;
}

export async function processUserWorkflow(idUser: string, message: string): Promise<string> {
  const savedState = await getUserState(idUser);

  const actor = createActor(
    workflowMachine,
    // savedState ? { snapshot: JSON.parse(savedState) } : { input: { idUser } },
    savedState,
  );

  actor.start();

  // Check if user requested cancellation
  if (message.trim().toUpperCase() === 'CANCEL') {
    actor.send({ type: 'CANCEL' });
  } else {
    actor.send({ type: 'SUBMIT_MESSAGE', message });
  }

  const snapshot = actor.getSnapshot();
  await saveUserState(idUser, JSON.stringify(snapshot));

  // Determine returned response message
  switch (true) {
    case snapshot.matches('awaitingInitialMessage'):
      return 'Hello. Let me know your name';

    case snapshot.matches('awaitingName'):
      return 'Hello. Let me know your name';

    case snapshot.matches('awaitingTask'):
      return `Nice to meet you ${snapshot.context.name}. What can I do for you?`;

    case snapshot.matches('completed'):
      return `Sure! I will help you with ${snapshot.context.task}`;

    default:
      return 'Workflow reset. Send a message to start again.';
  }
}
