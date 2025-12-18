import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {
  const [msg, setMsg] = useState("")
  const [status, setStatus] = useState(false)
  const [EmailList, setEmailList] = useState([])

  function handleMsg(evt){
    setMsg(evt.target.value)
  }

  function handlefile(evt){
    const file = evt.target.files[0]
    console.log(file)

    const reader = new FileReader();
    reader.onload =function(e){
      const data = e.target.result
      const workbook = XLSX.read(data, {type:'binary'})
      const sheetName=workbook.SheetNames[0]
      const worksheet=workbook.Sheets[sheetName]
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" })

      const totalemail = emaillist.map((item) => {
        return item.A
      })
      setEmailList(totalemail)
      console.log(totalemail)
    }
     reader.readAsBinaryString(file);
  }

  function send(){
    setStatus(true)
    axios.post("http://localhost:5000/sendemail",{msg:msg,EmailList:EmailList})
    .then((data)=>{
      if(data.data === true){
        alert("Email Sent Successfully")
        setStatus(false)
      }else{
        alert("Failed")
      }
    })
  }

  return (
    <>
      <div>
        <div className='bg-blue-950 text-white text-center '>
          <h1 className='text-2xl font-medium px-5 py-3'>BulkMail</h1>
        </div>

        <div className='bg-blue-800 text-white text-center '>
          <h1 className=' font-medium px-5 py-3'>We can hlep your business with sending multiple email at Advance</h1>
        </div>

        <div className='bg-blue-800 text-white text-center '>
          <h1 className=' font-medium px-5 py-3'>Drag and Drop</h1>
        </div>

        <div className='bg-blue-400 flex flex-col items-center text-black px-5 py-3'>
          <textarea onChange={handleMsg} value={msg} name="" className='w-[80%] h-32 py-2 outline-none px-2 my-5 bg-white border border-black rounded-md' placeholder='Enter the email text'></textarea>
        

        <div>
          <input onChange={handlefile} type="file" className='border-4 border-dashed py-4 px-4 mt-5 mb-5'/>
        </div>
        <p className='p-1'>Total Email in the file: {EmailList.length}</p>
            
       
          <button onClick={send} className='bg-blue-950 my-10 p-2 text-white font-medium rounded-md w-fit'>{status? "sending...":"send"}</button>

        </div>
         <div className='bg-blue-300 text-white text-center p-8'>

        </div>
         <div className='bg-blue-200 text-white text-center p-8'>

        </div>
      </div>
    </>
  )
}

export default App
