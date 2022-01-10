import { useRegisterEvents, useSigma } from 'react-sigma-v2'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'

function getMouseLayer() {
  return document.querySelector('.sigma-mouse')
}

const GraphEventsController = (props) => {
  const dispatch = useDispatch()
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
      // clickNode({ node }) {
      //   if (graph.getNodeAttribute(node, 'tag') === 'Course') {
      //     dispatch(toggleCourse(node))
      //   }
      // },
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
  setClickedNode: PropTypes.func,
  children: PropTypes.node,
}
export default GraphEventsController
