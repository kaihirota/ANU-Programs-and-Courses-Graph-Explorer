import React, { FC, useEffect } from 'react'
import { useRegisterEvents, useSigma } from 'react-sigma-v2'
import PropTypes from 'prop-types'

function getMouseLayer() {
  return document.querySelector('.sigma-mouse')
}

const GraphEventsController = (props) => {
  const { setHoveredNode, children } = props
  const sigma = useSigma()
  const graph = sigma.getGraph()
  const registerEvents = useRegisterEvents()

  /**
   * Initialize here settings that require to know the graph and/or the sigma
   * instance:
   */
  useEffect(() => {
    registerEvents({
      clickNode({ node }) {
        if (!graph.getNodeAttribute(node, 'hidden')) {
          window.open(
            'https://programsandcourses.anu.edu.au/course/' +
              graph.getNodeAttribute(node, 'id'),
            '_blank'
          )
        }
      },
      enterNode({ node }) {
        setHoveredNode(node)
        // TODO: Find a better way to get the DOM mouse layer:
        const mouseLayer = getMouseLayer()
        if (mouseLayer) mouseLayer.classList.add('mouse-pointer')
      },
      leaveNode() {
        setHoveredNode(null)
        // TODO: Find a better way to get the DOM mouse layer:
        const mouseLayer = getMouseLayer()
        if (mouseLayer) mouseLayer.classList.remove('mouse-pointer')
      },
    })
  }, [])

  return <>{children}</>
}
GraphEventsController.propTypes = {
  setHoveredNode: PropTypes.func,
  children: PropTypes.node,
}
export default GraphEventsController
