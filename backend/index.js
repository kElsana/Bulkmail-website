require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const sgMail = require("@sendgrid/mail")

const app = express()
app.use(cors({ origin: "*" }))
app.use(express.json())

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err.message))

// 📜 Email History Schema
const emailSchema = new mongoose.Schema({
  subject: String,
  message: String,
  total: Number,
  success: Number,
  failed: Number,
  createdAt: { type: Date, default: Date.now }
})

const EmailHistory = mongoose.model("EmailHistory", emailSchema)

// 🔁 Send Email API
app.post("/sendemail", async (req, res) => {
  try {
    const { subject, msg, EmailList } = req.body

    if (!subject || !msg || !EmailList?.length) {
      return res.status(400).json({ ok: false })
    }

    let success = 0
    let failed = 0

    const messages = EmailList.map(email => ({
      to: email,
      from: process.env.SENDER_EMAIL,
      subject,
      text: msg
    }))

    try {
      await sgMail.send(messages)
      success = EmailList.length
    } catch {
      failed = EmailList.length
    }

    await EmailHistory.create({
      subject,
      message: msg,
      total: EmailList.length,
      success,
      failed
    })

    res.json({ ok: true, success, failed })

  } catch (err) {
    console.log(err.message)
    res.json({ ok: false })
  }
})

// 📜 Get History
app.get("/history", async (req, res) => {
  const data = await EmailHistory.find().sort({ createdAt: -1 })
  res.json(data)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running", PORT))

