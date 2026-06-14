import { createFileRoute } from '@tanstack/react-router';

import { responseSuccessful, responseError } from '#/utils/http';
import fs from 'node:fs/promises';
import path from 'node:path';

export const Route = createFileRoute('/api/twilio/whatsapp/v1')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const targetPath = path.join(process.cwd(), 'public', 'data_from_twilio.log');
        try {
          await fs.appendFile(targetPath, JSON.stringify(await request.text()), 'utf-8');
          await fs.appendFile(targetPath, '\n', 'utf-8');
        } catch {
          return responseError('DATA_ERROR', 'Error found in request data');
        }
        return responseSuccessful('OK', { message: 'DONE' });
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
