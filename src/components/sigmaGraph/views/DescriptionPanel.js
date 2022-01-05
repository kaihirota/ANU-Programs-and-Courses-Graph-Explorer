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
        This web application has been developed by{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://www.ouestware.com/en/"
        >
          OuestWare
        </a>
        , using{' '}
        <a target="_blank" rel="noreferrer" href="https://reactjs.org/">
          react
        </a>{' '}
        and{' '}
        <a target="_blank" rel="noreferrer" href="https://www.sigmajs.org">
          sigma.js
        </a>
        . You can read the source code{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://github.com/jacomyal/sigma.js/tree/main/demo"
        >
          on GitHub
        </a>
        .
      </p>
      <p>
        Nodes sizes are related to their{' '}
        <a
          target="_blank"
          rel="noreferrer"
          href="https://en.wikipedia.org/wiki/Betweenness_centrality"
        >
          betweenness centrality
        </a>
        . More central nodes (ie. bigger nodes) are important crossing points in
        the network. Finally, You can click a node to open the related Wikipedia
        article.
      </p>
    </Panel>
  )
}

export default DescriptionPanel
