require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const sgMail = require("@sendgrid/mail")

const app = express()

app.use(cors({ origin: "*" }))
app.use(express.json())

// 🔑 SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// MongoDB (keep it – future use)
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("Mongo error:", err.message))

app.post("/sendemail", async (req, res) => {
  try {
    const { msg, EmailList } = req.body

    if (!msg || !EmailList || EmailList.length === 0) {
      return res.status(400).send(false)
    }

    const messages = EmailList.map(email => ({
      to: email,
      from: process.env.SENDER_EMAIL, // ✅ verified sender
      subject: "A message from Bulk Mail App",
      text: msg
    }))

    // 🔥 Bulk send
    await sgMail.send(messages)

    console.log("All emails sent successfully")
    res.send(true)

  } catch (error) {
    console.error(error.response?.body || error.message)
    res.send(false)
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("Server running on port", PORT))






/*
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose=require("mongoose")
// const sgmail = require("@sendgrid/mail")
// const multer=require("multer")

const app = express()
app.use(cors({ origin: "*" }))
app.use(express.json())



mongoose.connect(process.env.MONGO_URL).then(()=>{
  console.log("connected to db");
}).catch((err)=>{
  console.log("failed to connect")
  console.log(err.message)
})

const credentialSchema = new mongoose.Schema({
  user: String,
  pass: String
})

const Credential = mongoose.model("Credential", credentialSchema, "bulkmail")


app.post("/sendemail", async (req, res) => {
  try {
    const { msg, EmailList } = req.body

    if (mongoose.connection.readyState !== 1) {
      return res.send(false)
    }

    const data = await Credential.findOne()
    if (!data) return res.send(false)

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data.user,
        pass: data.pass
      }
    })

    for (let email of EmailList) {
      await transporter.sendMail({
        from: data.user,
        to: email,
        subject: "A message from bulk mail app",
        text: msg
      })
      console.log("Email sent to:", email)
    }

    res.send(true)

  } catch (error) {
    console.log(error)
    res.send(false)
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log("server started on port", + PORT))*/