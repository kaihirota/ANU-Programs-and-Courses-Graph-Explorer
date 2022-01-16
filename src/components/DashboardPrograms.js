import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Paper, TextField } from '@material-ui/core'
import clsx from 'clsx'

import CourseTable from './CourseTable'
import ProgramGraph from './ProgramGraph'
import { gql, useQuery } from '@apollo/client'
import { Autocomplete } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { clearCourse, setProgram } from '../selections'
import {
  extractDataset,
  getUniquePrograms,
  NEO4J_PASSWORD,
  NEO4J_URI,
  NEO4J_USER,
} from '../utils'

const QUERY_GET_PROGRAMS = gql`
  {
    programs {
      id
      name
    }
  }
`

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}))

const neo4j = require('neo4j-driver')
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
)

const CYPHER_QUERY =
  'MATCH p=(:Program {id: $program_id})-[r:REQUIREMENT*1..]->() RETURN DISTINCT p'

const extractNode = (node) => {
  let extracted = {
    ...node.properties,
    tag: node.labels[0],
  }

  if (extracted.tag === 'Requirement' && node.properties.units) {
    extracted.label = node.properties.units.low
  } else if (extracted.tag === 'Program') {
    extracted.label = node.properties.name
  } else if (extracted.tag === 'Specialisation') {
    extracted.label = node.properties.name
  } else if (extracted.tag === 'Course') {
    extracted.label = `${node.properties.id} - ${node.properties.name}`
  }
  return extracted
}

export default function DashboardPrograms() {
  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)
  const dispatch = useDispatch()
  const programId = useSelector((state) =>
    state.selections.programId ? state.selections.programId : 'Program'
  )
  const [clearSelected, setClearSelected] = useState(false)
  const [dataset, setDataset] = useState({
    nodes: [],
    edges: [],
    tags: [],
  })

  // get classes if program is selected
  useEffect(() => {
    if (programId !== '') {
      const session = driver.session({ defaultAccessMode: neo4j.session.READ })
      session
        .run(CYPHER_QUERY, { program_id: programId })
        .then((result) => {
          const dataset = extractDataset(result.records, extractNode)
          setDataset(dataset)
        })
        .catch((error) => {
          console.log(error)
        })
        .then(() => session.close())
    }
  }, [programId])

  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return null

  const programs = getUniquePrograms(data.programs)
  // console.log(programs)

  function handleSelection(event, value, reason, details) {
    if (reason === 'selectOption' && value) {
      dispatch(setProgram(value.id))
      dispatch(clearCourse())
      setClearSelected(true)
    }
  }

  return (
    <React.Fragment>
      <Container>
        <Paper className={fixedHeightPaper}>
          <Autocomplete
            disablePortal
            options={programs}
            getOptionLabel={(option) => `${option.name} - ${option.id}`}
            sx={{ width: 400 }}
            renderInput={(params) => {
              return <TextField {...params} label="Choose a Program" />
            }}
            onChange={handleSelection}
          />
          <ProgramGraph dataset={dataset} />
          <CourseTable dataset={dataset} clearSelected={clearSelected} />
        </Paper>
      </Container>
    </React.Fragment>
  )
}
