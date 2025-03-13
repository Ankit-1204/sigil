const axios = require('axios')

class GeminiAdapter {
    constructor(config){
        this.apiKey = config.apiKey
        this.apiUrl = config.apiUrl || "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
    }

    _formatMessage(history){
        return history.map(msg =>({
            role : msg.role.toLowerCase()=='user'?'user':'model',
            parts: [{text : msg.content}]
        })) 
    }

    async generate(history,options={}){
        const formatHistory=this._formatMessage(history);
        try {
            const res= await axios.post(`${this.apiUrl}?key=${this.apiKey}`,
            {
                contents:formatHistory,
                generationConfig : {
                    temperature: options.temperature || 0.7,
                    maxOutputTokens: options.max_tokens || 512,
                }
            },
            {
               headers: {
                'Content-Type': 'application/json'
                    } 
            }
        )
        console.log(res)
        return res.candidates[0]?.content?.parts[0]?.text.trim() || 'No Response'
        } catch (error) {
            console.error('Gemini API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch response from Gemini');
        }
    }
}

module.exports = GeminiAdapter;