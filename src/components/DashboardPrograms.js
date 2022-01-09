import React, { useContext, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Paper, TextField } from '@material-ui/core'
import clsx from 'clsx'

import ProgramGraphs from './ProgramGraphs'
import CourseTable from './CourseTable'
import { gql, useQuery } from '@apollo/client'
import Title from './Title'
import { SelectedCourseRowContext, SelectedProgramContext } from '../contexts'
import { Autocomplete } from '@mui/material'

const QUERY_GET_PROGRAMS = gql`
  {
    programs {
      id
      name
    }
  }
`

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

const getUniquePrograms = (programs) => {
  let obj = {}
  programs
    .filter((program) => program.id && program.id !== '')
    .filter((program) => program.name && program.name.trim() !== '')
    .forEach((program) => {
      obj[program.id] = program
    })
  return Object.keys(obj).map(function (id) {
    return obj[id]
  })
}

export default function DashboardPrograms() {
  const selectedProgramContext = useContext(SelectedProgramContext)
  const selectedCourseRowContext = useContext(SelectedCourseRowContext)
  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)

  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  const programs = getUniquePrograms(data.programs)

  const updateContext = (e) => {
    const selectedProgram = e.target.textContent
      ? e.target.textContent
      : e.target.value
    const [programName, programId] = selectedProgram.split(' - ')

    if (programId && programId !== '') {
      // update selected program context
      selectedProgramContext.saveSelectedProgramContext({
        program: programId,
        saveSelectedProgramContext:
          selectedProgramContext.saveSelectedProgramContext,
      })
      // when new program is selected, clear selected classes
      selectedCourseRowContext.saveSelectedCourseRowContext({
        coursesTaken: [],
        saveSelectedCourseRowContext:
          selectedCourseRowContext.saveSelectedCourseRowContext,
      })
    }
  }

  const selectedProgram = programs.filter(
    (p) => p.id === selectedProgramContext.program
  )
  const label =
    selectedProgram && selectedProgram.length > 0
      ? `${selectedProgram[0].name} - ${selectedProgramContext.program}`
      : 'Program'
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
              return <TextField {...params} label={label} />
            }}
            onChange={updateContext}
            onClose={updateContext}
          />
          <ProgramGraphs />
          <CourseTable />
        </Paper>
      </Container>
    </React.Fragment>
  )
}
