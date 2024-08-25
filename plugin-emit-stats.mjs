import { writeFile } from 'node:fs/promises'

/**
 * @param {string} path
 * @return {string}
 */
const addSlash = path => {
  if (path.startsWith('/')) return path
  return `/${path}`
}

/**
 * @param {string[]} chunks
 * @return {string[]}
 */
const removeHotUpdate = chunks => {
  return chunks.filter(next => !next.endsWith('.hot-update.js'))
}

/**
 * @param {import('@rsbuild/core').Rspack.Stats} stats
 */
export const getAssetMap = async stats => {
  const allChunks = Array.from(stats.compilation.namedChunkGroups.entries())
  /**
   * @type {[unknown, import('@rsbuild/core').Rspack.ChunkGroup]}
   */
  const [_, indexChunk] = allChunks.find(([name]) => name === 'index')
  const entryChunks = indexChunk.getFiles().map(chunk => addSlash(chunk))
  const jsChunks = entryChunks.filter(chunk => chunk.endsWith('.js'))
  const cssEntry = entryChunks.filter(chunk => chunk.endsWith('.css')) || []
  const data = {
    chunks: {
      '/': removeHotUpdate(jsChunks)
    },
    css: cssEntry
  }
  return data
}

/**
 * @param {{}} options
 * @return {import('@rsbuild/core').RsbuildPlugin}
 */
export const pluginEmitStats = (options = {}) => {
  return {
    name: 'rsbuild:emit-stats',
    /**
     * @param {import('@rsbuild/core').RsbuildPluginAPI} api
     */
    setup(api) {
      api.onAfterBuild(async result => {
        /**
         * @type {import('@rsbuild/core').Rspack.Stats[]}
         */
        const stats = result.stats['stats']
        const webStats = stats.find(stat => stat.compilation.name === 'web')
        if (!webStats) {
          console.error(
            `Could not find environment "web", ensure rsbuild.config.ts has an "environments" entry of "web"`
          )
          return
        }
        const folder = result.environments.web.config.output.distPath.root
        const server =
          result.environments.ssr.config.output.distPath.root + '/index.js'
        let assetMap = await getAssetMap(webStats)
        assetMap = {
          ...assetMap,
          server: `./${server}`,
          public: `./${folder}`
        }
        await writeFile(
          `./${folder}/build-manifest.json`,
          JSON.stringify(assetMap, null, 2),
          'utf-8'
        )
      })
    }
  }
}
