import type { LogOriginDestination } from '#/interfaces/log.types';
import { env } from 'cloudflare:workers';
import type { Snapshot } from 'xstate';

interface ReturnSupabase {
  error: boolean;
  message: string | Record<string, unknown> | Record<string, string>;
}

const log = async (
  origin: LogOriginDestination,
  destination: LogOriginDestination,
  data: Record<string, string>,
) => {
  const SUPABASE_URL = env.SUPABASE_URL;
  const API_KEY = env.SUPABASE_KEY;

  const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/pluviaSetLog`;

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${API_KEY}`,
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

const getUser = async (cellphone: string, username: string) => {
  const SUPABASE_URL = env.SUPABASE_URL;
  const API_KEY = env.SUPABASE_KEY;

  const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/pluviaGetUser?cellphone=${cellphone}&username=${username}`;

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${API_KEY}`,
      apikey: API_KEY,
    },
    // body: JSON.stringify({
    //   cellphone,
    //   username,
    // }),
  });

  return response;
};

const createUser = async (
  cellphone: string,
  username: string,
  name: string,
): Promise<ReturnSupabase> => {
  const SUPABASE_URL = env.SUPABASE_URL;
  const API_KEY = env.SUPABASE_KEY;

  const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/pluviaCreateUser`;

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${API_KEY}`,
      apikey: API_KEY,
    },
    body: JSON.stringify({
      cellphone,
      username,
      name,
    }),
  });

  return await response.json();
};

const updateStatus = async (userId: string, status: Snapshot<unknown>) => {
  const SUPABASE_URL = env.SUPABASE_URL;
  const API_KEY = env.SUPABASE_KEY;

  const EDGE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/pluviaUpdateUserStatus/id/${userId}`;

  const response = await fetch(EDGE_FUNCTION_URL, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${API_KEY}`,
      apikey: API_KEY,
    },
    body: JSON.stringify({
      status,
    }),
  });

  return response;
};

export { log, createUser, getUser, updateStatus };
