import React, { useContext, useEffect } from 'react'
import { BsInfoCircle } from 'react-icons/bs'

import Panel from './Panel'
import CourseContext from '../CourseContext'
import { useSigma } from 'react-sigma-v2'
import PropTypes from 'prop-types'

const DescriptionContent = (props) => {
  const { selectedNode } = props
  const sigma = useSigma()
  const graph = sigma.getGraph()

  if (selectedNode === '') {
    return (
      <>
        <p>
          Click on a node to see details about a class, or double-click to jump
          to ANU course page.
        </p>
        <p>
          Node sizes are calculated based on the number of in-edges, or the
          number of classes that require a particular class as a prerequisite.
          i.e. Larger nodes are more &quot;important&quot; classes which should
          be taken earlier on.
        </p>
        <hr />
        <p>
          This web application has been developed by Kai Hirota, a Master of
          Computing student at the ANU. Majority of the code for visualisation
          is taken from{' '}
          <a target="_blank" rel="noreferrer" href="https://www.sigmajs.org/">
            Sigma.js
          </a>
          . You can read the original source code{' '}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/jacomyal/sigma.js/tree/main/demo"
          >
            here
          </a>
          , or the source code for this website
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/from81/ANU-Programs-and-Courses-Graph-Explorer"
          >
            here
          </a>
          .
        </p>
      </>
    )
  } else {
    const attrs = graph.getNodeAttributes(selectedNode)
    return (
      <>
        <p>
          {attrs.id}
          <br />
          {attrs.name}
          <br />
          {attrs.units.low} units
        </p>
        <p>
          Subject: {attrs.subject}
          <br />
          College: {attrs.college}
          <br />
          Offered by: {attrs.offered_by}
          <br />
          Course Convener: {attrs.course_convener}
          <br />
        </p>
        <p>
          <b>Description:</b>
          <br />
          {attrs.description}
        </p>
        <p>
          <b>Prerequisites:</b>
          <br />
          {attrs.prerequisites_raw || 'None'}
        </p>
        <hr />
        <p>
          <a
            href={`https://programsandcourses.anu.edu.au/course/${attrs.id}`}
            rel="noreferrer"
            target="_blank"
          >
            {'Read on ANU website'}
          </a>
        </p>
      </>
    )
  }
}

DescriptionContent.propTypes = {
  selectedNode: PropTypes.string,
}

const DescriptionPanel = () => {
  const course = useContext(CourseContext)
  useEffect(() => {
    console.log(course)
  }, [course.clickedNode])

  return (
    <Panel
      initiallyDeployed
      title={
        <>
          <BsInfoCircle className="text-muted" /> Description
        </>
      }
    >
      <DescriptionContent selectedNode={course.clickedNode} />
    </Panel>
  )
}

export default DescriptionPanel
