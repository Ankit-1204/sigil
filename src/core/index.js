import { InMemory } from './memory/inmemory.js'
import { GeminiAdapter } from './adaptors/gemini.js'
import { OpenAiAdapter } from './adaptors/openAI.js'

class ChatEngine {
    constructor(config) {
        console.log("Initialized")
        const Adapter = config.adapter || require('./adaptors/gemini.js')
        this.model = new Adapter(config.modelConfig)
        this.systemPrompt = config.systemPrompt || "You are a helpful AI assistant."
        this.memory= new InMemory(config.maxHistory || 15)
    }

    _formatMessage(userInput){
        const history = this.memory.getHistory()
        const messages=[]
        if (this.systemPrompt) {
            messages.push({ role: 'system', content: this.systemPrompt });
        }
        history.forEach((msg)=>{
            messages.push({role:msg.role.toLowerCase(),content:msg.content})
        })
        messages.push({role:'user',content:userInput})
        return messages
    }

    async ask(message){
        const completeMessage=this._formatMessage(message)
        console.log(completeMessage)
        const response = await this.model.generate(completeMessage)
        console.log(response)
        this.memory.addMessage('assistant',response)
        return response
    }

    reset(){
        this.memory.clear()
    }
}

export {ChatEngine,
    InMemory,
    OpenAiAdapter,
    GeminiAdapter
}