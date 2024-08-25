// Adapted from https://github.com/maplegrove-io/use-dehydrated-state
import { useMatches } from 'react-router'
import merge from 'deepmerge'
import type { DehydratedState } from '@tanstack/query-core'

const castData = (data: unknown) =>
  data as { dehydratedState?: DehydratedState }

const filterBoolean = <T>(value: T | undefined): value is T => !!value

export const useDehydratedState = () => {
  const matches = useMatches()
  const dehydratedState = matches
    .map(match => castData(match.data)?.dehydratedState)
    .filter(filterBoolean)
  const state = dehydratedState.length
    ? dehydratedState.reduce(
        (accumulator, currentValue) => merge(accumulator, currentValue),
        {} as DehydratedState
      )
    : undefined

  return state
}
