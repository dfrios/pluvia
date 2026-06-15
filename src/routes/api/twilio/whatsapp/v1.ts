import { createFileRoute } from '@tanstack/react-router';
import { supabase } from '#/utils/supabase';

import { responseSuccessful, responseError } from '#/utils/http';
import fs from 'node:fs/promises';
import path from 'node:path';

export const Route = createFileRoute('/api/twilio/whatsapp/v1')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData();

          const formObj: Record<string, string> = {};
          formData.forEach((value, key) => {
            formObj[key] = value.toString();
          });
          const infoToBeStored = JSON.stringify(formObj);

          const { data, error } = await supabase
            .from('logs')
            .insert([{ origin: 'twilio', destination: 'database', data: infoToBeStored }])
            .select()
            .single();

          // console.log(data);

          if (error) {
            return responseError('FAILED_DATABASE_INSERT', 'Failed insert');
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
