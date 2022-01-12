import React, { useContext, useEffect, useState } from 'react'
import { gql, useLazyQuery } from '@apollo/client'

import { getUniqueClassesSorted } from '../utils'
import { Checkbox } from '@material-ui/core'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedCourses, toggleCourse } from '../selections'

const columns = [
  {
    name: 'ID',
    selector: (row) => row.id,
    sortable: true,
    width: '10%',
  },
  {
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    width: '30%',
    wrap: true,
  },
  {
    name: 'Units',
    selector: (row) => row.units,
    sortable: true,
    width: '10%',
  },
  {
    name: 'College',
    selector: (row) => row.college,
    sortable: true,
    width: '30%',
  },
  {
    name: 'Course Convener',
    selector: (row) => row.course_convener,
    sortable: true,
    width: '15%',
  },
]

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

export default function CourseTable(props) {
  const { clearSelected } = props
  const programId = useSelector((state) =>
    state.selections ? state.selections.programId : ''
  )
  const selectedCourses = useSelector((state) =>
    state.selections ? state.selections.selectedCourses : []
  )
  const dispatch = useDispatch()
  const [getClasses, { data, error, loading }] = useLazyQuery(
    QUERY_PROGRAM_CLASSES
  )
  const [classes, setClasses] = useState([])
  const ExpandedComponent = ({ data }) => <p>{data.description}</p>

  useEffect(async () => {
    await getClasses({ variables: { id: programId } })
  }, [programId])

  useEffect(() => {
    if (data && data.programs && data.programs.length > 0) {
      setClasses(getUniqueClassesSorted(data.programs[0].classes))
    }
  }, [data])

  const handleChange = ({ allSelected, selectedCount, selectedRows }) => {
    dispatch(setSelectedCourses(selectedRows.map((cls) => cls.id)))
  }

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
      onSelectedRowsChange={handleChange}
      progressPending={loading}
      clearSelectedRows={clearSelected}
    />
  )
}

CourseTable.propTypes = {
  clearSelected: PropTypes.bool.isRequired,
}
