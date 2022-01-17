import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  CircularProgress,
  Container,
  Paper,
  TextField,
} from '@material-ui/core'
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
import { useQuery as useCachedQuery } from 'react-query'

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

export default function DashboardPrograms() {
  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)
  const dispatch = useDispatch()
  const programId = useSelector((state) =>
    state.selections.programId ? state.selections.programId : 'Program'
  )
  const [clearSelected, setClearSelected] = useState(false)

  const result = useCachedQuery(programId, async () => {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ })

    const result = await session.run(CYPHER_QUERY, {
      program_id: programId,
    })
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

    return extractDataset(result.records, extractNode)
  })

  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return null
  if (result.isLoading) {
    return (
      <CircularProgress style={{ position: 'absolute', top: 1, left: 0 }} />
    )
  }
  const dataset = result.data
  console.log(dataset)

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
