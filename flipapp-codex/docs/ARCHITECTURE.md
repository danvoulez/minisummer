# FlipApp Architecture

The system is composed of Supabase for storage and edge functions, a Flask
backend, and a React frontend. Logs are captured as **LogLines** and enriched by
a series of edge functions. A WhatsApp webhook stores incoming messages as
LogLines. Embeddings are generated via the LLM service.
