import { setup, assign } from 'xstate';

interface Message {
  type: 'MESSAGE';
  message: string;
}
interface Cancel {
  type: 'CANCEL';
}

const pluviaWorkflow = setup({
  types: {
    context: {} as { name: string; task: string },
    events: {} as Message | Cancel,
  },
  guards: {
    isHi: ({ event }) => event.type === 'MESSAGE' && event.message.trim().toUpperCase() === 'HI',
  },
  actions: {
    logTransition: (_, params: { step: string; message: string }) => {
      console.debug(
        `[${new Date().toISOString()}] state=${params.step} message="${params.message}"`,
      );
    },
    resetContext: assign({ name: undefined, task: undefined }),
  },
}).createMachine({
  id: 'pluvia',
  initial: 'awaitingFirstMessage',
  context: { name: '', task: '' },
  on: {
    CANCEL: {
      target: '.awaitingFirstMessage',
      actions: [
        'resetContext',
        { type: 'logTransition', params: { step: 'cancel', message: 'CANCEL' } },
      ],
    },
  },
  states: {
    awaitingFirstMessage: {
      on: {
        MESSAGE: [
          {
            guard: 'isHi',
            target: '#pluvia.awaitingName',
            actions: [
              // assign({name: ({event}) => event.message}),
              {
                type: 'logTransition',
                params: ({ event }) => ({ step: 'First message', message: event.message }),
              },
            ],
          },
          {
            actions: [
              {
                type: 'logTransition',
                params: ({ event }) => ({ step: 'First message REJECTED', message: event.message }),
              },
            ],
          },
        ],
      },
    },
    awaitingName: {
      on: {
        MESSAGE: {
          target: '#pluvia.awaitingFirstMessage',
          actions: [
            assign({ task: ({ event }) => event.message }),
            {
              type: 'logTransition',
              params: ({ event }) => ({ step: 'Second message', message: event.message }),
            },
          ],
        },
      },
    },
  },
});

export { pluviaWorkflow };
