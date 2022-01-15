import React, { useEffect } from 'react'
import { Checkbox } from '@material-ui/core'
import DataTable from 'react-data-table-component'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { setSelectedCourses } from '../selections'

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

export default function CourseTable(props) {
  const { dataset, clearSelected } = props
  const dispatch = useDispatch()
  // const programId = useSelector((state) =>
  //   state.selections ? state.selections.programId : ''
  // )
  // const selectedCourses = useSelector((state) =>
  //   state.selections ? state.selections.selectedCourses : []
  // )
  const ExpandedComponent = ({ data }) => <p>{data.description}</p>

  const handleChange = ({ allSelected, selectedCount, selectedRows }) => {
    dispatch(setSelectedCourses(selectedRows.map((cls) => cls.id)))
  }

  return (
    <DataTable
      title="Courses"
      columns={columns}
      data={dataset.nodes.filter((node) => node.tag === 'Course')}
      expandableRows
      expandableRowsComponent={ExpandedComponent}
      selectableRows
      selectableRowsComponent={Checkbox}
      pagination
      onSelectedRowsChange={handleChange}
      clearSelectedRows={clearSelected}
    />
  )
}

CourseTable.propTypes = {
  dataset: PropTypes.shape({
    nodes: PropTypes.array.isRequired,
    edges: PropTypes.array.isRequired,
  }).isRequired,
  clearSelected: PropTypes.bool.isRequired,
}
