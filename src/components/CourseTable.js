import React from 'react'
import PropTypes from 'prop-types'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export function createRow(
  id,
  name,
  units,
  academic_career,
  college,
  course_convener
) {
  return {
    id,
    name,
    units,
    academic_career,
    college,
    course_convener,
  }
}

const rows = [
  createRow('COMP9999', 'test class', 6, 'PGRD', 'CECS', 'Santa Claus'),
  createRow('COMP4499', 'test class', 6, 'PGRD', 'CECS', 'Santa Claus'),
  createRow('COMP9449', 'test class', 6, 'PGRD', 'CECS', 'Santa Claus'),
  createRow('COMP9900', 'test class', 6, 'PGRD', 'CECS', 'Santa Claus'),
  createRow('COMP2100', 'test class', 6, 'PGRD', 'CECS', 'Santa Claus'),
]

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
  const { rows } = props

  return (
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
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

CourseTable.propTypes = {
  rows: PropTypes.array.isRequired,
}
CourseTable.defaultProps = {
  rows: rows,
}
