import React, { useEffect, useState } from 'react'
import { useSigma } from 'react-sigma-v2'
import PropTypes from 'prop-types'
import { circlepack } from 'graphology-layout'

const GraphDataController = (props) => {
  const { dataset, filters, children } = props
  const sigma = useSigma()
  const graph = sigma.getGraph()
  const [clusters, setClusters] = useState({})

  /**
   * Feed graphology with the new dataset:
   */
  useEffect(() => {
    if (!graph || !dataset) return

    dataset.nodes.forEach((n) => {
      if (n.id && n.name) {
        graph.addNode(n.id, n)
      }
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

    // set layout and positions of nodes
    // With options
    circlepack.assign(graph, {
      hierarchyAttributes: ['subject'],
    })

    // Use degrees as node sizes:
    graph.forEachNode((node) => {
      graph.setNodeAttribute(node, 'score', graph.inDegree(node))
    })
    const scores = graph
      .nodes()
      .map((node) => graph.getNodeAttribute(node, 'score'))
    const minDegree = Math.min(...scores)
    const maxDegree = Math.max(...scores)
    const MIN_NODE_SIZE = 3
    const MAX_NODE_SIZE = 30
    graph.forEachNode((node) =>
      graph.setNodeAttribute(
        node,
        'size',
        ((graph.getNodeAttribute(node, 'score') - minDegree) /
          (maxDegree - minDegree)) *
          (MAX_NODE_SIZE - MIN_NODE_SIZE) +
          MIN_NODE_SIZE
      )
    )

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

  // calculate cluster centroids
  useEffect(() => {
    const { nodes, tags } = dataset
    let newClusters = { ...clusters }
    nodes.forEach((node) => {
      if (node.subject in newClusters) {
        newClusters[node.subject].positions.push({ x: node.x, y: node.y })
      } else {
        newClusters[node.subject] = {
          label: node.subject,
          color: node.color,
          positions: [{ x: node.x, y: node.y }],
        }
      }
    })
    Object.keys(newClusters).forEach((clusterLabel) => {
      newClusters[clusterLabel].x =
        newClusters[clusterLabel].positions.reduce((acc, p) => acc + p.x, 0) /
        newClusters[clusterLabel].positions.length
      newClusters[clusterLabel].y =
        newClusters[clusterLabel].positions.reduce((acc, p) => acc + p.y, 0) /
        newClusters[clusterLabel].positions.length
    })

    setClusters(newClusters)
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
