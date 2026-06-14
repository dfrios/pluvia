import { createFileRoute } from '@tanstack/react-router';

import { responseSuccessful, responseError } from '#/utils/http';

export const Route = createFileRoute('/api/twilio/whatsapp/v1')({
  server: {
    handlers: {
      POST: () => {
        return responseSuccessful('OK', { message: 'Test message' });
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
