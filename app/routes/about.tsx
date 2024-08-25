import React from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../layout'
import { getData } from 'utils/get-data'
import { useQuery } from '@tanstack/react-query'

const AboutPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['games'],
    queryFn: getData,
    staleTime: 1000 * 60
  })
  return (
    <Layout>
      <h1>About</h1>
      <Link to="/">Go Home</Link>
      {isLoading ? (
        'Loading...'
      ) : (
        <ul>
          {data?.map(game => (
            <li key={`${game.id}-${game.name}`}>{game.name}</li>
          ))}
        </ul>
      )}
    </Layout>
  )
}

export default AboutPage
