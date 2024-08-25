export type AssetMap = {
  css: string[]
  chunks: Record<string, string[]>
}

const BOT_UA_RE =
  /Googlebot|Mediapartners-Google|AdsBot-Google|googleweblight|Storebot-Google|Google-PageRenderer|Bingbot|BingPreview|Slurp|DuckDuckBot|baiduspider|yandex|sogou|LinkedInBot|bitlybot|tumblr|vkShare|quora link preview|facebookexternalhit|facebookcatalog|Twitterbot|applebot|redditbot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|ia_archiver/i

export const isBot = (userAgent: string) => {
  return BOT_UA_RE.test(userAgent)
}
