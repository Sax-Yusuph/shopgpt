import { ApplicationError } from "@/lib/_utils/errors";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import OpenAi from "openai";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const getServerSdk = () => {
  if (!OPENAI_KEY) {
    throw new ApplicationError("Missing environment variable OPENAI_KEY");
  }

  if (!SUPABASE_URL) {
    throw new ApplicationError("Missing environment variable SUPABASE_URL");
  }

  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new ApplicationError("Missing environment variable SUPABASE_SERVICE_ROLE_KEY");
  }

  const openAi = new OpenAi({ apiKey: OPENAI_KEY });

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  return { openAi, supabaseClient, OPENAI_KEY };
};

let supabaseClient: SupabaseClient<any, "public", any>;
export const getSupabaseClient = () => {
  if (!SUPABASE_URL) {
    throw new ApplicationError("Missing environment variable SUPABASE_URL");
  }

  if (!SUPABASE_ANON_KEY) {
    throw new ApplicationError("Missing environment variable SUPABASE_SERVICE_ROLE_KEY");
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }

  return supabaseClient;
};
