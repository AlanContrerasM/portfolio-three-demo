import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import Background from './components/Background'
import Box from './components/Box'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Background/>
      {/* <Box/> */}
    </div>
  )
}

export default App
