import { createRsbuild, loadConfig } from '@rsbuild/core'
import Fastify from 'fastify'
import middieFastify from '@fastify/middie'
import { createStandardRequest } from 'fastify-standard-request-reply'
import { createFetchRequest } from './fetch.mjs'
import { getAssetMap } from './plugin-emit-stats.mjs'

/**
 * @typedef {Awaited<ReturnType<Awaited<ReturnType<import('@rsbuild/core').createRsbuild>>['createDevServer']>>} DevServer
 */

/**
 * @param {DevServer} rsbuildServer
 */
const getServerBundle = async rsbuildServer => {
  /**
   * @type {{ render: (...args: unknown[]) => Promise<Response>, handler: { query: (req: Request) => Promise<{ matches: unknown[] }> } }}
   */
  const indexModule = await rsbuildServer.environments.ssr.loadBundle('index')
  return indexModule
}

/**
 * @param {DevServer} rsbuildServer
 */
const serverRender = rsbuildServer => async (request, reply) => {
  /**
   * @type {{ render: (...args: unknown[]) => Promise<Response> }}
   */
  const indexModule = await getServerBundle(rsbuildServer)
  const ua = request.headers['user-agent']
  const stats = await rsbuildServer.environments.web.getStats()
  const assetMap = await getAssetMap(stats)
  const re = createStandardRequest(request, reply)
  const standardRequsest = new Request(
    'http://127.0.0.1:3000' + new URL(re.url).pathname,
    re
  )
  const response = await indexModule.render({
    request: standardRequsest,
    ua,
    assetMap
  })
  return reply.send(response)
}

async function startDevServer() {
  const { content } = await loadConfig({})
  const rsbuild = await createRsbuild({
    rsbuildConfig: content
  })
  const app = Fastify({
    logger: false
  })
  await app.register(middieFastify)
  const rsbuildServer = await rsbuild.createDevServer()
  const serverRenderMiddleware = serverRender(rsbuildServer)
  app.get('*', async (request, reply) => {
    try {
      const res = await serverRenderMiddleware(request, reply)
      return res
    } catch (err) {
      console.error('SSR render error\n', err)
    }
  })
  app.use(async (req, res, next) => {
    const indexModule = await getServerBundle(rsbuildServer)
    const standardRequsest = createFetchRequest(req, res)
    let queryResponse
    try {
      queryResponse = (await indexModule.handler.query(standardRequsest)) || {}
    } catch {
      return next()
    }
    const { matches } = queryResponse || {}
    if (!matches) {
      return next()
    }
    const uniqueMatches = matches.filter(
      match => match.route.path !== '/' && match.route?.path !== '*'
    )
    const pathname = new URL(standardRequsest.url).pathname
    if (
      uniqueMatches.length > 0 ||
      ['/', '/404', '500', '/_error'].includes(pathname)
    ) {
      return next()
    }
    return rsbuildServer.middlewares(req, res, next)
  })
  await app.listen({ port: rsbuildServer.port })
  await rsbuildServer.afterListen()
  rsbuildServer.connectWebSocket({ server: app.server })
}

void startDevServer(process.cwd())
