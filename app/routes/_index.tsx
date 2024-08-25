import React from 'react'
import { Layout } from '../layout'
import Delay from 'app/delay'
import { Link } from 'react-router-dom'
import Colors from 'components/styled/colors'
import { ReactLogo, RsbuildLogo } from 'components/styled/react'
import Stack from 'components/styled/stack'

const IndexPage = () => {
  return (
    <Layout>
      <div className="flex gap-x-6 mt-[132px] mb-[100px]">
        <Stack gutter="5" className="items-center justify-between">
          <ReactLogo />
          <div className="text-5xl font-semibold">React</div>
        </Stack>
        <Stack gutter="5" className="items-center justify-between">
          <div className="text-8xl font-semibold mt-8 text-[#151b25]">+</div>
        </Stack>
        <Stack gutter="5" className="items-center justify-between">
          <RsbuildLogo />
          <div className="text-5xl font-semibold bg-clip-text [-webkit-text-fill-color:transparent] bg-[linear-gradient(279deg,#ff8b00_35.21%,#f93920_63.34%)]">
            Rsbuild
          </div>
        </Stack>
        <Stack gutter="5" className="items-center justify-between">
          <div className="text-8xl font-semibold mt-8 text-[#151b25]">+</div>
        </Stack>
        <Stack gutter="5" className="items-center justify-between">
          <img
            width="180px"
            height="180px"
            alt=""
            className="w-[180px]"
            src="https://raw.githubusercontent.com/honojs/website/refs/heads/main/public/images/logo-large.png"
          />
          <div className="text-5xl font-semibold">Hono SSR</div>
        </Stack>
      </div>
      <div className="text-2xl font-semibold mb-4">
        Template for using stream-based SSR with React
      </div>
      <div className="text-xl font-medium">
        Built with Rsbuild and deployable to Cloudflare Workers/Pages
      </div>
      <div className="text-xl font-medium mb-2">
        Supports React Router and @tanstack/react-query
      </div>
      <div className="text-xl font-medium mb-8">
        <code>Disclaimer:</code> This setup is not intended for large-scale
        apps, use Next.js or Remix instead.
      </div>
      <div>Home</div>
      <Link to="/about">Go to About</Link>
      <div className="mt-4 p-4 bg-[#181a20] w-full">
        <React.Suspense fallback={<p>Loading 2000ms</p>}>
          <Delay delay={2000} />
        </React.Suspense>
        <React.Suspense fallback={<p>Loading 4000ms</p>}>
          <Delay delay={4000} />
        </React.Suspense>
        <React.Suspense fallback={<p>Loading 1000ms</p>}>
          <Delay delay={1000} />
        </React.Suspense>
        <Colors />
      </div>
    </Layout>
  )
}

export default IndexPage
