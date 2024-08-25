import { render } from '../build/server/index.js'

const readManifest = async () => {
  const data = await import('../build/build-manifest.json')
  return data
}

const serverRender = async (c, assetMap) => {
  const ua = c.request.headers.get('user-agent')
  const response = await render({
    request: c.request,
    ua,
    assetMap
  })
  return response
}

export const onRequest = async c => {
  const manifest = await readManifest()
  try {
    const res = await serverRender(c, manifest)
    return res
  } catch (err) {
    if (err instanceof Response) {
      return err
    } else {
      console.error('SSR render error\n', err)
      return new Response('<h1>Something went wrong</h1>', {
        status: 500,
        headers
      })
    }
  }
}
