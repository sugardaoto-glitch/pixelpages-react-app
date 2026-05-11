# PixelPages - Website Builder

PixelPages is a modern website builder built with Next.js, React, and Prisma.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Features
- Drag and drop editor
- Ready-to-use templates
- User authentication
- Dashboard for managing sites
- **Copywriting Studio** — AI-powered e-commerce copywriting (`/copywriting`)
- **Generator Kode AI** — AI React code generator with live Sandpack preview, full Bahasa Indonesia UI (`/generator-kode`)

## Copywriting Studio & Generator Kode AI

Two built-in AI features share the same provider configuration:

- **Copywriting Studio** (`/copywriting`) generates and optimizes e-commerce copy
  (listings, ads, customer replies, marketing emails, and more).
- **Generator Kode AI** (`/generator-kode`) generates React components from a
  natural-language description (in Indonesian) and previews them live with
  Sandpack. Iterative refinement via follow-up prompts is supported.

Both call an LLM through API routes at `/api/copywriting/generate` and
`/api/code-generator/generate`. Two provider modes are supported:

- **OpenAI-compatible** (default). Works with OpenAI, OpenRouter, Groq, Ollama,
  or any other endpoint that speaks the `/v1/chat/completions` SSE protocol.
- **Google Gemini** via `generativelanguage.googleapis.com`.

Configure your provider via environment variables:

```bash
# Pick the default provider: "openai" or "gemini"
COPYWRITING_PROVIDER=openai

# OpenAI-compatible
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1   # or any compatible base URL
OPENAI_MODEL=gpt-4o-mini

# Gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash
```

See `.env.example` for the full template.
