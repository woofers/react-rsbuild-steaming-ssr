import { Hono } from 'hono'

const app = new Hono()

const readManifest = async () => {
  const data = await import('./build/build-manifest.json')
  return data
}

const serverRender = async (c, assetMap) => {
  const importedApp = await import('./build/server/index.js')
  const ua = c.req.header('user-agent')
  const response = await importedApp.render({
    request: c.req.raw,
    ua,
    assetMap
  })
  return response
}

app.get('*', async (c, next) => {
  const manifest = await readManifest()
  try {
    const res = await serverRender(c, manifest)
    return res
  } catch (err) {
    console.error('SSR render error\n', err)
    await next()
  }
})

export default app
