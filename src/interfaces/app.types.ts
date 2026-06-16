import type { Database } from '#/interfaces/database.types';

interface SupabasePerson {
  id: string;
  name: string | null;
  cellphone: string;
  agreed_terms: boolean;
  agreed_terms_at: string | null;
}

type Person = SupabasePerson | false;

interface LogEntry {
  id: string;
  origin: Database['public']['Enums']['platform'];
  destination: Database['public']['Enums']['platform'];
  data: string;
  createdAt: string;
}

export type { Person, LogEntry };
