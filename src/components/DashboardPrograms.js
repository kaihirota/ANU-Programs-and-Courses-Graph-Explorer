import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  CircularProgress,
  Container,
  Paper,
  TextField,
} from '@material-ui/core'
import clsx from 'clsx'

import ProgramGraphs from './ProgramGraphs'
import CourseTable from './CourseTable'
import { useQuery } from '@apollo/client'
import Title from './Title'
import { Autocomplete } from '@mui/material'
import {
  extractDataset,
  getUniquePrograms,
  NEO4J_PASSWORD,
  NEO4J_URI,
  NEO4J_USER,
  QUERY_GET_PROGRAMS,
} from '../utils'
import getNodeImageProgram from 'sigma/rendering/webgl/programs/node.image'
import drawLabel from './sigmaGraph/canvas-utils'
import { SigmaContainer } from 'react-sigma-v2'
import { SelectedCoursesContext, SelectedProgramContext } from '../contexts'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
}))

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
    extracted.label = `${node.properties.id} ${node.properties.name}`
  }
  return extracted
}

const neo4j = require('neo4j-driver')
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
)

const CYPHER_QUERY =
  'MATCH p=(:Program {id: $program_id})-[r:REQUIREMENT*1..]->() RETURN p'

export default function DashboardPrograms() {
  const [programId, setProgramId] = useState('')
  const [selectedCourses, setSelectedCourses] = useState([])

  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)

  useEffect(() => {
    if (programId !== '') {
      const session = driver.session({ defaultAccessMode: neo4j.session.READ })
      session
        .run(CYPHER_QUERY, { program_id: programId })
        .then((result) => {
          const dataset = extractDataset(result.records, extractNode)
          console.log(dataset)
        })
        .catch((error) => {
          console.log(error)
        })
        .then(() => session.close())
    }
  }, [programId])

  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return <CircularProgress />

  const programs = getUniquePrograms(data.programs)

  const selectedProgram = programs.filter((p) => p.id === programId)

  const updateContext = (e) => {
    const selectedProgram = e.target.textContent
      ? e.target.textContent
      : e.target.value
    const [selectedProgramName, selectedProgramId] =
      selectedProgram.split(' - ')

    if (selectedProgramId && selectedProgramId !== '') {
      // update selected program context
      setProgramId(selectedProgramId)
      // when new program is selected, clear selected classes
      setSelectedCourses([])
    }
  }

  return (
    <React.Fragment>
      <SelectedProgramContext.Provider value={{ programId, setProgramId }}>
        <SelectedCoursesContext.Provider
          value={{ selectedCourses, setSelectedCourses }}
        >
          <Container>
            <Paper className={fixedHeightPaper}>
              <Autocomplete
                disablePortal
                options={programs}
                getOptionLabel={(option) => `${option.name} - ${option.id}`}
                sx={{ width: 400 }}
                renderInput={(params) => {
                  return (
                    <TextField
                      {...params}
                      label={
                        selectedProgram && selectedProgram.length > 0
                          ? `${selectedProgram[0].name} - ${programId}`
                          : 'Program'
                      }
                    />
                  )
                }}
                onChange={updateContext}
                onClose={updateContext}
              />
              <Title>Program Graph</Title>
              <div className="graph-container">
                {/*  <SigmaContainer*/}
                {/*    graphOptions={{ type: 'directed', multi: true }}*/}
                {/*    style={{ height: '600px', width: '100%' }}*/}
                {/*    initialSettings={{*/}
                {/*      nodeProgramClasses: { image: getNodeImageProgram() },*/}
                {/*      labelRenderer: drawLabel,*/}
                {/*      defaultNodeType: 'image',*/}
                {/*      defaultEdgeType: 'arrow',*/}
                {/*      labelDensity: 0.07,*/}
                {/*      labelGridCellSize: 60,*/}
                {/*      labelRenderedSizeThreshold: 15,*/}
                {/*      labelFont: 'Lato, sans-serif',*/}
                {/*      zIndex: true,*/}
                {/*    }}*/}
                {/*    className="react-sigma"*/}
                {/*  >*/}
                <ProgramGraphs />
                {/*</SigmaContainer>*/}
              </div>
              <Title>Courses</Title>
              <CourseTable />
            </Paper>
          </Container>
        </SelectedCoursesContext.Provider>
      </SelectedProgramContext.Provider>
    </React.Fragment>
  )
}
