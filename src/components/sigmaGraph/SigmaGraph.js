import { constant, keyBy, mapValues, omit } from 'lodash'
import React, { useEffect, useState } from 'react'
import { FullScreenControl, ZoomControl } from 'react-sigma-v2'
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
import GraphSettingsController from './views/GraphSettingsController'
import GraphEventsController from './views/GraphEventsController'
import GraphDataController from './views/GraphDataController'
import DescriptionPanel from './views/DescriptionPanel'
import SearchField from './views/SearchField'
import GraphTitle from './views/GraphTitle'
import TagsPanel from './views/TagsPanel'

const jsonDataUGRD = require('../../graph_data_UGRD.json')
const jsonDataPGRD = require('../../graph_data_PGRD.json')

const SigmaGraph = (props) => {
  const { academicCareer } = props
  const [showContents, setShowContents] = useState(false)
  const [data, setData] = useState({ nodes: [], edges: [], tags: [] })
  const [filters, setFilters] = useState({ tags: {} })
  const [hoveredNode, setHoveredNode] = useState()
  const [clickedNode, setClickedNode] = useState('')

  const getClasses = (academicCareer) => {
    if (academicCareer === 'UGRD') {
      setData({
        nodes: jsonDataUGRD.nodes,
        edges: jsonDataUGRD.edges,
        tags: jsonDataUGRD.tags,
      })
    } else if (academicCareer === 'PGRD') {
      setData({
        nodes: jsonDataPGRD.nodes,
        edges: jsonDataPGRD.edges,
        tags: jsonDataPGRD.tags,
      })
    }
  }

  useEffect(() => getClasses(academicCareer), [academicCareer])

  useEffect(() => {
    if (data.tags && data.tags.length > 0) {
      setFilters({ tags: mapValues(data.tags, constant(true)) })
    }
  }, [data.tags])

  const setTags = (tags) =>
    setFilters((filters) => ({
      ...filters,
      tags,
    }))

  const toggleTag = (tag) => {
    setFilters((filters) => {
      if (filters.tags[tag]) {
        omit(filters.tags, tag)
      }
      filters.tags = { ...filters.tags, [tag]: true }
    })

    let clusterLayer = document.getElementById(tag)
    if (clusterLayer) {
      clusterLayer.hidden = filters.tags[tag]
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
        <GraphDataController dataset={data} filters={filters} />
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
          <GraphTitle filters={filters} />
          <div className="panels">
            <SearchField filters={filters} />
            <DescriptionPanel />
            <TagsPanel
              tags={data.tags}
              filters={filters}
              setTags={setTags}
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
