import React, { useEffect } from 'react'
import { useSigma } from 'react-sigma-v2'
import { keyBy, mapValues } from 'lodash'
import PropTypes from 'prop-types'
import random from 'graphology-layout/random'
import { zip } from 'lodash/array'

const getUniqueTags = (tags) => {
  let obj = {}
  tags.forEach((cls) => {
    obj[cls.key] = cls
  })
  return Object.keys(obj).map((id) => {
    return obj[id]
  })
}

const GraphDataController = (props) => {
  const { dataset, filters, children } = props
  const sigma = useSigma()
  const graph = sigma.getGraph()

  /**
   * Feed graphology with the new dataset:
   */
  useEffect(() => {
    if (!graph || !dataset) return

    dataset.nodes.forEach((n) => {
      graph.addNode(n.id, n)
    })

    dataset.edges.forEach((edge) => {
      try {
        graph.addEdge(edge.from, edge.to, { size: 1 })
      } catch (e) {
        /*Uncaught UsageGraphError: Graph.addEdge: an edge linking "COMP4330" to
         "COMP8330" already exists. If you really want to add multiple edges
          linking those nodes, you should create a multi graph by using the 'multi' option.*/
        // console.log(e)
      }
    })

    // directly assign the positions to the nodes:
    random.assign(graph)

    // Use degrees as node sizes:
    // const scores = graph
    //   .nodes()
    //   .map((node) => graph.getNodeAttribute(node, 'score'))
    // const minDegree = Math.min(...scores)
    // const maxDegree = Math.max(...scores)
    // const MIN_NODE_SIZE = 3
    // const MAX_NODE_SIZE = 30
    // graph.forEachNode((node) =>
    //   graph.setNodeAttribute(
    //     node,
    //     'size',
    //     ((graph.getNodeAttribute(node, 'score') - minDegree) /
    //       (maxDegree - minDegree)) *
    //       (MAX_NODE_SIZE - MIN_NODE_SIZE) +
    //       MIN_NODE_SIZE
    //   )
    // )
    graph.forEachNode((node) => graph.setNodeAttribute(node, 'size', 10))

    return () => graph.clear()
  }, [graph, dataset])

  /**
   * Apply colors
   */
  useEffect(() => {
    const { tags } = dataset
    // assign colors
    let labelToColorMap = {}
    tags.forEach((t) => {
      labelToColorMap[t.key] = t.color
    })
    graph.forEachNode((node, { tag }) =>
      graph.setNodeAttribute(node, 'color', labelToColorMap[tag])
    )
  }, [graph, dataset])

  /**
   * Apply filters to graphology:
   */
  useEffect(() => {
    const { tags } = filters
    graph.forEachNode((node, { cluster, tag }) =>
      graph.setNodeAttribute(node, 'hidden', !tags[tag])
    )
  }, [graph, filters])

  return <>{children}</>
}
GraphDataController.propTypes = {
  dataset: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
  }).isRequired,
  filters: PropTypes.object, // filters = FiltersState = { tags: Record<string, boolean> }
  children: PropTypes.node,
}

export default GraphDataController
