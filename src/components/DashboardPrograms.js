// import React, { useState } from 'react'
// import { makeStyles, useTheme } from '@material-ui/core/styles'
// import {
//   CircularProgress,
//   Container,
//   Paper,
//   TextField,
// } from '@material-ui/core'
// import clsx from 'clsx'
// import CourseTable from './CourseTable'
// import ProgramGraph from './ProgramGraph'
// import { Autocomplete } from '@mui/material'
// import { useDispatch, useSelector } from 'react-redux'
// import { clearCourse, setProgram } from '../selections'
// import {
//   extractDataset,
//   NEO4J_PASSWORD,
//   NEO4J_URI,
//   NEO4J_USER,
// } from '../utils'
// import { useQuery as useCachedQuery } from 'react-query'
// const getUniquePrograms = (programs) => {
//   let obj = {}
//   programs
//     .filter((program) => program.id && program.id !== '')
//     .filter((program) => program.name && program.name.trim() !== '')
//     .forEach((program) => {
//       obj[program.id] = program
//     })
//   return Object.keys(obj)
//     .map(function (id) {
//       return obj[id]
//     })
//     .sort((a, b) => a.name.localeCompare(b.name))
// }
//
// const useStyles = makeStyles((theme) => ({
//   paper: {
//     padding: theme.spacing(2),
//     display: 'flex',
//     overflow: 'auto',
//     flexDirection: 'column',
//   },
// }))
//
// const neo4j = require('neo4j-driver')
// const driver = neo4j.driver(
//   NEO4J_URI,
//   neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
// )
//
// export default function DashboardPrograms() {
//   const theme = useTheme()
//   const fixedHeightPaper = clsx(useStyles(theme).paper)
//   const dispatch = useDispatch()
//   const programId = useSelector((state) =>
//     state.selections.programId ? state.selections.programId : 'Program'
//   )
//
//   const [clearSelected, setClearSelected] = useState(false)
//   function handleSelection(event, value, reason, details) {
//     if (reason === 'selectOption' && value) {
//       dispatch(setProgram(value.id))
//       dispatch(clearCourse())
//       setClearSelected(true)
//     }
//   }
//
//   const [programs, setPrograms] = useState([])
//   const getPrograms = () => {
//     fetch('programs.json', {
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//     })
//       .then(function (response) {
//         console.log(response)
//         return response.json()
//       })
//       .then(function (myJson) {
//         console.log(myJson)
//         const programs = myJson.map((program) => {
//           return { id: program.id, name: program.name }
//         })
//         setPrograms(getUniquePrograms(programs))
//       })
//   }
//   getPrograms()
//
//   const result = useCachedQuery(programId, async () => {
//     const session = driver.session({ defaultAccessMode: neo4j.session.READ })
//
//     const CYPHER_QUERY =
//       'MATCH p=(:Program {id: $program_id})-[r:REQUIREMENT*1..]->() RETURN DISTINCT p'
//
//     const result = await session.run(CYPHER_QUERY, {
//       program_id: programId,
//     })
//
//     const extractNode = (node) => {
//       let extracted = {
//         ...node.properties,
//         tag: node.labels[0],
//       }
//
//       if (extracted.tag === 'Requirement' && node.properties.units) {
//         extracted.label = node.properties.units.low
//       } else if (extracted.tag === 'Program') {
//         extracted.label = node.properties.name
//       } else if (extracted.tag === 'Specialisation') {
//         extracted.label = node.properties.name
//       } else if (extracted.tag === 'Course') {
//         extracted.label = `${node.properties.id} - ${node.properties.name}`
//       }
//       return extracted
//     }
//     return extractDataset(result.records, extractNode)
//   })
//
//
//   if (result.isLoading) {
//     return (
//       <CircularProgress style={{ position: 'absolute', top: 1, left: 0 }} />
//     )
//   }
//   console.log(result.data)
//   return (
//     <React.Fragment>
//       <Container>
//         <Paper className={fixedHeightPaper}>
//           <Autocomplete
//             disablePortal
//             options={programs}
//             getOptionLabel={(option) => `${option.name} - ${option.id}`}
//             sx={{ width: 400 }}
//             renderInput={(params) => {
//               return <TextField {...params} label="Choose a Program" />
//             }}
//             onChange={handleSelection}
//           />
//           <ProgramGraph dataset={result.data} />
//           <CourseTable dataset={result.data} clearSelected={clearSelected} />
//         </Paper>
//       </Container>
//     </React.Fragment>
//   )
// }
