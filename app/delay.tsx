import React, { use } from 'react'
import { delay } from 'utils/delay'

const delayMessage = async (ms: number) => {
  await delay(ms)
  return `Loaded after ${ms}ms`
}

const Delay: React.FC<{ delay: number }> = ({ delay = 1000 }) => {
  const value = use(delayMessage(delay))
  return <div>{value}</div>
}

export default Delay
