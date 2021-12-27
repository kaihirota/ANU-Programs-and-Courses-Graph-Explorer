import React from 'react'
import { useTheme } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
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
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={7}>
          <Paper className={fixedHeightPaper}>
            <ProgramGraphs />
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  )
}
