import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'

const requireFile = createRequire(import.meta.url)

const serverRender = async (c, assetMap) => {
  const remotesPath = path.join(process.cwd(), assetMap.server)
  const importedApp = requireFile(remotesPath)
  const ua = c.req.header('user-agent')
  const response = await importedApp.render({
    request: c.req.raw,
    ua,
    assetMap
  })
  return response
}

const port = process.env.PORT || 3000

const readManifest = async () => {
  const content = await readFile('./build/build-manifest.json', {
    encoding: 'utf-8'
  })
  const data = JSON.parse(content)
  return data
}

async function preview() {
  const app = new Hono()
  let assetMap
  try {
    assetMap = await readManifest()
  } catch (e) {
    console.error(e)
    return
  }
  app.use('/*', serveStatic({ root: assetMap.public, index: './not-found' }))
  app.get('*', async (c, next) => {
    try {
      const res = await serverRender(c, assetMap)
      return res
    } catch (err) {
      console.error('SSR render error\n', err)
      await next()
    }
  })
  serve(
    {
      fetch: app.fetch,
      port
    },
    () => {
      console.log(`Server started at http://localhost:${port}`)
    }
  )
}

void preview(process.cwd())

export default preview
