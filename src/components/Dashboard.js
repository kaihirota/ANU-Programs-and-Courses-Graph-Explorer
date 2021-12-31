import React, { useContext } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from '@material-ui/core'
import clsx from 'clsx'

import ProgramGraphs from './ProgramGraphs'
import CourseTable from './CourseTable'
import { gql, useQuery } from '@apollo/client'
import Title from './Title'
import UserContext from '../UserContext'
import { set } from 'husky'

const QUERY_GET_PROGRAMS = gql`
  {
    programs(options: { limit: 50, skip: 80 }) {
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

export default function Dashboard() {
  const theme = useTheme()
  const classes = useStyles(theme)
  const fixedHeightPaper = clsx(classes.paper)
  const user = useContext(UserContext)
  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  const handleChange = (e) => {
    user.saveUserContext({
      program: e.target.value,
      saveUserContext: user.saveUserContext,
    })
  }

  return (
    <React.Fragment>
      <Container>
        <Paper className={fixedHeightPaper}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select degree</InputLabel>
            <Select label="Program Name" onChange={handleChange}>
              {data.programs.map((program) => {
                return (
                  <MenuItem
                    key={program.id}
                    value={program.id}
                    name={program.name}
                  >
                    {program.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <Title>Program Graph</Title>
          <ProgramGraphs />
          <Title>Courses</Title>
          <CourseTable programs={data.programs} />
        </Paper>
      </Container>
    </React.Fragment>
  )
}
