import React, { useEffect, useState } from 'react'
import { useSigma } from 'react-sigma-v2'
import PropTypes from 'prop-types'
import FA2Layout from 'graphology-layout-forceatlas2/worker'

import { random } from 'graphology-layout'
import forceAtlas2 from 'graphology-layout-forceatlas2'

const DataController = (props) => {
  const { dataset, children } = props
  const sigma = useSigma()
  const graph = sigma.getGraph()
  // const [clusters, setClusters] = useState({})

  /**
   * Feed graphology with the new dataset:
   */
  useEffect(() => {
    if (!graph || !dataset) return

    // build graph
    dataset.nodes
      .filter((node) => node.id)
      .forEach((node) => {
        try {
          graph.addNode(node.id, node)
        } catch (e) {
          // console.log(e)
        }
      })

    dataset.edges.forEach((edge) => {
      try {
        graph.addEdge(edge.from, edge.to, { size: 1 })
      } catch (e) {
        // console.log(e)
      }
    })

    // set size
    graph.forEachNode((node) => {
      graph.setNodeAttribute(node, 'size', 10)
    })

    // set layout
    random.assign(graph)
    forceAtlas2.assign(graph, {
      iterations: 50,
      settings: {
        gravity: 10,
      },
    })
    // const layout = new FA2Layout(graph, {
    //   settings: { gravity: 10 },
    //   weighted: false,
    //   iterations: 10,
    // })
    // layout.start()

    // apply colors
    let labelToColorMap = {}
    dataset.tags.forEach((t) => {
      labelToColorMap[t.key] = t.color
    })
    graph.forEachNode((node, { tag }) =>
      graph.setNodeAttribute(node, 'color', labelToColorMap[tag])
    )

    return () => graph.clear()
  }, [dataset])

  useEffect(() => {
    console.log(dataset)
  }, [graph, dataset])

  return <>{children}</>
}
DataController.propTypes = {
  dataset: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
    tags: PropTypes.array.isRequired,
  }).isRequired,
  children: PropTypes.node,
}

export default DataController
