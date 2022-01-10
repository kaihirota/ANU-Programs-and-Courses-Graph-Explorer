import React, { useEffect, useState } from 'react'
import '../graph.css'
import DataController from './DataController'
import {
  extractDataset,
  NEO4J_PASSWORD,
  NEO4J_URI,
  NEO4J_USER,
} from '../../utils'
import GraphSettingsController from '../sigmaGraph/views/GraphSettingsController'
import EventsController from './EventsController'
import { drawHoverForProgram } from '../sigmaGraph/canvas-utils'
import { useSelector } from 'react-redux'

const neo4j = require('neo4j-driver')
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
)

const CYPHER_QUERY =
  'MATCH p=(:Program {id: $program_id})-[r:REQUIREMENT*1..]->() RETURN p'

export default function ProgramGraph() {
  const programId = useSelector((state) =>
    state.selections.programId ? state.selections.programId : ''
  )
  const [hoveredNode, setHoveredNode] = useState()
  const [clickedNode, setClickedNode] = useState('')
  const [dataset, setDataset] = useState({
    nodes: [],
    edges: [],
    tags: [],
  })

  const extractNode = (node) => {
    let extracted = {
      ...node.properties,
      tag: node.labels[0],
    }

    if (extracted.tag === 'Requirement' && node.properties.units) {
      extracted.label = node.properties.units.low
    } else if (extracted.tag === 'Program') {
      extracted.label = node.properties.name
    } else if (extracted.tag === 'Specialisation') {
      extracted.label = node.properties.name
    } else if (extracted.tag === 'Course') {
      extracted.label = `${node.properties.id} ${node.properties.name}`
    }
    return extracted
  }

  useEffect(() => {
    if (programId !== '') {
      const session = driver.session({ defaultAccessMode: neo4j.session.READ })
      session
        .run(CYPHER_QUERY, { program_id: programId })
        .then((result) => {
          const dataset = extractDataset(result.records, extractNode)
          setDataset(dataset)
        })
        .catch((error) => {
          console.log(error)
        })
        .then(() => session.close())
    }
  }, [programId])

  return (
    <React.Fragment>
      <div className="graph-container">
        <GraphSettingsController
          hoveredNode={hoveredNode}
          drawHover={drawHoverForProgram}
        />
        <EventsController
          setHoveredNode={setHoveredNode}
          setClickedNode={setClickedNode}
        />
        <DataController dataset={dataset} />
      </div>
    </React.Fragment>
  )
}
