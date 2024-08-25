export function createFetchRequest(req, res) {
  const getHeader = (req, value) => {
    if ('get' in req) return req.get(value)
    return req.headers[value]
  }
  const origin = `${req.protocol}://${getHeader(req, 'host')}`
  const url = new URL(req.originalUrl || req.url, origin)
  const controller = new AbortController()
  res.on('close', () => controller.abort())
  const headers = new Headers()
  for (const [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (const value of values) {
          headers.append(key, value)
        }
      } else {
        headers.set(key, values)
      }
    }
  }
  const init = {
    method: req.method,
    headers,
    signal: controller.signal
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = req.body
  }
  return new Request(url.href, init)
}
