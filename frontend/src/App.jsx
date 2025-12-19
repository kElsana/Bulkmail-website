import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {
  const [input, setinput] = useState("")
  const [status, setstatus] = useState(false)
  const [EmailList, setEmailList] = useState([])

  const handlebutton = () => {
    setstatus(true)
    axios.post("https://localhost:5000/sendmail", { input: input, EmailList: EmailList })
      .then((data) => {
        console.log(data)
        if (data.data === true) {
          alert("email sent successfully")
          setstatus(false)
        }
        else {
          alert("email sent failed")
        }
      })
  }

  const handleEmail = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = e.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const SheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[SheetName]
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" })

      const totalemail = emaillist.map((item) => {
        return item.A
      })
      setEmailList(totalemail)
      console.log(totalemail)
    }
    reader.readAsBinaryString(file)
  }

  return (
    <>
      <div>
      <header className="bg-green-600 text-white p-6 shadow-md">
        <h1 className="text-3xl font-bold text-center">📧 BulkMail</h1>
        <p className="text-center mt-2 text-gray-300">
          Send professional emails to your audience with ease.
        </p>
      </header>

      <section className="bg-green-500 text-white py-10 px-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
          Streamline Your Communication
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Upload your Excel email list, write a message, and hit send. It's that simple.
        </p>
      </section>

      <main className="bg-gray-100 min-h-screen  flex flex-col items-center px-4 py-10 space-y-6">
        <textarea
          onChange={(e) => setinput(e.target.value)}
          className="w-full sm:w-3/4 md:w-1/2 h-40 p-4 border rounded-md resize-none shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Type your email content here..."></textarea>

        <div className="w-full sm:w-3/4 md:w-1/2">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-400 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition">
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleEmail}/>

            <span className="text-gray-600 font-medium">
              📁 Click to upload Excel file with emails
            </span>
          </label>
        </div>

        <p className="text-gray-700">
          📬 Total emails loaded: <strong>{EmailList.length}</strong>
        </p>

        <button
          onClick={handlebutton}
          className="bg-green-500 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-md transition shadow disabled:opacity-50"
          disabled={status}>
          {status ? "Sending..." : "Send Emails"}
        </button>
      </main>

      <footer className="bg-gray-900 text-white text-center p-6 mt-10">
        <p className="text-sm text-gray-400">
          ©️ {new Date().getFullYear()} BulkMail. All rights reserved.
        </p>
      </footer>
    </div>
    </>
  )
}

export default App
