import React, { useContext, useEffect, useState } from 'react'
import { FormControlLabel } from '@material-ui/core'
import Neovis from 'neovis.js/dist/neovis.js'
import './graph.css'
import { SelectedProgramContext } from '../contexts'
import Switch from '@mui/material/Switch'
import { NEO4J_PASSWORD, NEO4J_URI, NEO4J_USER } from '../utils'

const CompletionEvent = 'completed'

export default function ProgramGraphs() {
  const { programId, setProgramId } = useContext(SelectedProgramContext)
  const [loading, setLoading] = useState(false)
  const [hierarchicalSort, setHierarchicalSort] = useState(false)

  const drawGraph = (program_id) => {
    const config = {
      container_id: 'graph-vis',
      server_url: NEO4J_URI,
      server_user: NEO4J_USER,
      server_password: NEO4J_PASSWORD,
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
    if (programId && programId !== '') {
      drawGraph(programId)
    }
  }, [programId, hierarchicalSort])

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
        <div id="graph-vis" />
      </div>
    </React.Fragment>
  )
}
