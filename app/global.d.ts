import type { AssetMap } from './utils'

declare global {
  interface Window {
    assetMap: AssetMap
  }
}

export {}
