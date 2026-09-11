import type { Database } from '#/interfaces/database.types';
import type { LogEntry, Person } from '#/interfaces/app.types';

import { createClient } from '@supabase/supabase-js';
import { responseError } from '#/utils/http';

class DatabaseClient {
  #supabaseClient: ReturnType<typeof createClient<Database>>;
  #cellphone: string;

  constructor(cellphone: string) {
    this.#supabaseClient = createClient<Database>(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_KEY,
    );
    this.#cellphone = cellphone;
  }

  async getUser(): Promise<Person> {
    const { data, error } = await this.#supabaseClient
      .from('users')
      .select()
      .eq('cellphone', this.#cellphone)
      .single();
    console.log('>>> isThisNumberRegistered', data, error);
    if (!data) return false;

    return data;
  }

  async log(
    origin: LogEntry['origin'],
    destination: LogEntry['destination'],
    data: LogEntry['data'],
  ): Promise<void> {
    const { error } = await this.#supabaseClient
      .from('logs')
      .insert([{ origin, destination, data }]);

    if (error) throw responseError('FAILED_DATABASE_INSERT', 'Failed insert');
  }
}

export { DatabaseClient };
