const express= require('express')
const cors = require('cors')
const ChatEngine = require('../coal/src/core/index.cjs')
const Adapter = require('../coal/src/core/adaptors/gemini.cjs')
require("dotenv").config();
const app=express()
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

const chat= new ChatEngine({modelConfig: {apiKey:process.env.GEMINI_API}, adapter:Adapter,systemPrompt:"Talk like superman."})
app.post('/chat', async (req,res)=>{
    try {
        const message=req.body
        console.log(message.message)
        const data=await chat.ask(message.message)
        res.json({data})
    } catch (err) {
        res.status(500).json({ error: err.message });
      }
})
app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`)
})