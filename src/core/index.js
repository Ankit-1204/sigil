import { InMemory } from './memory/inmemory.js'
import { GeminiAdapter } from './adaptors/gemini.js'
import { OpenAiAdapter } from './adaptors/openAI.js'
import { Base_Actuator } from './actuators/base.js'
import { Actuator_Registry } from './actuators/base.js'

class ChatEngine {
    constructor(config) {
        console.log("Initialized")
        const Adapter = config.adapter || require('./adaptors/gemini.js')
        this.actuatorRegistry = new Actuator_Registry();
        this.maxSteps = config.maxSteps || 5;
        this.model = new Adapter(config.modelConfig)
        this.systemPrompt = config.systemPrompt || "You are a helpful AI assistant."
        this.memory= new InMemory(config.maxHistory || 15)
        if (config.actuators) {
            for (const [name, actuator] of Object.entries(config.actuators)) {
              this.actuatorRegistry.register(name, actuator);
            }
        }
    }
    _buildPrompt(){
        const actuators = this.actuatorRegistry.generateActuatorDescriptions();
        let prompt = this.systemPrompt + "\n\n";
        if (actuators.length > 0) {
            prompt += "AVAILABLE ACTIONS:\n";
            actuators.forEach(act => {
              prompt += `- ${act.name}: ${act.description}\n`;
              if (act.parameters && Object.keys(act.parameters).length > 0) {
                prompt += "  Parameters:\n";
                for (const [param, desc] of Object.entries(act.parameters)) {
                  prompt += `  - ${param}: ${desc}\n`;
                }
              }
            });
            
            prompt += `You will solve tasks using the ReAct approach: Reasoning + Acting.

            APPROACH:
            1. THINK: Always start by thinking step-by-step about the task, breaking it down into smaller steps.
            2. ACT: Use available tools to perform actions.
            3. OBSERVE: Review the results of your actions.
            4. REPEAT: Continue this cycle of thinking, acting, and observing until you solve the task.

            For each step in your response, use the following format:

            <thinking>
            Your step-by-step reasoning about what to do next and why. Analyze the problem, consider options, and decide on an approach.
            </thinking>

            <action name="ACTION_NAME" parameters={"param1": "value1", "param2": "value2"}>
            Brief explanation of why you're taking this action
            </action>

            <observation>
            After executing an action, you will see results here. In your response, predict what you'll observe.
            </observation>

            \nProvide your final answer after you've gathered all necessary information. Begin by understanding the user's request, then apply the ReAct approach to solve it step-by-step.`;
          }
          
          return prompt;
        }
    async _processAction(response){
        const actionRegex = /<action\s+name="([^"]+)"\s+parameters=({[^}]+})>\s*([\s\S]*?)\s*<\/action>/g;
        const observationRegex = /<observation>([\s\S]*?)<\/observation>/g;
        let processedResponse = response;
        let match;
        let actionResults = [];
        while ((match = actionRegex.exec(response)) !== null) {
            const actionName = match[1];
            const parametersString = match[2];
            const reasoning = match[3];
            const fullMatch = match[0];
            try {
                const parameters = JSON.parse(parametersString);
                const actuator = this.actuatorRegistry.getActuator(actionName);
                if (!actuator) {
                    const errorMsg = `Action '${actionName}' not found`;
                    processedResponse = processedResponse.replace(
                        observationRegex, 
                        `<observation>\nError: ${errorMsg}\n</observation>`
                    );
                    continue;
                  }
                  const result = await actuator.execute(parameters);
                  actionResults.push({
                    action: actionName,
                    success: true,
                    parameters,
                    reasoning,
                    result
                  });
                  processedResponse = processedResponse.replace(
                    observationRegex, 
                    `<observation>\n${JSON.stringify(result, null, 2)}\n</observation>`
                  );
            } catch (error) {
                if (this.verbose) console.error(`Error executing action '${actionName}':`, error);
                
                actionResults.push({
                    action: actionName,
                    success: false,
                    error: error.message,
                    result: null
                });
                processedResponse = processedResponse.replace(
                    observationRegex, 
                    `<observation>\nError: ${error.message}\n</observation>`
                  );
                }
                }
                
                return { processedResponse, actionResults };
            }
    
    _formatMessage(userInput){
        const history = this.memory.getHistory()
        const messages=[]
        if (this.systemPrompt) {
            messages.push({ role: 'system',content: this._buildPrompt()});
        }
        history.forEach((msg)=>{
            messages.push({role:msg.role.toLowerCase(),content:msg.content})
        })
        messages.push({role:'user',content:userInput})
        return messages
    }

    async ask(message){
        this.memory.addMessage('user', message);
        let currentQuestion = message;
        let currentStep = 0;
        let finalResponse = '';
        while(currentStep < this.maxSteps){
            currentStep++;
            const completeMessage=this._formatMessage(message)
            console.log(completeMessage)
            const response = await this.model.generate(completeMessage)
            const { processedResponse, actionResults } = await this._processReActResponse(response);
            finalResponse += processedResponse + '\n\n';
            if (actionResults.length === 0 || this._isResponseComplete(processedResponse)) {
                break;
            }
            currentQuestion = "Continue from your previous observations and complete the task.";
            this.memory.addMessage('assistant', processedResponse);
            this.memory.addMessage('user', currentQuestion);
        }
        
        const cleanedResponse = this._cleanFinalResponse(finalResponse);
        this.memory.addMessage('assistant', cleanedResponse);
        
        return cleanedResponse;
    }

    _cleanFinalResponse(response) {
        let cleaned = response;
        cleaned = cleaned.replace(/<thinking>([\s\S]*?)<\/thinking>/g, '$1');
        cleaned = cleaned.replace(/<action\s+name="([^"]+)"\s+parameters=({[^}]+})>\s*([\s\S]*?)\s*<\/action>/g, 
          'I used $1 to $3');
        cleaned = cleaned.replace(/<observation>([\s\S]*?)<\/observation>/g, 
          'This gave me the following information:\n$1\n');
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
        
        return cleaned;
      }

    _isResponseComplete(response) {
        return (
          response.includes("final answer") || 
          response.includes("Final answer") ||
          response.includes("to summarize") ||
          response.includes("In conclusion")
        );
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