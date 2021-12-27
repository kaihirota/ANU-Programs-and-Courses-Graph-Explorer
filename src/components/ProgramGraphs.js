import React, { useEffect, useState } from 'react'
import { useQuery, gql } from '@apollo/client'
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import Neovis from 'neovis.js/dist/neovis.js'

import Title from './Title'
// import { NeoGraph, ResponsiveNeoGraph } from './NeoGraph'

const QUERY_GET_PROGRAMS = gql`
  {
    programs(options: { limit: 50, skip: 80 }) {
      id
      name
    }
  }
`

const neo4jUri = process.env.REACT_APP_NEO4J_URI || 'localhost:7687'
const neo4jUser = process.env.REACT_APP_NEO4J_USER || 'neo4j'
const neo4jPassword = process.env.REACT_APP_NEO4J_PASSWORD || 'neo4j'

export default function ProgramGraphs() {
  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  const config = {
    container_id: 'program-vis',
    server_url: neo4jUri,
    server_user: neo4jUser,
    server_password: neo4jPassword,
    labels: {
      Course: {
        caption: 'name',
        title_properties: ['id', 'name', 'units'],
      },
      Program: {
        caption: 'name',
        title_properties: ['id', 'name', 'units'],
      },
      Specialisation: {
        caption: 'name',
        title_properties: ['id', 'name'],
      },
      Requirement: {
        caption: 'units',
        title_properties: ['units', 'description'],
      },
    },
    relationships: {
      REQUIREMENT: {
        caption: true,
      },
    },
    hierarchical: true,
    initial_cypher: `MATCH p=(:Program {name: 'Master of Machine Learning and Computer Vision'})-[r:REQUIREMENT*1..]->() RETURN p`,
  }

  const vis = new Neovis(config)
  vis.render()

  const handleChange = (e) => {
    console.log(e.target.value)
    vis.renderWithCypher(
      `MATCH p=(:Program {id: '${e.target.value}'})-[r:REQUIREMENT*1..]->() RETURN p`
    )
  }

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
      <div id="program-vis" width="800" height="600"></div>
    </React.Fragment>
  )
}
