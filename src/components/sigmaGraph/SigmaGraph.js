import React, { useEffect, useState } from 'react'
import { FullScreenControl, ZoomControl } from 'react-sigma-v2'
import { constant, keyBy, mapValues, omit } from 'lodash'

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
import {
  BsArrowsFullscreen,
  BsFullscreenExit,
  BsZoomIn,
  BsZoomOut,
} from 'react-icons/bs'
import PropTypes from 'prop-types'
import { SelectedCourseNodeContext } from '../../contexts'
import { CircularProgress } from '@material-ui/core'
import {
  extractDataset,
  NEO4J_PASSWORD,
  NEO4J_URI,
  NEO4J_USER,
} from '../../utils'
import { QueryClient, useQuery } from 'react-query'

const neo4j = require('neo4j-driver')
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
)

const CYPHER_QUERY =
  'MATCH p=(:Course {academic_career: $academicCareer})-[:PREREQUISITE]->(:Course {academic_career: $academicCareer}) RETURN p'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 60 * 24 /*1 day*/,
      refetchOnWindowFocus: false,
    },
  },
})

const queryData = async (academicCareer) => {
  const session = driver.session({ defaultAccessMode: neo4j.session.READ })
  const result = await session.run(CYPHER_QUERY, {
    academicCareer: academicCareer,
  })
  const extractNode = (node) => {
    return {
      ...node.properties,
      label: `${node.properties.id} ${node.properties.name}`,
      tag: node.properties.subject,
    }
  }
  return extractDataset(result.records, extractNode)
}

const SigmaGraph = (props) => {
  const { academicCareer } = props
  const [showContents, setShowContents] = useState(false)
  const [hoveredNode, setHoveredNode] = useState()
  const [clickedNode, setClickedNode] = useState('')
  const [filtersState, setFiltersState] = useState({
    tags: {},
  })
  queryClient.prefetchQuery('UGRD', queryData)

  const result = useQuery(
    academicCareer,
    async () => queryData(academicCareer),
    {
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 60 * 24 /*1 day*/,
      refetchOnWindowFocus: false,
    }
  )

  const dataset = result.data

  useEffect(() => {
    if (dataset && dataset.tags)
      setFiltersState({
        tags: mapValues(keyBy(dataset.tags, 'key'), constant(true)),
      })
  }, [dataset, academicCareer])

  if (result.isLoading) {
    return (
      <CircularProgress style={{ position: 'absolute', top: 1, left: 0 }} />
    )
  }

  const toggleTag = (tag) => {
    setFiltersState((filters) => ({
      ...filters,
      tags: filters.tags[tag]
        ? omit(filters.tags, tag)
        : { ...filters.tags, [tag]: true },
    }))

    let clusterLayer = document.getElementById(tag)
    if (clusterLayer) {
      clusterLayer.hidden = filtersState.tags[tag]
    }
  }

  return (
    <SelectedCourseNodeContext.Provider value={clickedNode}>
      <div className={showContents ? 'show-contents' : ''}>
        <GraphSettingsController hoveredNode={hoveredNode} />
        <GraphEventsController
          setHoveredNode={setHoveredNode}
          setClickedNode={setClickedNode}
        />
        <GraphDataController dataset={dataset} filters={filtersState} />

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
          <FullScreenControl
            className="ico"
            customEnterFullScreen={<BsArrowsFullscreen />}
            customExitFullScreen={<BsFullscreenExit />}
          />
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
              toggleTag={toggleTag}
            />
          </div>
        </div>
      </div>
    </SelectedCourseNodeContext.Provider>
  )
}
SigmaGraph.propTypes = {
  academicCareer: PropTypes.string,
}

SigmaGraph.defaultProps = {
  academicCareer: 'UGRD',
}

export default SigmaGraph
