import React, { useState } from 'react'
import getNodeImageProgram from 'sigma/rendering/webgl/programs/node.image'
import Title from './Title'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'react-sigma-v2/lib/react-sigma-v2.css'
import '../styles.css'
import SigmaGraph from './sigmaGraph/SigmaGraph'
import drawLabel from './sigmaGraph/canvas-utils'
import { SigmaContainer } from 'react-sigma-v2'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'

export default function DashboardCourses() {
  const [academicCareer, setAcademicCareer] = useState('UGRD')
  const handleChange = (e) => {
    setAcademicCareer(e.target.value)
  }
  return (
    <React.Fragment>
      <Title>Courses</Title>
      {/*<FormControl style={{ width: '200px' }}>*/}
      {/*  <InputLabel id="demo-simple-select-label">Academic Career</InputLabel>*/}
      {/*  <Select*/}
      {/*    labelId="demo-simple-select-label"*/}
      {/*    id="demo-simple-select"*/}
      {/*    value={academicCareer}*/}
      {/*    label="Type"*/}
      {/*    onChange={handleChange}*/}
      {/*  >*/}
      {/*    <MenuItem value="UGRD">Undergraduate</MenuItem>*/}
      {/*    <MenuItem value="PGRD">Postgraduate</MenuItem>*/}
      {/*  </Select>*/}
      {/*</FormControl>*/}
      <div className="graph-container">
        <SigmaContainer
          id="sigma"
          graphOptions={{ type: 'directed', multi: true }}
          initialSettings={{
            nodeProgramClasses: { image: getNodeImageProgram() },
            labelRenderer: drawLabel,
            defaultNodeType: 'image',
            defaultEdgeType: 'arrow',
            labelDensity: 0.07,
            labelGridCellSize: 60,
            labelRenderedSizeThreshold: 30,
            labelFont: 'Lato, sans-serif',
            zIndex: true,
          }}
          className="react-sigma"
        >
          <SigmaGraph academicCareer={academicCareer} />
        </SigmaContainer>
      </div>
    </React.Fragment>
  )
}
