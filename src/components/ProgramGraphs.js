import React, { useContext, useEffect, useState } from 'react'
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core'
import Neovis from 'neovis.js/dist/neovis.js'
import './graph.css'
import PropTypes from 'prop-types'
import UserContext from '../UserContext'
import Switch from '@mui/material/Switch'

const neo4jUri = process.env.REACT_APP_NEO4J_URI || 'localhost:7687'
const neo4jUser = process.env.REACT_APP_NEO4J_USER || 'neo4j'
const neo4jPassword = process.env.REACT_APP_NEO4J_PASSWORD || 'neo4j'
const CompletionEvent = 'completed'

export default function ProgramGraphs() {
  const user = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [hierarchicalSort, setHierarchicalSort] = useState(false)

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
      hierarchical: hierarchicalSort,
      hierarchical_sort_method: 'directed',
      initial_cypher: `MATCH p=(:Program {id: '${program_id}'})-[r:REQUIREMENT*1..]->() RETURN p`,
      encrypted: 'ENCRYPTION_ON',
      // trust: 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES',
    }

    document.getElementById('graph-vis').innerHTML = ''
    setLoading(true)
    const vis = new Neovis(config)
    vis.registerOnEvent(CompletionEvent, () => {
      setLoading(false)
    })
    vis.render()
  }

  useEffect(() => {
    if (user && user.program !== '') {
      drawGraph(user.program)
    }
  }, [user, hierarchicalSort])

  const handleChange = (e) => {
    setHierarchicalSort(e.target.checked)
  }

  return (
    <React.Fragment>
      <div className="graph-and-loading-icon-wrapper">
        <FormControlLabel
          control={
            <Switch
              size="large"
              checked={hierarchicalSort}
              onChange={handleChange}
            />
          }
          label="Hierarchical"
        />
        <div className="loading-icon-wrapper">
          {loading && <CircularProgress size={20} />}
        </div>
        <div id="graph-vis" />
      </div>
    </React.Fragment>
  )
}
