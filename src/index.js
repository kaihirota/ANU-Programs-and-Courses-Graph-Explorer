import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import './styles.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { SelectedCourseRowContext, SelectedProgramContext } from './contexts'

const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI || '/graphql',
  cache: new InMemoryCache(),
})

const Main = () => {
  const saveSelectedProgramContext = (values) => {
    setSelectedProgramContext(values)
  }
  const [selectedProgramContext, setSelectedProgramContext] = useState({
    program: '',
    saveSelectedProgramContext: saveSelectedProgramContext,
  })

  const saveSelectedCourseRowContext = (values) => {
    setSelectedCourseRowContext(values)
  }
  const [selectedCourseRowContext, setSelectedCourseRowContext] = useState({
    coursesTaken: [],
    saveSelectedCourseRowContext: saveSelectedCourseRowContext,
  })
  return (
    <ApolloProvider client={client}>
      <SelectedProgramContext.Provider value={selectedProgramContext}>
        <SelectedCourseRowContext.Provider value={selectedCourseRowContext}>
          <App />
        </SelectedCourseRowContext.Provider>
      </SelectedProgramContext.Provider>
    </ApolloProvider>
  )
}

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// unregister()
