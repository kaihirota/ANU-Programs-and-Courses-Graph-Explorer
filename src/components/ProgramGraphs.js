import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'

import Title from './Title'
import { NeoGraph, ResponsiveNeoGraph } from './NeoGraph'

const QUERY_GET_PROGRAMS = gql`
  {
    programs(options: { limit: 50, skip: 80 }) {
      id
      name
    }
  }
`

const handleChange = (e) => {
  console.log(e.target.value)
  //   console.log(process.env.REACT_APP_NEO4J_URI)
  //   draw(e.target.value)
}

const server_url = process.env.REACT_APP_NEO4J_URI || 'localhost:7687'
const server_user = process.env.REACT_APP_NEO4J_USER || 'neo4j'
const server_password = process.env.REACT_APP_NEO4J_PASSWORD || 'neo4j'

export default function ProgramGraphs() {
  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  return (
    <React.Fragment>
      <Title>Program Graph</Title>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Program</InputLabel>
        <Select label="Program Name" onChange={handleChange}>
          {data.programs.map((n) => {
            return (
              <MenuItem key={n.id} value={n.id} name={n.name}>
                {n.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <NeoGraph
        containerId={'id0'}
        neo4jUri={server_url}
        neo4jUser={server_user}
        neo4jPassword={server_password}
      />
    </React.Fragment>
  )
}
