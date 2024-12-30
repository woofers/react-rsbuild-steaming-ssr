import { dehydrate } from '@tanstack/query-core'
import React from 'react'
import { redirect, type RouteObject } from 'react-router'
import { delay } from 'utils/delay'
import { getData } from 'utils/get-data'
import { getQueryClient } from 'utils/query-client'

const _reactRouterLazy =
  <T extends React.ComponentType>(loader: () => Promise<{ default: T }>) =>
  () =>
    loader().then(ex => ({ Component: ex.default }))

export const routes = [
  {
    path: '/',
    Component: React.lazy(() => import('./root')),
    errorElement: null,
    hydrateFallbackElement: null,
    children: [
      {
        path: '*',
        Component: React.lazy(() => import('./routes/_error'))
      },
      {
        path: '/',
        Component: React.lazy(() => import('./routes/_index'))
      },
      {
        path: '/about',
        Component: React.lazy(() => import('./routes/about')),
        loader: async () => {
          const queryClient = getQueryClient()
          await queryClient.prefetchQuery({
            queryKey: ['games'],
            queryFn: getData,
            staleTime: 1000 * 60
          })
          return { dehydratedState: dehydrate(queryClient) }
        }
      },
      {
        path: '/redirect',
        loader: async () => {
          return redirect('/about')
        }
      }
    ]
  }
] satisfies RouteObject[]
