import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import './styles.css'
import registerServiceWorker from './registerServiceWorker'

const Main = () => {
  return <App />
}

ReactDOM.render(<Main />, document.getElementById('root'))
registerServiceWorker()
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// unregister()
