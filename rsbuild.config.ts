import { pluginReact } from '@rsbuild/plugin-react'
import { pluginEmitStats } from './plugin-emit-stats.mjs'

const distPath = { root: 'build' }

export default {
  plugins: [pluginReact(), pluginEmitStats()],

  environments: {
    web: {
      output: {
        distPath,
        target: 'web'
      },
      source: {
        entry: {
          index: './app/entry.client'
        }
      }
    },
    ssr: {
      output: {
        target: 'node',
        distPath: {
          root: 'build/server'
        }
      },
      source: {
        entry: {
          index: './app/entry.server'
        }
      }
    }
  },
  output: {
    distPath
  },
  tools: {
    rspack: {
      output: {
        asyncChunks: false
      }
    }
  }
}
