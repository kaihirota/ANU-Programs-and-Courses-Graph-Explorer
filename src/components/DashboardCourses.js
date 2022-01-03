import React, { useEffect, useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Paper } from '@material-ui/core'
import clsx from 'clsx'
import Title from './Title'
import './graph.css'
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
}))

const getUniqueClasses = (classes) => {
  let obj = {}
  classes
    .filter((cls) => cls.id && cls.id !== '')
    .filter((cls) => cls.name && cls.name.trim() !== '')
    .forEach((cls) => {
      obj[cls.id] = cls
    })
  return Object.keys(obj)
    .map((id) => {
      return obj[id]
    })
    .sort((a, b) => a.id.localeCompare(b.id))
}

const MyCustomGraph = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [dataset, setDataset] = useState(null)
  const queryNodes =
    'MATCH (p:Course {subject_code: $subject_code})-[]-(:Course {subject_code: $subject_code}) RETURN p LIMIT 200'
  const queryEdges =
    'MATCH p=(:Course {subject_code: $subject_code})-[]-(:Course {subject_code: $subject_code}) RETURN p LIMIT 200'

  useEffect(async () => {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ })
    // the Promise way, where the complete result is collected before we act on it:
    session
      .run(queryNodes, { subject_code: 'MATH' })
      .then((result) => {
        setNodes(
          getUniqueClasses(
            result.records.map((item) => item.get('p').properties)
          )
        )
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => session.close())
  }, [])

  useEffect(async () => {
    const session = driver.session({ defaultAccessMode: neo4j.session.READ })
    session
      .run(queryEdges, { subject_code: 'MATH' })
      .then((result) => {
        setEdges(
          result.records
            .map((item) => item.get('p'))
            .map((item) => {
              return {
                source: item.start.properties.id,
                target: item.end.properties.id,
                value: item.relationship.type,
              }
            })
        )
      })
      .catch((error) => {
        console.log(error)
      })
      .then(() => session.close())
  })

  // Construct a VisJS object based on node and rel graphql responses
  useEffect(() => {
    if (nodes && edges) {
      setDataset({
        nodes: nodes,
        edges: edges,
      })
    }
  }, [nodes, edges])

  return null
}

export default function DashboardCourses() {
  const theme = useTheme()
  const fixedHeightPaper = clsx(useStyles(theme).paper)

  return (
    <React.Fragment>
      <Container>
        <Paper className={fixedHeightPaper}>
          <Title>Courses</Title>
          <MyCustomGraph />
        </Paper>
      </Container>
    </React.Fragment>
  )
}
