require("dotenv").config()
const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer");
const mongoose=require("mongoose")
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

    // if (mongoose.connection.readyState !== 1) {
    //   return res.send(false)
    // }/

    if (!msg || !EmailList || EmailList.length === 0) {
      console.log("Empty message or email list")
      return res.send(false)
    }

    const data = await Credential.findOne()
    if (!data) {
      console.log("no email credentials in DB")
      return res.send(false)
    }

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
app.listen(PORT, () => console.log("server started on port", PORT))

