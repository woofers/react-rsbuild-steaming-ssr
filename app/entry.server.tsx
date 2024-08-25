import React, { StrictMode } from 'react'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider
} from 'react-router-dom/server'
import {
  dehydrate,
  HydrationBoundary,
  QueryClientProvider
} from '@tanstack/react-query'
import { routes } from './routes'
import App from './app'
import { isBot, type AssetMap } from './utils'
import { getQueryClient } from 'utils/query-client'

const headers = { 'content-type': 'text/html' }

export const handler = createStaticHandler(routes)

const getRouterAndContext = async (request: Request) => {
  const context = await handler.query(request)
  if (context instanceof Response) {
    return { context } as never
  }
  const router = createStaticRouter(handler.dataRoutes, context)
  return { router, context: context as typeof context | Response }
}

type RotuerContext = Awaited<ReturnType<typeof getRouterAndContext>>['context']

const ABORT_DELAY = 10_000
const REDIRECT_STATUES = [301, 302, 303, 307, 308]

const isRedirectStatus = (status: number) => REDIRECT_STATUES.includes(status)

const getRedirectUrl = (request: Request, location?: string | null) => {
  const value = location ?? '/'
  try {
    const originUrl = new URL(request.url)
    const redirectUrl = new URL(value, originUrl.origin)
    return redirectUrl.href
  } catch {
    return value
  }
}

const handleRedirect = (request: Request, context: RotuerContext) => {
  if (context instanceof Response) {
    if (isRedirectStatus(context.status)) {
      return Response.redirect(
        getRedirectUrl(request, context.headers.get('Location')),
        context.status
      )
    }
  }
}

function assertContext(
  context: RotuerContext
): asserts context is Exclude<RotuerContext, Response> {
  if (context instanceof Response) {
    throw new Error(`Can not redirect to a status of "${context.status}"`)
  }
}

export async function render({
  request,
  ua,
  assetMap
}: { assetMap: AssetMap; ua: string; request: Request }) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, ABORT_DELAY)
  const isCrawler = isBot(ua)
  try {
    let didError = false
    const queryClient = getQueryClient()
    const { router, context } = await getRouterAndContext(request)
    const redirect = handleRedirect(request, context)
    if (redirect) return redirect
    assertContext(context)
    const dehydratedState = dehydrate(queryClient)
    const { renderToReadableStream } = await import(
      'react-dom/server.edge' as 'react-dom/server'
    )
    const stream = await renderToReadableStream(
      <StrictMode>
        <App assetMap={assetMap}>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
              <StaticRouterProvider
                router={router}
                context={context}
                hydrate={true}
              />
            </HydrationBoundary>
          </QueryClientProvider>
        </App>
      </StrictMode>,
      {
        bootstrapScripts: assetMap.chunks['/'],
        bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
        signal: controller.signal,
        onError(error: unknown) {
          didError = true
          console.error(error ?? 'Request was aborted')
        }
      }
    )
    void stream.allReady.then(() => clearTimeout(timeoutId))
    if (isCrawler) {
      await stream.allReady
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers
    })
  } catch (error) {
    console.error(error)
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers
    })
  }
}
