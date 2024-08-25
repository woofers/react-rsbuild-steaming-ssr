import { useSyncExternalStore } from 'react'

const empty = () => () => {
  // pass
}

export const useSsr = () =>
  useSyncExternalStore(
    empty,
    () => false,
    () => true
  )
