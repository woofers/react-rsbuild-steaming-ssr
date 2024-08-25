import { delay } from './delay'

type Game = {
  id: number
  name: string
  genre: string[]
  developers: string[]
  publishers: string[]
  releaseDates: string[]
}

export const getData = async () => {
  const resp = await fetch('https://api.sampleapis.com/switch/games')
  const json = await resp.json()
  const games = json as Game[]
  return games.slice(0, 50)
}
