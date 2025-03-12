 import axios from "axios";

 class OpenAiAdapter{
    constructor(config){
        this.apiKey=config.apiKey
        this.model=config.model
        this.url=config.url
    }

    async generate(history , options={}){
        try {
            const res= await axios.post(
                this.apiUrl,
                {
                    model: this.model,
                    messages:history,
                    temperature: options.temperature || 0.8,
                    max_tokens: options.max_tokens || 512,
                },
                {
                    headers:{
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${this.apiKey}`
                    }
                }
            );
            return res.data.choices[0].messages.content.trim()
        } catch (error) {
            console.error('OpenAI API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch response from OpenAI');
          }
    }
 }

module.exports= OpenAiAdapter;