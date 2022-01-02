import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Paper } from '@material-ui/core'
import clsx from 'clsx'
import Title from './Title'

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

export default function DashboardCourses() {
  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)

  return (
    <React.Fragment>
      <Container>
        <Paper className={fixedHeightPaper}>
          <Title>Courses</Title>
        </Paper>
      </Container>
    </React.Fragment>
  )
}
