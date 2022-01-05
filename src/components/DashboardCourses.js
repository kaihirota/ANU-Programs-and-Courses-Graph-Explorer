import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Paper } from '@material-ui/core'
import clsx from 'clsx'
import getNodeImageProgram from 'sigma/rendering/webgl/programs/node.image'
import Title from './Title'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'react-sigma-v2/lib/react-sigma-v2.css'
import './sigmaGraph/styles.css'
import SigmaGraph from './sigmaGraph/SigmaGraph'
import drawLabel from './sigmaGraph/canvas-utils'
import { SigmaContainer } from 'react-sigma-v2'

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     padding: theme.spacing(2),
//     display: 'flex',
//     overflow: 'auto',
//     flexDirection: 'column',
//   },
//   container: {
//     paddingTop: theme.spacing(4),
//     paddingBottom: theme.spacing(4),
//   },
// }))

export default function DashboardCourses() {
  // const theme = useTheme()
  // const fixedHeightPaper = clsx(useStyles(theme).paper)

  return (
    <React.Fragment>
      <Title>Courses</Title>
      {/*<Container style={{ height: '600px' }}>*/}
      {/*<Paper className={fixedHeightPaper}>*/}
      <div className="root-container">
        <SigmaContainer
          graphOptions={{ type: 'directed' }}
          style={{ height: '600px', width: '100%' }}
          initialSettings={{
            nodeProgramClasses: { image: getNodeImageProgram() },
            labelRenderer: drawLabel,
            defaultNodeType: 'image',
            defaultEdgeType: 'arrow',
            labelDensity: 0.07,
            labelGridCellSize: 60,
            labelRenderedSizeThreshold: 15,
            labelFont: 'Lato, sans-serif',
            zIndex: true,
          }}
          className="react-sigma"
        >
          <SigmaGraph />
        </SigmaContainer>
      </div>
      {/*</Paper>*/}
      {/*</Container>*/}
    </React.Fragment>
  )
}
