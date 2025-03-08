const express= require('express')
const cors = require('cors')
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app=express()
const PORT = process.env.PORT || 5000;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post('/chat', async (req,res)=>{
    try {
        const message = req.body;
        console.log(message)
        console.log({contents:message.map((msg)=>({
            role:msg.role,parts :[{
                text:msg.text
            }]
        }))})
        const resp = await model.generateContent({contents:message.map((msg)=>({
            role:msg.role,parts :[{
                text:msg.text
            }]
        }))});
        console.log(resp.response.text())
        res.json({ reply: resp.response.text() || " " });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
})
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})