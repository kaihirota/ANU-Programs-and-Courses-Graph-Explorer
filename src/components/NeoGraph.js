import React, { useEffect, useRef } from 'react'
import useResizeAware from 'react-resize-aware'
import PropTypes from 'prop-types'
import Neovis from 'neovis.js/dist/neovis.js'

const NeoGraph = (props) => {
  const {
    width,
    height,
    containerId,
    backgroundColor,
    neo4jUri,
    neo4jUser,
    neo4jPassword,
  } = props

  const visRef = useRef()

  useEffect(() => {
    const config = {
      container_id: visRef.current.id,
      server_url: neo4jUri,
      server_user: neo4jUser,
      server_password: neo4jPassword,
      labels: {
        Course: {
          caption: 'name',
          title_properties: ['id', 'name', 'units'],
        },
        Program: {
          caption: 'name',
          title_properties: ['id', 'name', 'units'],
        },
        Specialisation: {
          caption: 'name',
          title_properties: ['id', 'name'],
        },
        Requirement: {
          caption: 'units',
          title_properties: ['units', 'description'],
        },
      },
      relationships: {
        REQUIREMENT: {
          caption: true,
        },
      },
      initial_cypher: `MATCH p=(:Program {name: 'Master of Machine Learning and Computer Vision'})-[r:REQUIREMENT*1..]->() RETURN p`,
    }
    const vis = new Neovis(config)
    vis.render()
  }, [neo4jUri, neo4jUser, neo4jPassword])

  return (
    <div
      id={containerId}
      ref={visRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: `${backgroundColor}`,
      }}
    />
  )
}

NeoGraph.defaultProps = {
  width: 1000,
  height: 600,
  backgroundColor: '#f5f5f5',
}

NeoGraph.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  neo4jUser: PropTypes.string.isRequired,
  neo4jPassword: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
}

const ResponsiveNeoGraph = (props) => {
  const [resizeListener, sizes] = useResizeAware()

  const side = Math.max(sizes.width, sizes.height) / 2
  const neoGraphProps = { ...props, width: side, height: side }
  return (
    <div style={{ position: 'relative' }}>
      {resizeListener}
      <NeoGraph {...neoGraphProps} />
    </div>
  )
}

ResponsiveNeoGraph.defaultProps = {
  backgroundColor: '#f5f5f5',
}

ResponsiveNeoGraph.propTypes = {
  containerId: PropTypes.string.isRequired,
  neo4jUri: PropTypes.string.isRequired,
  neo4jUser: PropTypes.string.isRequired,
  neo4jPassword: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string,
}

export { NeoGraph, ResponsiveNeoGraph }
