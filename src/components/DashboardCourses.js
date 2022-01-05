import React from 'react'
import getNodeImageProgram from 'sigma/rendering/webgl/programs/node.image'
import Title from './Title'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'react-sigma-v2/lib/react-sigma-v2.css'
import '../styles.css'
import SigmaGraph from './sigmaGraph/SigmaGraph'
import drawLabel from './sigmaGraph/canvas-utils'
import { SigmaContainer } from 'react-sigma-v2'

export default function DashboardCourses() {
  return (
    <React.Fragment>
      <Title>Courses</Title>
      <div className="graph-container">
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
    </React.Fragment>
  )
}
