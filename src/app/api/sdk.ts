import { ApplicationError } from "@/lib/_utils/errors";
import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai-edge";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

  const config = new Configuration({ apiKey: OPENAI_KEY });
  const openAi = new OpenAIApi(config);

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });

  return { openAi, supabaseClient, OPENAI_KEY };
};
