// import React, { useEffect, useRef, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { Box, Button, CircularProgress } from '@material-ui/core'
// import cytoscape from 'cytoscape'
// import klay from 'cytoscape-klay'
// import popper from 'cytoscape-popper'
// import tippy from 'tippy.js'
// import 'tippy.js/themes/light.css'
// import Graph from 'graphology'
// import { Typography } from '@mui/material'
// import PropTypes from 'prop-types'
// import { COLORMAP } from '../utils'

// cytoscape.use(popper)
// cytoscape.use(klay)

// export default function ProgramGraph(props) {
//   const { dataset } = props
//   const dispatch = useDispatch()
//   const programId = useSelector((state) =>
//     state.selections.programId ? state.selections.programId : ''
//   )
//   const selectedCourses = useSelector((state) =>
//     state.selections.selectedCourses ? state.selections.selectedCourses : []
//   )
//   const cyRef = useRef()
//   const [cytoscapeDataset, setCytoscapeDataset] = useState([])
//   const [style, setStyle] = useState([])
//   const [reload, setReload] = useState(false)
//   const [overflow, setOverflow] = useState(false)
//   const [clickedNode, setClickedNode] = useState('')
//   const [layout, setLayout] = useState({
//     name: 'klay',
//     nodeDimensionsIncludeLabels: false, // Boolean which changes whether label dimensions are included when calculating node dimensions
//     fit: true, // Whether to fit
//     padding: 20, // Padding on fit
//     // animate: true, // Whether to transition the node positions
//     // animateFilter: function (node, i) {
//     //   return true
//     // }, // Whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
//     // animationDuration: 500, // Duration of animation in ms if enabled
//     animationEasing: undefined, // Easing of animation if enabled
//     transform: function (node, pos) {
//       return pos
//     }, // A function that applies a transform to the final node position
//     ready: undefined, // Callback on layoutready
//     stop: undefined, // Callback on layoutstop
//     klay: {
//       // direction: 'horizontal', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
//       direction: 'DOWN', // Overall direction of edges: horizontal (right / left) or vertical (down / up)
//       edgeSpacingFactor: 0.5, // Factor by which the object spacing is multiplied to arrive at the minimal spacing between edges.
//       // Following descriptions taken from http://layout.rtsys.informatik.uni-kiel.de:9444/Providedlayout.html?algorithm=de.cau.cs.kieler.klay.layered
//       addUnnecessaryBendpoints: false, // Adds bend points even if an edge does not change direction.
//       aspectRatio: 1.6, // The aimed aspect ratio of the drawing, that is the quotient of width by height
//       borderSpacing: 20, // Minimal amount of space to be left to the border
//       compactComponents: false, // Tries to further compact components (disconnected sub-graphs).
//       crossingMinimization: 'LAYER_SWEEP', // Strategy for crossing minimization.
//       /* LAYER_SWEEP The layer sweep algorithm iterates multiple times over the layers, trying to find node orderings that minimize the number of crossings. The algorithm uses randomization to increase the odds of finding a good result. To improve its results, consider increasing the Thoroughness option, which influences the number of iterations done. The Randomization seed also influences results.
//       INTERACTIVE Orders the nodes of each layer by comparing their positions before the layout algorithm was started. The idea is that the relative order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive layer sweep algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
//       cycleBreaking: 'GREEDY', // Strategy for cycle breaking. Cycle breaking looks for cycles in the graph and determines which edges to reverse to break the cycles. Reversed edges will end up pointing to the opposite direction of regular edges (that is, reversed edges will point left if edges usually point right).
//       /* GREEDY This algorithm reverses edges greedily. The algorithm tries to avoid edges that have the Priority property set.
//       INTERACTIVE The interactive algorithm tries to reverse edges that already pointed leftwards in the input graph. This requires node and port coordinates to have been set to sensible values.*/
//       /* UNDEFINED, RIGHT, LEFT, DOWN, UP */
//       edgeRouting: 'POLYLINE', // Defines how edges are routed (POLYLINE, ORTHOGONAL, SPLINES)
//       feedbackEdges: false, // Whether feedback edges should be highlighted by routing around the nodes.
//       fixedAlignment: 'BALANCED', // Tells the BK node placer to use a certain alignment instead of taking the optimal result.  This option should usually be left alone.
//       /* NONE Chooses the smallest layout from the four possible candidates.
//       LEFTUP Chooses the left-up candidate from the four possible candidates.
//       RIGHTUP Chooses the right-up candidate from the four possible candidates.
//       LEFTDOWN Chooses the left-down candidate from the four possible candidates.
//       RIGHTDOWN Chooses the right-down candidate from the four possible candidates.
//       BALANCED Creates a balanced layout from the four possible candidates. */
//       inLayerSpacingFactor: 1.0, // Factor by which the usual spacing is multiplied to determine the in-layer spacing between objects.
//       layoutHierarchy: false, // Whether the selected layouter should consider the full hierarchy
//       linearSegmentsDeflectionDampening: 0.3, // Dampens the movement of nodes to keep the diagram from getting too large.
//       mergeEdges: true, // Edges that have no ports are merged so they touch the connected nodes at the same points.
//       mergeHierarchyCrossingEdges: true, // If hierarchical layout is active, hierarchy-crossing edges use as few hierarchical ports as possible.
//       nodeLayering: 'NETWORK_SIMPLEX', // Strategy for node layering.
//       /* NETWORK_SIMPLEX This algorithm tries to minimize the length of edges. This is the most computationally intensive algorithm. The number of iterations after which it aborts if it hasn't found a result yet can be set with the Maximal Iterations option.
//       LONGEST_PATH A very simple algorithm that distributes nodes along their longest path to a sink node.
//       INTERACTIVE Distributes the nodes into layers by comparing their positions before the layout algorithm was started. The idea is that the relative horizontal order of nodes as it was before layout was applied is not changed. This of course requires valid positions for all nodes to have been set on the input graph before calling the layout algorithm. The interactive node layering algorithm uses the Interactive Reference Point option to determine which reference point of nodes are used to compare positions. */
//       nodePlacement: 'BRANDES_KOEPF', // Strategy for Node Placement
//       /* BRANDES_KOEPF Minimizes the number of edge bends at the expense of diagram size: diagrams drawn with this algorithm are usually higher than diagrams drawn with other algorithms.
//       LINEAR_SEGMENTS Computes a balanced placement.
//       INTERACTIVE Tries to keep the preset y coordinates of nodes from the original layout. For dummy nodes, a guess is made to infer their coordinates. Requires the other interactive phase implementations to have run as well.
//       SIMPLE Minimizes the area at the expense of... well, pretty much everything else. */
//       randomizationSeed: 1, // Seed used for pseudo-random number generators to control the layout algorithm; 0 means a new seed is generated
//       routeSelfLoopInside: false, // Whether a self-loop is routed around or inside its node.
//       separateConnectedComponents: true, // Whether each connected component should be processed separately
//       spacing: 50, // Overall setting for the minimal amount of space to be left between objects
//       thoroughness: 7, // How much effort should be spent to produce a nice layout..
//     },
//     priority: function (edge) {
//       return null
//     }, // Edges with a non-nil value are skipped when greedy edge cycle breaking is enabled
//   })

//   const DFS = (graph, root) => {
//     // if req / specialisation, filter for outgoing neighbors that are in completed and sum units

//     let units = 0
//     if (root !== '') {
//       if (!graph.hasNode(root)) return null
//       const attributes = graph.getNodeAttributes(root)

//       if (attributes.tag === 'Course' && selectedCourses.includes(root)) {
//         graph.setNodeAttribute(root, 'completed', true)
//         units = attributes.units
//       } else {
//         // program, specialisation, requirement nodes
//         if (graph.outNeighbors(root).length > 50) {
//           // if more than 50 direct children, don't recurse, just count classes taken
//           graph.forEachOutNeighbor(root, (neighbor) => {
//             if (selectedCourses.includes(neighbor))
//               units += graph.getNodeAttribute(neighbor, 'units')
//           })
//         } else {
//           graph.forEachOutNeighbor(root, (neighbor, attributes) => {
//             function callback(edge, attributes) {
//               return attributes.label === 'REQUIREMENT'
//             }
//             if (graph.findOutEdge(root, neighbor, callback)) {
//               units += DFS(graph, neighbor)
//             }
//           })
//         }
//         // update node labels for requirements given selectedCourses
//         if (attributes.tag === 'Requirement') {
//           if (attributes.units) {
//             graph.setNodeAttribute(
//               root,
//               'label',
//               `${units}/${attributes.units}`
//             )

//             if (units >= attributes.units)
//               graph.setNodeAttribute(root, 'completed', true)
//           } else {
//             graph.setNodeAttribute(root, 'label', attributes.description)
//             // edge case: "Either:"
//             // graph.forEachOutNeighbor(root, (neighbor, neighborAttributes) => {
//             //   if (
//             //     neighborAttributes.color &&
//             //     neighborAttributes.color === COLORMAP.Complete
//             //   ) {
//             //     graph.setNodeAttribute(root, 'color', COLORMAP.Complete)
//             //     graph.setNodeAttribute(root, 'units', neighborAttributes.units)
//             //   }
//             // })
//           }
//         }
//       }
//     }
//     return units
//   }

//   // set style
//   useEffect(() => {
//     const style = [
//       {
//         selector: 'node',
//         style: {
//           'overlay-opacity': 0,
//           'background-color': (el) =>
//             selectedCourses.includes(el.attr('id')) ||
//             el.attr('completed') === true
//               ? '#43a047'
//               : COLORMAP[el.attr('tag')],
//           'background-height': '40%',
//           'background-width': '40%',
//           'border-color': '#fff',
//           'border-width': '5%',
//           'text-valign': 'top',
//           label: 'data(label)',
//           width: 30,
//           height: 30,
//           shape: 'ellipse',
//           'font-family': 'Helvetica',
//           'font-size': 12,
//           'min-zoomed-font-size': 12,
//         },
//       },
//       {
//         selector: 'node[tag = "Program"]',
//         style: {
//           'font-size': 36,
//           'min-zoomed-font-size': 32,
//         },
//       },
//       {
//         selector: 'node[tag = "Requirement"]',
//         style: {
//           'font-size': 24,
//         },
//       },
//       {
//         selector: 'node[tag = "Course"]',
//         style: {
//           'text-valign': 'bottom',
//           'text-rotation': 0.35,
//           'text-halign': 'right',
//           'font-size': 18,
//         },
//       },
//       {
//         selector: 'edge',
//         style: {
//           width: 2,
//           'line-color': '#B3B3B3',
//           'target-arrow-color': '#FF5454',
//           'target-arrow-shape': 'triangle',
//         },
//       },
//       {
//         selector: `edge[label = "PREREQUISITE"]`,
//         style: {
//           'line-color': COLORMAP.Prerequisite,
//         },
//       },
//       {
//         selector: `edge[source = "${clickedNode}"]`,
//         style: {
//           'line-color': '#FF5454',
//         },
//       },
//     ]
//     setStyle(style)
//     if (cyRef.current) cyRef.current.style(style).update()
//   }, [dataset, selectedCourses, clickedNode])

//   // transform dataset and load into graph
//   useEffect(() => {
//     const { nodes, edges } = dataset
//     let newDataset = []
//     const graph = new Graph({ type: 'directed', multi: true })
//     if (nodes.length > 500) {
//       setOverflow(true)
//     } else {
//       console.log(`${nodes.length} nodes retrieved`)
//       setOverflow(false)
//       nodes.forEach((node) => {
//         try {
//           graph.addNode(node.id, node)
//         } catch (e) {
//           // do nothing
//         }
//       })
//       console.log(edges)
//       edges.forEach((edge) => graph.addEdge(edge.from, edge.to, edge))

//       DFS(graph, programId)
//     }

//     graph.forEachNode((node, attributes) => {
//       newDataset.push({
//         data: {
//           ...attributes,
//         },
//         classes: [attributes.tag],
//       })
//     })
//     graph.forEachEdge((edge, attributes) => {
//       newDataset.push({
//         data: {
//           source: attributes.from,
//           target: attributes.to,
//           label: attributes.label,
//         },
//       })
//     })
//     setCytoscapeDataset(newDataset)
//     setReload(false)
//   }, [dataset, reload])

//   // render graph
//   useEffect(() => {
//     let cy = cytoscape({
//       container: document.getElementById('cy'), // container to render in
//       elements: cytoscapeDataset,
//       style: style,
//       layout: layout,
//     })
//     cyRef.current = cy

//     // highlight outward edges when node is clicked or tapped
//     cy.on('tapstart', 'node', (evt) =>
//       setClickedNode(evt.target._private.data.id)
//     )

//     // reset highlighted edges when clicked on background
//     cy.on('tap', (evt) => {
//       if (!evt.target._private.data.id) setClickedNode('')
//     })

//     // create hover popup for requirements
//     cy.on('mouseover', 'node[tag = "Requirement"]', (evt) => {
//       const popper = evt.target.popperRef()
//       const div = document.createElement('div')
//       const tip = new tippy(div, {
//         getReferenceClientRect: popper.getBoundingClientRect, // https://atomiks.github.io/tippyjs/v6/all-props/#getreferenceclientrect
//         trigger: 'manual', // mandatory, we cause the tippy to show programmatically.
//         // content prop can be used when the target is a single element https://atomiks.github.io/tippyjs/v6/constructor/#prop
//         content: () => {
//           div.classList.add('popper')
//           div.innerHTML = evt.target._private.data.description
//           document.body.appendChild(div)
//           return div
//         },
//         placement: 'right',
//         offset: [0, 15],
//       })
//       tip.show()
//       evt.target.on('mouseout', () => {
//         tip.hide()
//       })
//     })
//   }, [cytoscapeDataset])

//   const handleClick = (e) => {
//     setReload(true)
//   }

//   if (!(cytoscapeDataset && style && layout)) return <CircularProgress />

//   return (
//     <>
//       {overflow && (
//         <Typography variant="p">
//           Sorry, the program you selected is not supported yet.
//         </Typography>
//       )}
//       {overflow || (
//         <>
//           <Box style={{ marginTop: '10px' }}>
//             <span
//               className="dot"
//               style={{ 'background-color': COLORMAP['Program'] }}
//             />
//             Program
//             <span
//               className="dot"
//               style={{ 'background-color': COLORMAP['Specialisation'] }}
//             />
//             Specialisation
//             <span
//               className="dot"
//               style={{ 'background-color': COLORMAP['Requirement'] }}
//             />
//             Requirement
//             <span
//               className="dot"
//               style={{ 'background-color': COLORMAP['Course'] }}
//             />
//             Course
//           </Box>
//           <div style={{ marginTop: '5px', marginBottom: '5px' }}>
//             <Button size="small" onClick={handleClick}>
//               Update Units
//             </Button>
//           </div>
//         </>
//       )}
//       <div id={'cy'} />
//     </>
//   )
// }

// ProgramGraph.propTypes = {
//   dataset: PropTypes.shape({
//     nodes: PropTypes.array.isRequired,
//     edges: PropTypes.array.isRequired,
//   }).isRequired,
// }
