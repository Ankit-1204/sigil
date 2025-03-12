const InMemory= require("./memory/inmemory")

class ChatEngine {
    constructor(config) {
        const Adapter = config.Adapter || require('./adaptors/gemini')
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
        completeMessage=this._formatMessage(message)
        const response = await this.model.generate(completeMessage)
        this.memory.addMessage('assistant',response)
    }

    reset(){
        this.memory.clear()
    }
}

module.exports=ChatEngine