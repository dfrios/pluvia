import type { LogOriginDestination } from '#/interfaces/app.types';

const log = async (
  origin: LogOriginDestination,
  destination: LogOriginDestination,
  data: Record<string, string>,
) => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const API_KEY = import.meta.env.VITE_SUPABASE_KEY;

  const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/pluviaSetLog`;

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      apikey: API_KEY,
    },
    body: JSON.stringify({
      origin,
      destination,
      data,
    }),
  });

  return response;
};

export { log };
