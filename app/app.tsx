import type React from 'react'
import './tailwind.css'
import type { AssetMap } from './utils'

const App: React.FC<{ assetMap: AssetMap; children: React.ReactNode }> = ({
  assetMap,
  children
}) => (
  <html lang="en" suppressHydrationWarning>
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet"
      />
      <title>React + Rsbuild + SSR</title>
      {assetMap.css?.map(style => (
        <link key={style} rel="stylesheet" href={style} />
      ))}
    </head>
    <body>{children}</body>
  </html>
)

export default App
