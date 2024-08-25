import React, { StrictMode, startTransition, useState } from 'react'
import { hydrateRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
  RouterProviderProps
} from 'react-router-dom'
import { routes } from './routes'
import App from './app'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from 'utils/query-client'

void hydrate()

function castToLazy<T extends {}>(route: T) {
  return route as { lazy: () => Promise<T> } & T
}

async function loadLazyRoutes() {
  const lazyMatches = matchRoutes(routes, window.location)?.filter(
    m => castToLazy(m.route).lazy
  )
  if (lazyMatches && lazyMatches?.length > 0) {
    await Promise.all(
      lazyMatches.map(async m => {
        const routeModule = await castToLazy(m.route).lazy()
        Object.assign(m.route, { ...routeModule, lazy: undefined })
      })
    )
  }
}

const ClientApp: React.FC<Pick<RouterProviderProps, 'router'>> = ({
  router
}) => {
  const [queryClient] = useState(getQueryClient)
  return (
    <StrictMode>
      <App assetMap={window.assetMap}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} fallbackElement={null} />
        </QueryClientProvider>
      </App>
    </StrictMode>
  )
}

async function hydrate() {
  await loadLazyRoutes()
  const router = createBrowserRouter(routes)
  startTransition(() => {
    hydrateRoot(document, <ClientApp router={router} />)
  })
}
