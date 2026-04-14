import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);

  useEffect(()=>{
      ;(async () =>{
        const response = await axios.get('/api/students')
        console.log(response)
        setStudents(response.data)
      })()

    }, []
  )

  return (
    <>
      
      <h2>Number of items: {students.length}</h2>
      <div>
        {students.map((student)=>{
        return <div id='student.id'>
          <h2>{student.name} </h2>
        </div>
        })}
      </div>
      

    </>
  )
}

export default App
