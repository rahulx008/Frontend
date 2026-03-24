import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h2> This is front end project</h2>
      <h2>{count}</h2>
      <button onClick={()=>{setCount(count + 1)}}>Click</button>

    </>
  )
}

export default App
