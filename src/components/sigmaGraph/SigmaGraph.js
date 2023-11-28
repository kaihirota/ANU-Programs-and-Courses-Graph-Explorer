import { omit } from 'lodash'
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
import { CircularProgress } from '@material-ui/core'

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
        tags: getTags(jsonDataUGRD.tags),
      })
    } else if (academicCareer === 'PGRD') {
      setData({
        nodes: jsonDataPGRD.nodes,
        edges: jsonDataPGRD.edges,
        tags: getTags(jsonDataPGRD.tags),
      })
    }
  }

  useEffect(() => getClasses(academicCareer), [academicCareer])

  useEffect(() => {
    if (data.tags && data.tags.length > 0) {
      let newFilters = { tags: {} }
      data.tags.forEach((tag) => {
        newFilters.tags[tag.key] = true
      })
      setFilters(newFilters)
    }
  }, [data, academicCareer])

  const toggleTag = (tag) => {
    setFilters((filters) => ({
      ...filters,
      tags: filters.tags[tag]
        ? omit(filters.tags, tag)
        : { ...filters.tags, [tag]: true },
    }))

    let clusterLayer = document.getElementById(tag)
    if (clusterLayer) {
      clusterLayer.hidden = filters.tags[tag]
    }
  }

  if (data.nodes.length === 0) {
    return (
      <CircularProgress style={{ position: 'absolute', top: 1, left: 0 }} />
    )
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
              toggleTag={toggleTag}
              filters={filters}
              setFilters={(tags) =>
                setFilters((filters) => ({
                  ...filters,
                  tags,
                }))
              }
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

const getTags = (tags) => {
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
  }
  const uniqueTags = tags.filter(onlyUnique)
  const colors = [
    '#ff833a',
    '#ff6659',
    '#ff5c8d',
    '#ae52d4',
    '#8559da',
    '#6f74dd',
    '#63a4ff',
    '#48a999',
    '#60ad5e',
  ]

  // const colors = chroma.scale('Spectral').colors(10)
  let ret = new Array(uniqueTags.length)
  for (let i = 0; i < uniqueTags.length; i++) {
    ret[i] = {
      key: uniqueTags[i],
      color: colors[i % colors.length],
    }
  }
  return ret
}

export default SigmaGraph
