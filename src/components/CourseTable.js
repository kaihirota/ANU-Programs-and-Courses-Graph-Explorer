import React from 'react'
import PropTypes from 'prop-types'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { gql, useLazyQuery } from '@apollo/client'

function Row(props) {
  const { row } = props
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell component="th" scope="row">
          <a
            href={'https://programsandcourses.anu.edu.au/course/' + row.id}
            target="_blank"
            rel="noreferrer"
          >
            {row.id}
          </a>
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.units}</TableCell>
        <TableCell align="right">{row.academic_career}</TableCell>
        <TableCell align="right">{row.college}</TableCell>
        <TableCell align="right">{row.course_convener}</TableCell>
      </TableRow>
    </React.Fragment>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    units: PropTypes.number,
    academic_career: PropTypes.string,
    college: PropTypes.string,
    course_convener: PropTypes.string,
  }).isRequired,
}

export default function CourseTable(props) {
  const { programs } = props
  const QUERY_PROGRAM_CLASSES = gql`
    query programs($id: ID!) {
      programs(where: { id: $id }) {
        classes {
          id
          name
          units
          academic_career
          college
          course_convener
        }
      }
    }
  `

  const [getClasses, { data, error, loading }] = useLazyQuery(
    QUERY_PROGRAM_CLASSES
  )

  const handleChange = (e) => {
    getClasses({ variables: { id: e.target.value } }).then((r) =>
      console.log(r)
    )
  }

  if (error || loading) {
    return (
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select degree</InputLabel>
        <Select label="Program Name" onChange={handleChange}>
          {programs.map((program) => {
            return (
              <MenuItem key={program.id} value={program.id} name={program.name}>
                {program.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    )
  }

  return (
    <React.Fragment>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Select degree</InputLabel>
        <Select label="Program Name" onChange={handleChange}>
          {programs.map((program) => {
            return (
              <MenuItem key={program.id} value={program.id} name={program.name}>
                {program.name}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Units</TableCell>
                <TableCell align="right">Academic Career</TableCell>
                <TableCell align="right">College</TableCell>
                <TableCell align="right">Convener</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data &&
                data.programs &&
                data.programs[0].classes.map((row) => (
                  <Row key={row.id} row={row} />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </React.Fragment>
  )
}

CourseTable.propTypes = {
  programs: PropTypes.array.isRequired,
}
