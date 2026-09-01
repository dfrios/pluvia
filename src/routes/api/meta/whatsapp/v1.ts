import type { Person } from '#/interfaces/app.types';

import { createFileRoute } from '@tanstack/react-router';

import { responseSuccessful, responseError } from '#/utils/http';
import { DatabaseClient } from '#/utils/supabase';
import { MessagingClient } from '#/utils/twilio';

export const Route = createFileRoute('/api/meta/whatsapp/v1')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Get data from request
          const formData = await request.formData();

          const formObj: Record<string, string> = {};
          formData.forEach((value, key) => {
            formObj[key] = value.toString();
          });
          const infoToBeStored = JSON.stringify(formObj);

          console.debug('>> infoToBeStored', infoToBeStored);

          const WaId = formData.get('WaId')?.toString() ?? '';
          console.log('>>> WaId', WaId);

          // Stops execution when WaId is empty
          if (WaId === '') return responseError('DATA_ERROR', 'Missing WaId');

          // Creates databaseClient and messagingClient using WaId as parameter
          const databaseClient = new DatabaseClient(WaId);
          console.log('>>> 2');
          const messagingClient = new MessagingClient(WaId);
          console.log('>>> 3');

          // Logs received data to the database
          await databaseClient.log('twilio', 'database', infoToBeStored);

          // Check number already exists in DB
          const user: Person = await databaseClient.getUser();
          console.log('>>> user', user);
          if (user) {
            console.log('TRUE');
            // -- TODO: Check T&C has been accepted
            if (user.agreed_terms) {
              // TODO: Start gauge rain flow
            } else {
              // TODO: Start T&C flow
            }
          } else {
            console.log('FALSE');

            // TODO: Start signing up flow
            await messagingClient.sendSignUp(formData.get('ProfileName')?.toString() ?? '');
          }

          return responseSuccessful('CREATED', { stringified: infoToBeStored });
        } catch (error: unknown) {
          return responseError(
            'FAILED_DATABASE_INSERT',
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

// Mensaje recibido
// {
//   "ExternalUserId": "whatsapp:CO.4480491918930694",
//   "SmsMessageSid": "SMd35dc6b5e27d2858718fd7da213a625f",
//   "NumMedia": "0",
//   "ProfileName": "David Ríos",
//   "MessageType": "text",
//   "SmsSid": "SMd35dc6b5e27d2858718fd7da213a625f",
//   "WaId": "573003255454",
//   "SmsStatus": "received",
//   "Body": "Hola",
//   "To": "whatsapp:+14155238886",
//   "NumSegments": "1",
//   "ReferralNumMedia": "0",
//   "MessageSid": "SMd35dc6b5e27d2858718fd7da213a625f",
//   "AccountSid": "ACb4b407e67527c878940ad7c5181137ba",
//   "ChannelMetadata": "{\"type\":\"whatsapp\",\"data\":{\"context\":{\"ProfileName\":\"David Ríos\",\"WaId\":\"573003255454\"}}}",
//   "From": "whatsapp:+573003255454",
//   "ApiVersion": "2010-04-01"
// }
