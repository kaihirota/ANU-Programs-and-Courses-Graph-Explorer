import React, { useContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { gql, useLazyQuery } from '@apollo/client'
import UserContext from '../UserContext'
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  TablePagination,
} from '@material-ui/core'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

export default function CourseTable() {
  const user = useContext(UserContext)
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
          description
        }
      }
    }
  `

  const [getClasses, { data, error, loading }] = useLazyQuery(
    QUERY_PROGRAM_CLASSES
  )
  const [classes, setClasses] = useState([])
  const [selectedClasses, setSelectedClasses] = useState([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)

  function Row(props) {
    const { row, selected } = props
    const [open, setOpen] = useState(false)
    const [isSelected, setIsSelected] = useState(selected)

    const updateSelectedClasses = (checked, classId) => {
      if (checked && !selectedClasses.includes(classId)) {
        setSelectedClasses([...selectedClasses, classId])
      } else if (!checked && selectedClasses.includes(classId)) {
        setSelectedClasses(selectedClasses.filter((c) => c !== classId))
      }
    }

    const handleClick = (event) => {
      setIsSelected(event.target.checked)
      updateSelectedClasses(event.target.checked, row.id)
    }

    return (
      <React.Fragment>
        <TableRow
          hover
          role="checkbox"
          aria-checked={isSelected}
          tabIndex={-1}
          key={row.name}
          selected={isSelected}
        >
          <TableCell>
            <Checkbox
              color="primary"
              checked={isSelected}
              onClick={handleClick}
              inputProps={{
                'aria-labelledby': row.id,
              }}
            />
          </TableCell>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row" id={row.id} padding="none">
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
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>{row.description}</Box>
            </Collapse>
          </TableCell>
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
      description: PropTypes.string,
    }).isRequired,
    selected: PropTypes.bool,
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - classes.length) : 0

  useEffect(async () => {
    await getClasses({ variables: { id: user.program } })
  }, [user])

  const getUniqueClasses = (classes) => {
    let obj = {}
    classes
      .filter((cls) => cls.id && cls.id !== '')
      .filter((cls) => cls.name && cls.name.trim() !== '')
      .forEach((cls) => {
        obj[cls.id] = cls
      })
    return Object.keys(obj).map(function (id) {
      return obj[id]
    })
  }

  useEffect(() => {
    if (data && data.programs && data.programs.length > 0) {
      setClasses(getUniqueClasses(data.programs[0].classes))
    }
  }, [data])

  return (
    <React.Fragment>
      {!loading && !error && (
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell>Completed</TableCell>
                <TableCell />
                <TableCell>ID</TableCell>
                <TableCell align="right">Name</TableCell>
                <TableCell align="right">Units</TableCell>
                <TableCell align="right">Academic Career</TableCell>
                <TableCell align="right">College</TableCell>
                <TableCell align="right">Convener</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.length > 0 &&
                classes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <Row
                        key={row.id}
                        row={row}
                        selected={selectedClasses.includes(row.id)}
                      />
                    )
                  })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={9} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component={'div'}
        count={classes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </React.Fragment>
  )
}
