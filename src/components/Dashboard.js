import React, { useContext } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from '@material-ui/core'
import clsx from 'clsx'

import ProgramGraphs from './ProgramGraphs'
import CourseTable from './CourseTable'
import { gql, useQuery } from '@apollo/client'
import Title from './Title'
import UserContext from '../UserContext'
import { set } from 'husky'
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

export default function Dashboard() {
  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)
  const user = useContext(UserContext)
  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  const programs = getUniquePrograms(data.programs)

  const updateContext = (e) => {
    const [programName, programId] = e.target.textContent.split(' - ')
    if (programId && programId !== '') {
      user.saveUserContext({
        program: programId,
        saveUserContext: user.saveUserContext,
      })
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
            renderInput={(params) => <TextField {...params} label="Program" />}
            onChange={updateContext}
          />
          <Title>Program Graph</Title>
          <ProgramGraphs />
          <Title>Courses</Title>
          <CourseTable />
        </Paper>
      </Container>
    </React.Fragment>
  )
}
