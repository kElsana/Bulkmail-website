import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {

const [subject, setSubject] = useState("")
  const [msg, setMsg] = useState("")
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)



  function handleFile(e) {
    const reader = new FileReader()
    reader.onload = ev => {
      const workbook = XLSX.read(ev.target.result, { type: "binary" })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(sheet, { header: "A" })
      setEmails(data.map(d => d.A))
    }
    reader.readAsBinaryString(e.target.files[0])
  }

  function send() {
    setLoading(true)
    axios.post(`https://bulkmail-website-5.onrender.com/sendemail`, {
      subject,
      msg,
      EmailList: emails
    }).then(res => {
      setResult(res.data)
      setLoading(false)
    })
  }

  function loadHistory() {
    axios.get(`https://bulkmail-website-5.onrender.com/history`).then(res => {
      setHistory(res.data)
      setShowHistory(true)
    })
  }

  return (
    <>

     <div className="min-h-screen bg-gradient-to-br from-[#4b3f8f] via-[#6b5fb5] to-[#a8c8ff] p-6">
      <div className="max-w-2xl mx-auto rounded-2xl
            bg-white/75 backdrop-blur-md
            shadow-2xl border border-white/30 p-6">
        <h1 className="text-2xl text-[#2e256f] font-bold text-center mb-4">📧 Bulk Mail App</h1>
        <p className="text-xl text-[#4b3f8f] font-medium text-center mb-4">Send multiple emails easily with Excel upload</p>
        <p className="text-xl text-[#4b3f8f] font-medium mb-4">SUBJECT:</p>
        
        <input
          className="w-full  mb-3 rounded-lg border border-[#6b5fb5]/30 bg-white/60 p-2 text-[#2e256f] focus:outline-none focus:ring-2 focus:ring-[#6b5fb5]"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        
        <p className="text-xl text-[#4b3f8f] font-medium mb-4">Email Body:</p>
        <textarea
          className="w-full mb-3 rounded-lg border border-[#6b5fb5]/30
         bg-white/60 p-2 text-[#2e256f]
         focus:outline-none focus:ring-2 focus:ring-[#6b5fb5]"
          rows="4"
          placeholder="Message"
          value={msg}
          onChange={e => setMsg(e.target.value)}
        />

        <input type="file" onChange={handleFile} className="mb-2 border border-dashed p-2 shadow" />
        <p className="text-sm">Total Emails: {emails.length}</p>

        <button
          disabled={loading}
          onClick={send}
          className="w-full mt-4 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#5a4fcf] to-[#7bdcb5] hover:scale-[1.02] transition"
        >
          {loading ? "Sending..." : "Send Emails"}
        </button>

        {result && (
          <div className="mt-4 text-sm text-[#2e256f]">
            ✅ Success: {result.success} <br />
            ❌ Failed: {result.failed}
          </div>
        )}

        <button
          onClick={loadHistory}
          className="mt-4 text-blue-600 font-bold underline"
        >
          View History
        </button>
      </div>

      {showHistory && (
        <div className="max-w-3xl mx-auto mt-6 p-4 shadow  bg-white/60 backdrop-blur-sm
        rounded-xl  border border-white/30 text-[#2e256f]">
          <h2 className="font-bold mb-2">📜 Email History</h2>
          {history.map(h => (
            <div key={h._id} className="border-b py-2 text-sm">
              <b>{h.subject}</b> | {h.total} mails |
              ✅ {h.success} ❌ {h.failed}
            </div>
          ))}
        </div>
      )}
    </div>
       
    </>
  )
}

export default App
