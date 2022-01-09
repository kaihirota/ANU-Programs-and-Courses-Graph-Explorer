import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  CircularProgress,
  Container,
  Paper,
  TextField,
} from '@material-ui/core'
import clsx from 'clsx'

import ProgramGraph from './programGraph/ProgramGraph'
import { useQuery } from '@apollo/client'
import Title from './Title'
import { Autocomplete } from '@mui/material'
import { getUniquePrograms, QUERY_GET_PROGRAMS } from '../utils'
import getNodeImageProgram from 'sigma/rendering/webgl/programs/node.image'
import { drawLabelForProgramGraph } from './sigmaGraph/canvas-utils'
import { SigmaContainer } from 'react-sigma-v2'
import {
  ProgramCoursesContext,
  SelectedCoursesContext,
  SelectedProgramContext,
} from '../contexts'
import CourseTable from './programGraph/CourseTable'

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    height: 'auto',
    flexDirection: 'column',
  },
}))

export default function DashboardPrograms() {
  const [programCourses, setProgramCourses] = useState('')
  const [programId, setProgramId] = useState('')
  const [selectedCourses, setSelectedCourses] = useState([])
  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)

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
          <ProgramCoursesContext.Provider
            value={{ programCourses, setProgramCourses }}
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
                <SigmaContainer
                  graphOptions={{ type: 'directed', multi: true }}
                  style={{ height: '600px', width: '100%' }}
                  initialSettings={{
                    nodeProgramClasses: { image: getNodeImageProgram() },
                    labelRenderer: drawLabelForProgramGraph,
                    defaultNodeType: 'image',
                    defaultEdgeType: 'arrow',
                    labelDensity: 0.07,
                    labelGridCellSize: 60,
                    labelRenderedSizeThreshold: 11,
                    labelFont: 'Lato, sans-serif',
                    zIndex: true,
                  }}
                  className="react-sigma"
                >
                  <ProgramGraph />
                </SigmaContainer>
                <CourseTable />
              </Paper>
            </Container>
          </ProgramCoursesContext.Provider>
        </SelectedCoursesContext.Provider>
      </SelectedProgramContext.Provider>
    </React.Fragment>
  )
}
