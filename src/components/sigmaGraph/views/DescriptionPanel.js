import React from 'react'
import { BsInfoCircle } from 'react-icons/bs'

import Panel from './Panel'

const DescriptionPanel = () => {
  return (
    <Panel
      initiallyDeployed
      title={
        <>
          <BsInfoCircle className="text-muted" /> Description
        </>
      }
    >
      <p>
        This web application has been developed by Kai Hirota, a Master of
        Computing student at the ANU. Majority of the code for visualisation is
        taken from{' '}
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
      <p>
        Node sizes are calculated based on the number of in-edges, or the number
        of classes that require a particular class as a prerequisite. i.e.
        Larger nodes are more &quot;important&quot; classes which should be
        taken earlier on.
      </p>
    </Panel>
  )
}

export default DescriptionPanel
