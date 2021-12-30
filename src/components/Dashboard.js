import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Paper } from '@material-ui/core'
import clsx from 'clsx'

import ProgramGraphs from './ProgramGraphs'

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

  return (
    <React.Fragment>
      <Container>
        <Paper className={fixedHeightPaper}>
          <ProgramGraphs />
        </Paper>
      </Container>
    </React.Fragment>
  )
}
