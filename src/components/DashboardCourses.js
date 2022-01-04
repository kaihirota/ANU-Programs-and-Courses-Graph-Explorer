import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Paper } from '@material-ui/core'
import clsx from 'clsx'
import Title from './Title'
import { SigmaContainer, useSigma } from 'react-sigma-v2'
import { getUniqueClasses } from '../utils'
import 'react-sigma-v2/lib/react-sigma-v2.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

const neo4jUri = process.env.REACT_APP_NEO4J_URI || 'localhost:7687'
const neo4jUser = process.env.REACT_APP_NEO4J_USER || 'neo4j'
const neo4jPassword = process.env.REACT_APP_NEO4J_PASSWORD || 'neo4j'
const neo4j = require('neo4j-driver')
const driver = neo4j.driver(
  neo4jUri,
  neo4j.auth.basic(neo4jUser, neo4jPassword)
)
// Close the driver when application exits.
// This closes all used network connections.
// await driver.close()

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  myNetwork: {
    backgroundColor: '#222222',
    borderRadius: 10,
  },
}))

const MyCustomGraph = () => {
  const [dataset, setDataset] = useState({
    nodes: [
      { id: 1, label: 'Node', title: 'node 1 tootip text' },
      { id: 2, label: 'Node', title: 'node 2 tootip text' },
      { id: 3, label: 'Node', title: 'node 3 tootip text' },
      { id: 4, label: 'Node', title: 'node 4 tootip text' },
      { id: 5, label: 'Node', title: 'node 5 tootip text' },
    ],
    edges: [
      { from: 1, to: 2, label: 'Label' },
      { from: 1, to: 3, label: 'Label' },
      { from: 2, to: 4, label: 'Label' },
      { from: 2, to: 5, label: 'Label' },
    ],
  })
  const sigma = useSigma()
  const graph = sigma.getGraph()
  const query =
    'MATCH p=(:Course {subject_code: $subject_code})-[]-(:Course {subject_code: $subject_code}) RETURN p LIMIT 30'

  const extractLink = (link) => {
    return {
      from: link.start.properties.id,
      to: link.end.properties.id,
      label: link.segments[0].relationship.type,
    }
  }

  const extractNode = (node) => {
    return {
      ...node.properties,
      type: node.labels[0],
      group: node.properties.subject_code,
      label: node.properties.id,
    }
  }

  useEffect(() => {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ })
    session
      .run(query, { subject_code: 'COMP' })
      .then((result) => {
        let nodes = {}
        const edges = result.records
          .map((item) => item.get('p'))
          .map((item) => {
            const edge = extractLink(item)
            nodes[edge.from] = extractNode(item.start)
            nodes[edge.to] = extractNode(item.end)
            return edge
          })
        setDataset({
          edges: edges,
          nodes: getUniqueClasses(Object.keys(nodes).map((key) => nodes[key])),
        })
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => session.close())
  }, [])

  useEffect(() => {
    console.log(dataset)
    dataset.nodes.forEach((n) => {
      graph.addNode(n.id, {
        name: n.name,
        label: n.type,
        color: '#FF0',
        size: 10,
      })
    })
    // dataset.edges.forEach((e) => {
    // graph.addEdge(e.from, e.to, { color: '#CCC', size: 1 })
    // })
  }, [dataset])

  return null
}

export default function DashboardCourses() {
  const styles = useStyles()
  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)

  return (
    <React.Fragment>
      <Container style={{ height: '500px' }}>
        <Paper className={fixedHeightPaper}>
          <Title>Courses</Title>
          <SigmaContainer
            className={styles.myNetwork}
            style={{ height: '600px', width: '100%' }}
          >
            <MyCustomGraph />
          </SigmaContainer>
        </Paper>
      </Container>
    </React.Fragment>
  )
}
