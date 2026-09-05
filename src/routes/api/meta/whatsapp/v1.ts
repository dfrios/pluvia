import { createFileRoute } from '@tanstack/react-router';
import { responseSuccessful, responseError } from '#/utils/http';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_KEY;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/pluviaSetLog`;
const VERIFICATION_TOKEN = 'Mzh0MiLOwtQb4blcTVCq0CuP7MyqJuTKDPQ6xAPrhoVz9jvz6SZcUl5arruK6kOl';

export const Route = createFileRoute('/api/meta/whatsapp/v1')({
  server: {
    handlers: {
      POST: async (props) => {
        const { request } = props;
        try {
          const receivedData = await request.json();

          const response = await fetch(EDGE_FUNCTION_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${API_KEY}`,
              apikey: API_KEY,
            },
            body: JSON.stringify({
              origin: 'meta',
              destination: 'pluvia',
              data: receivedData,
            }),
          });

          const result = await response.json();

          if (!response.ok) {
            return responseError(
              'DATA_ERROR',
              `Supabase function error: ${result.message || response.statusText}`,
            );
          }

          return responseSuccessful('OK', result);
        } catch (error: unknown) {
          return responseError(
            'DATA_ERROR',
            `Error has been caught: ${error instanceof Error ? error.message : error}`,
          );
        }
      },
      GET: async (props) => {
        const { request } = props;
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
