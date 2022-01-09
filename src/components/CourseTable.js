import React, { useContext, useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'
import { SelectedCourseRowContext, SelectedProgramContext } from '../contexts'
import { getUniqueClasses } from '../utils'
import { Checkbox } from '@material-ui/core'
import DataTable from 'react-data-table-component'

export default function CourseTable() {
  const selectedProgramContext = useContext(SelectedProgramContext)
  const selectedCourseRowContext = useContext(SelectedCourseRowContext)
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

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Units',
      selector: (row) => row.units,
      sortable: true,
    },
    {
      name: 'Academic Career',
      selector: (row) => row.academic_career,
    },
    {
      name: 'College',
      selector: (row) => row.college,
      sortable: true,
    },
    {
      name: 'Course Convener',
      selector: (row) => row.course_convener,
      sortable: true,
    },
  ]
  const ExpandedComponent = ({ data }) => <p>{data.description}</p>

  useEffect(async () => {
    await getClasses({ variables: { id: selectedProgramContext.program } })
  }, [selectedProgramContext])

  useEffect(() => {
    if (data && data.programs && data.programs.length > 0) {
      let classes = getUniqueClasses(data.programs[0].classes)
      if (
        selectedCourseRowContext.coursesTaken &&
        selectedCourseRowContext.coursesTaken.length > 0
      ) {
        const selected = classes.filter((c) =>
          selectedCourseRowContext.coursesTaken.includes(c.id)
        )
        const notSelected = classes.filter(
          (c) => !selectedCourseRowContext.coursesTaken.includes(c.id)
        )
        classes = selected.concat(notSelected)
      }
      setClasses(classes)
    }
  }, [data, selectedCourseRowContext])

  return (
    <DataTable
      title="Courses"
      columns={columns}
      data={classes}
      expandableRows
      expandableRowsComponent={ExpandedComponent}
      selectableRows
      selectableRowsComponent={Checkbox}
      pagination
    />
  )
}
