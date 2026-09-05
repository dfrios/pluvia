import { createFileRoute } from '@tanstack/react-router';
import { responseSuccessful, responseError } from '#/utils/http';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_KEY;
const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/pluviaSetLog`;

export const Route = createFileRoute('/api/meta/whatsapp/v1')({
  server: {
    handlers: {
      POST: async (props) => {
        const { request } = props;
        try {
          const formData = await request.formData();
          const receivedData: Record<string, string> = {};
          formData.forEach((value, key) => {
            receivedData[key] = value.toString();
          });

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
            return responseError('DATA_ERROR', `Supabase function error: ${result.message || response.statusText}`);
          }

          return responseSuccessful('OK', result);
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
