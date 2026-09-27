import { setup, assign } from 'xstate';

export interface WorkflowContext {
  idUser: string;
  name?: string;
  task?: string;
}

export type WorkflowEvent = { type: 'SUBMIT_MESSAGE'; message: string } | { type: 'CANCEL' };

export const workflowMachine = setup({
  types: {
    context: {} as WorkflowContext,
    events: {} as WorkflowEvent,
  },
  actions: {
    logAction: ({ context, event }, params: { step: string }) => {
      console.log(`[AUDIT LOG] User: ${context.idUser} | Step: ${params.step} | Event:`, event);
    },
  },
}).createMachine({
  id: 'userWorkflow',
  initial: 'awaitingInitialMessage',
  context: ({ input }: { input: { idUser: string } }) => ({
    idUser: input.idUser,
  }),
  // Global event handlers across all states
  on: {
    CANCEL: {
      target: '.awaitingInitialMessage',
      actions: [
        assign({ name: undefined, task: undefined }),
        { type: 'logAction', params: { step: 'RESET - Process Cancelled' } },
      ],
    },
  },
  states: {
    awaitingInitialMessage: {
      on: {
        SUBMIT_MESSAGE: {
          target: 'awaitingName',
          actions: [{ type: 'logAction', params: { step: '1 - First Message Received' } }],
        },
      },
    },
    awaitingName: {
      on: {
        SUBMIT_MESSAGE: {
          target: 'awaitingTask',
          actions: [
            assign({ name: ({ event }) => event.message }),
            { type: 'logAction', params: { step: '2 - Name Received' } },
          ],
        },
      },
    },
    awaitingTask: {
      on: {
        SUBMIT_MESSAGE: {
          target: 'completed',
          actions: [
            assign({ task: ({ event }) => event.message }),
            { type: 'logAction', params: { step: '3 - Task Received' } },
          ],
        },
      },
    },
    completed: {
      type: 'final',
    },
  },
});
