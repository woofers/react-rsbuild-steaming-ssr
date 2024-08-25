# react-rsbuild-steaming-ssr 

Template for using stream-based SSR with React.

Built with Rsbuild and deployable to Cloudflare Workers/Pages or Hono.

Disclaimer: This setup is not intended for large-scale apps, use Next.js or Remix instead.

## Features
- Supports React Router and @tanstack/react-query
- Pre-configured for Cloudflare Pages or Workers deployment
- Deployment can be adpted to AWS Lambda, Netlify, Deno, Bun and more via Hono
- App structure is not restricted by a framework 
- Rsbuild powers dev-server and builds

## Drawbacks
- `<head />` metadata is currently static and would require additional setup for per route tags
- React Router loaders run on both client and server depending on navigation type (similar to Next.js' old getInitialProps model which may be an upside depending on the project)
- Server bundle code-splitting is disabled for deployment (You may be able to re-enable `asyncChunks` depending on your deployment environment)
- Dev-server uses Fastify instead of Hono (This is because Rspack's middleware format is Express based and can not work well with Hono)
