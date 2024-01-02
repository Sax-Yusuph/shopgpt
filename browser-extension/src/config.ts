// TODO write a script that updates this values at build time
const config = {
  transformerModel: 'Supabase/gte-small',
  transformerTask: 'feature-extraction',
  // apiBaseUrl: 'https://shopgpt.yusuphshamsondeen.workers.dev/api',
  apiBaseUrl: 'http://localhost:8080/api',
  enableLogs: true,
  supabase: {
    checkStoreFunctionName: 'check_store_exists',
    findSimilarItemsFunctionName: 'find_similar',
    productTableName: 'product',
    url: 'https://tfidwhcedleuieodvvvj.supabase.co',
    anonKey:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmaWR3aGNlZGxldWllb2R2dnZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTQ1MzA2ODEsImV4cCI6MjAxMDEwNjY4MX0.SqJ8w0EEEsQ1f0OEolGRpLozSQR5S7cfoGUcX9TWvrM',
    matchThreshold: 0.83,
    matchCount: 20,
  },
}

export default config
