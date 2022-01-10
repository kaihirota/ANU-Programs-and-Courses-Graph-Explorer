import React, { useContext, useEffect } from 'react'
import { useSigma } from 'react-sigma-v2'
import PropTypes from 'prop-types'

import { circular } from 'graphology-layout'
import noverlap from 'graphology-layout-noverlap'
import { SelectedCoursesContext, SelectedProgramContext } from '../../contexts'

const COLORMAP = {
  Program: '#5454FF',
  Specialisation: '#AA47FF',
  Requirement: '#FFBC47',
  Course: '#FF5454',
  Complete: '#54FF54',
}

const DataController = (props) => {
  const { programId, setProgramId } = useContext(SelectedProgramContext)
  const { selectedCourses, setSelectedCourses } = useContext(
    SelectedCoursesContext
  )
  const { dataset, children } = props
  const sigma = useSigma()
  const graph = sigma.getGraph()

  // Feed graphology with the new dataset:
  useEffect(() => {
    if (!dataset || !graph) return

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
    // random.assign(graph)
    circular.assign(graph)
    // forceLayout.assign(graph, {
    //   maxIterations: 100,
    //   settings: {
    //     attraction: 0.5, // 0.0005: importance of the attraction force, that attracts each pair of connected nodes like elastics.
    //     repulsion: 1, // 0.1: importance of the repulsion force, that attracts each pair of nodes like magnets.
    //     gravity: 0.001, // 0.0001: importance of the gravity force, that attracts all nodes to the center.
    //   },
    // })
    noverlap.assign(graph)

    return () => graph.clear()
  }, [dataset])

  useEffect(() => {
    if (graph.nodes().length > 0) {
      // apply color
      graph.forEachNode((node, attributes) => {
        graph.setNodeAttribute(node, 'color', COLORMAP[attributes.tag])
      })

      const DFS = (root) => {
        // if req / specialisation, filter for outgoing neighbors that are in completed and sum units

        let units = 0
        if (root !== '') {
          if (!graph.hasNode(root)) return null
          const attributes = graph.getNodeAttributes(root)
          if (attributes.tag === 'Course' && selectedCourses.includes(root)) {
            graph.setNodeAttribute(root, 'color', COLORMAP.Complete)
            units = attributes.units
          } else {
            graph.forEachOutNeighbor(root, (neighbor) => {
              units += DFS(neighbor)
            })
            if (attributes.tag === 'Requirement') {
              if (attributes.units) {
                graph.setNodeAttribute(
                  root,
                  'label',
                  `${units}/${attributes.units}`
                )

                if (units >= attributes.units) {
                  graph.setNodeAttribute(root, 'color', COLORMAP.Complete)
                }
              } else {
                graph.setNodeAttribute(root, 'label', attributes.description)
                graph.forEachOutNeighbor(
                  root,
                  (neighbor, neighborAttributes) => {
                    if (
                      neighborAttributes.color &&
                      neighborAttributes.color === COLORMAP.Complete
                    ) {
                      graph.setNodeAttribute(root, 'color', COLORMAP.Complete)
                      graph.setNodeAttribute(
                        root,
                        'units',
                        neighborAttributes.units
                      )
                    }
                  }
                )
              }
            }
          }
        }
        return units
      }
      DFS(programId)
    }
  }, [dataset, selectedCourses])

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
