import React, { useState } from 'react'
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'
import Neovis from 'neovis.js/dist/neovis.js'
import './graph.css'
import PropTypes from 'prop-types'

const neo4jUri = process.env.REACT_APP_NEO4J_URI || 'localhost:7687'
const neo4jUser = process.env.REACT_APP_NEO4J_USER || 'neo4j'
const neo4jPassword = process.env.REACT_APP_NEO4J_PASSWORD || 'neo4j'
const CompletionEvent = 'completed'

export default function ProgramGraphs(props) {
  const { programs } = props
  const [loading, setLoading] = useState(false)

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
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select degree</InputLabel>
        <Select label="Program Name" onChange={handleChange}>
          {programs.map((program) => {
            return (
              <MenuItem key={program.id} value={program.id} name={program.name}>
                {program.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      <div className="graph-and-loading-icon-wrapper">
        <div className="loading-icon-wrapper">
          {loading && <CircularProgress size={100} />}
        </div>
        <div id="graph-vis" />
      </div>
    </React.Fragment>
  )
}

ProgramGraphs.propTypes = {
  programs: PropTypes.array.isRequired,
}
