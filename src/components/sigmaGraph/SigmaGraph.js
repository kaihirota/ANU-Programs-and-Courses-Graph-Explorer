import React, { useEffect, useState } from 'react'
import { ZoomControl } from 'react-sigma-v2'
import { constant, keyBy, mapValues, omit, zip } from 'lodash'
import chroma from 'chroma-js'

import GraphSettingsController from './views/GraphSettingsController'
import GraphEventsController from './views/GraphEventsController'
import GraphDataController from './views/GraphDataController'
import DescriptionPanel from './views/DescriptionPanel'
import SearchField from './views/SearchField'
import GraphTitle from './views/GraphTitle'
import TagsPanel from './views/TagsPanel'

import 'react-sigma-v2/lib/react-sigma-v2.css'
import { GrClose } from 'react-icons/gr'
import { BiBookContent, BiRadioCircleMarked } from 'react-icons/bi'
import { BsZoomIn, BsZoomOut } from 'react-icons/bs'
import PropTypes from 'prop-types'

const neo4jUri = process.env.REACT_APP_NEO4J_URI || 'localhost:7687'
const neo4jUser = process.env.REACT_APP_NEO4J_USER || 'neo4j'
const neo4jPassword = process.env.REACT_APP_NEO4J_PASSWORD || 'neo4j'
const neo4j = require('neo4j-driver')
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
)
// Close the driver when application exits.
// This closes all used network connections.
// await driver.close()

const query =
  'MATCH p=(:Course {academic_career: $academicCareer})-[:PREREQUISITE]->(:Course {academic_career: $academicCareer}) RETURN p'

const extractNode = (node) => {
  return {
    ...node.properties,
    label: `${node.properties.id} ${node.properties.name}`,
    tag: node.properties.subject,
  }
}

const extractLink = (link) => {
  return {
    from: link.start.properties.id,
    to: link.end.properties.id,
    label: link.segments[0].relationship.type,
  }
}

const getTags = (nodes) => {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
  }
  const tags = nodes.map((n) => n.tag).filter(onlyUnique)
  const colors = chroma.scale('Spectral').colors(10)
  let ret = new Array(tags.length)
  for (let i = 0; i < tags.length; i++) {
    ret[i] = {
      key: tags[i],
      color: colors[i % 10],
    }
  }
  console.log(ret)

  return ret
}

const SigmaGraph = (props) => {
  const { academicCareer } = props
  const [showContents, setShowContents] = useState(false)
  const [dataset, setDataset] = useState({
    nodes: [],
    edges: [],
    tags: [],
  })
  const [dataReady, setDataReady] = useState(false)
  const [filtersState, setFiltersState] = useState({
    tags: {},
  })
  const [hoveredNode, setHoveredNode] = useState()

  useEffect(() => {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ })
    session
      .run(query, { academicCareer: academicCareer })
      .then((result) => {
        let nodesMap = {}
        const edges = result.records
          .map((item) => item.get('p'))
          .map((item) => {
            const edge = extractLink(item)
            nodesMap[edge.from] = extractNode(item.start)
            nodesMap[edge.to] = extractNode(item.end)
            return edge
          })
        const nodes = Object.keys(nodesMap).map((id) => nodesMap[id])
        const tags = getTags(nodes)
        setDataset({
          edges: edges,
          nodes: nodes,
          tags: tags,
        })
        setFiltersState({
          tags: mapValues(keyBy(tags, 'key'), constant(true)),
        })
        requestAnimationFrame(() => setDataReady(true))
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => session.close())
  }, [academicCareer])

  useEffect(() => {
    console.log(dataset)
  }, [dataset])

  return (
    <div className={showContents ? 'show-contents' : ''}>
      <GraphSettingsController hoveredNode={hoveredNode} />
      <GraphEventsController setHoveredNode={setHoveredNode} />
      <GraphDataController dataset={dataset} filters={filtersState} />

      {dataReady && (
        <>
          <div className="controls">
            <div className="ico">
              <button
                type="button"
                className="show-contents"
                onClick={() => setShowContents(true)}
                title="Show caption and description"
              >
                <BiBookContent />
              </button>
            </div>
            {/*<FullScreenControl*/}
            {/*  className="ico"*/}
            {/*  customEnterFullScreen={<BsArrowsFullscreen />}*/}
            {/*  customExitFullScreen={<BsFullscreenExit />}*/}
            {/*/>*/}
            <ZoomControl
              className="ico"
              customZoomIn={<BsZoomIn />}
              customZoomOut={<BsZoomOut />}
              customZoomCenter={<BiRadioCircleMarked />}
            />
          </div>
          <div className="contents">
            <div className="ico">
              <button
                type="button"
                className="ico hide-contents"
                onClick={() => setShowContents(false)}
                title="Show caption and description"
              >
                <GrClose />
              </button>
            </div>
            <GraphTitle filters={filtersState} />
            <div className="panels">
              <SearchField filters={filtersState} />
              <DescriptionPanel />
              <TagsPanel
                tags={dataset.tags}
                filters={filtersState}
                setTags={(tags) =>
                  setFiltersState((filters) => ({
                    ...filters,
                    tags,
                  }))
                }
                toggleTag={(tag) => {
                  setFiltersState((filters) => ({
                    ...filters,
                    tags: filters.tags[tag]
                      ? omit(filters.tags, tag)
                      : { ...filters.tags, [tag]: true },
                  }))
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
SigmaGraph.propTypes = {
  academicCareer: PropTypes.string,
}

SigmaGraph.defaultProps = {
  academicCareer: 'UGRD',
}

export default SigmaGraph
