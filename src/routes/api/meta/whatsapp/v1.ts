import type { WhatsAppWebhookPayload } from '#/interfaces/whatsapp';

import { createFileRoute } from '@tanstack/react-router';
import { responseSuccessful, responseError } from '#/utils/http';
import { processData } from '#/utils/processData';
import { env } from 'cloudflare:workers';
import { log, createUser, getUser } from '#/utils/supabaseFunctions';

interface Props {
  request: Request;
  context?: any;
}

interface UserJsonMessage {
  id: string;
  name: string;
  agreed_terms: boolean;
  status: string | null;
  status_updated_at: string;
}
interface UserJson {
  error: boolean;
  message?: Array<UserJsonMessage>;
}

export const Route = createFileRoute('/api/meta/whatsapp/v1')({
  server: {
    handlers: {
      POST: async (props) => {
        const { request, context }: Props = props;
        try {
          // const body = await request.formData();
          // const receivedData = {} as WhatsAppMessage;
          // body.forEach((value, key) => {
          //   receivedData[key as keyof WhatsAppMessage] = value.toString();
          // });

          // EJEMPLO DE MENSAJE RECIBIDO
          // {
          //   "object": "whatsapp_business_account",
          //   "entry": [
          //     {
          //       "id": "1103754045644673",
          //       "changes": [
          //         {
          //           "value": {
          //             "messaging_product": "whatsapp",
          //             "metadata": {
          //               "display_phone_number": "15556771269",
          //               "phone_number_id": "1287821667750517"
          //             },
          //             "contacts": [
          //               {
          //                 "profile": {
          //                   "name": "David Ríos",
          //                   "username": "dfrios"
          //                 },
          //                 "wa_id": "573003255454",
          //                 "user_id": "CO.1738011794994683",
          //                 "country_code": "CO"
          //               }
          //             ],
          //             "messages": [
          //               {
          //                 "from": "573003255454",
          //                 "from_user_id": "CO.1738011794994683",
          //                 "id": "wamid.HBgMNTczMDAzMjU1NDU0FQIAEhgWM0VCMDQ0NTMzMkQ1MDQ1REVCODA1OAA=",
          //                 "timestamp": "1789319992",
          //                 "text": {
          //                   "body": "Mensaje desde Testing"
          //                 },
          //                 "from_logical_id": "126044539453559",
          //                 "type": "text",
          //                 "internal_1p_only_data": {
          //                   "account_context": {
          //                     "waac_id": "1403008784594539",
          //                     "cs_id": "1287821667750517",
          //                     "account_context_type": "non_paid_messaging"
          //                   }
          //                 }
          //               }
          //             ]
          //           },
          //           "field": "messages"
          //         }
          //       ]
          //     }
          //   ]
          // }

          const receivedData: WhatsAppWebhookPayload = await request.json();

          context.waitUntil(
            log('meta', 'pluvia', receivedData as unknown as Record<string, string>).catch(
              (error) => {
                console.error('Background logging error:', error);
              },
            ),
          );

          // const username =
          //   receivedData.entry[0]?.changes[0]?.value?.contacts[0]?.profile?.username ?? '';
          // const name = receivedData.entry[0]?.changes[0]?.value?.contacts[0]?.profile?.name ?? '';
          // const cellphone = receivedData.entry[0]?.changes[0]?.value?.contacts[0]?.wa_id;

          // if (!cellphone) {
          //   return responseError('DATA_ERROR', 'Invalid webhook payload: missing cellphone');
          // }

          // const userResponse = await getUser(cellphone, username);
          // const userJson: UserJson = await userResponse.json();

          // /**
          //  * Si no existe el usuario, lo crea en la base de datos
          //  */
          // let userId = userJson.message?.[0]?.id ?? '';
          // // console.debug('>> userJson.message?.[0]?.id', userJson.message?.[0]?.id);
          // if (!userJson.message?.[0]?.id) {
          //   const createResponse = await createUser(cellphone, username, name);
          //   userId = typeof createResponse.message === 'string' ? createResponse.message : '';
          // }

          // const user = {
          //   id: userId,
          //   name: userJson.message?.[0]?.name ?? '',
          //   agreedTerms: userJson.message?.[0]?.agreed_terms ?? false,
          //   status: JSON.parse(userJson.message?.[0]?.status ?? 'null'),
          // };
          // console.debug('>> user', user);

          // // Procesa los datos
          // const processedData = await processData(
          //   user.id,
          //   user.name,
          //   user.agreedTerms,
          //   user.status,
          //   receivedData.entry[0]?.changes[0]?.value?.messages?.[0]?.text?.body ?? '',
          //   // receivedData as unknown as Record<string, string>,
          // );

          // if (!processedData.ok) {
          //   return responseError('DATA_ERROR', `Supabase function error: ${processedData.message}`);
          // }

          return responseSuccessful('OK', {});
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
        const VERIFICATION_TOKEN = env.WHATSAPP_VERIFICATION_TOKEN;

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
