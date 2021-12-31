import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Paper } from '@material-ui/core'
import clsx from 'clsx'

import ProgramGraphs from './ProgramGraphs'
import CourseTable from './CourseTable'
import { gql, useQuery } from '@apollo/client'
import Title from './Title'

const QUERY_GET_PROGRAMS = gql`
  {
    programs(options: { limit: 50, skip: 80 }) {
      id
      name
    }
  }
`

export default function Dashboard() {
  const theme = useTheme()

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
  const classes = useStyles(theme)
  const fixedHeightPaper = clsx(classes.paper)
  const { loading, error, data } = useQuery(QUERY_GET_PROGRAMS)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  return (
    <React.Fragment>
      <Container>
        <Paper className={fixedHeightPaper}>
          <Title>Program Graph</Title>
          <ProgramGraphs programs={data.programs} />
          <Title>Courses</Title>
          <CourseTable programs={data.programs} />
        </Paper>
      </Container>
    </React.Fragment>
  )
}
