import React, { useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'
import Neovis from 'neovis.js/dist/neovis.js'
import Title from './Title'
import CourseTable from './CourseTable'
import './graph.css'

const neo4jUri = process.env.REACT_APP_NEO4J_URI || 'localhost:7687'
const neo4jUser = process.env.REACT_APP_NEO4J_USER || 'neo4j'
const neo4jPassword = process.env.REACT_APP_NEO4J_PASSWORD || 'neo4j'
const CompletionEvent = 'completed'
const QUERY_GET_PROGRAMS = gql`
  {
    programs(options: { limit: 50, skip: 80 }) {
      id
      name
    }
  }
`

export default function ProgramGraphs() {
  const [loading_curr, setLoading] = useState(false)
  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  const drawGraph = (program_id) => {
    const config = {
      container_id: 'graph-vis',
      server_url: neo4jUri,
      server_user: neo4jUser,
      server_password: neo4jPassword,
      labels: {
        Course: {
          caption: 'id',
          title_properties: ['id', 'name', 'units'],
        },
        Specialisation: {
          caption: 'name',
          title_properties: ['id', 'name'],
        },
        Program: {
          caption: 'name',
          title_properties: ['id', 'name', 'units'],
        },
        Requirement: {
          caption: 'units',
          title_properties: ['units', 'description'],
        },
      },
      relationships: {
        REQUIREMENT: {
          caption: false,
          thickness: 'none',
        },
      },
      arrows: true,
      hierarchical: false,
      //   hierarchical: true,
      //   hierarchical_sort_method: 'directed',
      initial_cypher: `MATCH p=(:Program {id: '${program_id}'})-[r:REQUIREMENT*1..]->() RETURN p`,
    }

    document.getElementById('graph-vis').innerHTML = ''
    setLoading(true)
    const vis = new Neovis(config)
    vis.registerOnEvent(CompletionEvent, () => {
      setLoading(false)
    })
    vis.render()
  }

  const handleChange = (e) => {
    drawGraph(e.target.value)
  }

  return (
    <React.Fragment>
      <Title>Program Graph</Title>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select degree</InputLabel>
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
      <div className="graph-and-loading-icon-wrapper">
        <div className="loading-icon-wrapper">
          {loading && <CircularProgress size={100} />}
        </div>
        <div id="graph-vis"></div>
      </div>
      <Title>Courses</Title>
      <CourseTable></CourseTable>
    </React.Fragment>
  )
}
