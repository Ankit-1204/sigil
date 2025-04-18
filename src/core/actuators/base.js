class Base_Actuator {
    constructor(description, parameters = {}) {
      this.description = description;
      this.parameters = parameters;
    }
    
    async execute(parameters) {
      throw new Error('Execute method must be implemented by subclass');
    }
  }

class Actuator_Registry {
    constructor() {
      this.actuators = {};
    }
  
    register(name, actuator) {
      this.actuators[name] = actuator;
    }
  
    getActuator(name) {
      return this.actuators[name];
    }
  
    listActuators() {
      return Object.keys(this.actuators);
    }
  
    generateActuatorDescriptions() {
      const descriptions = [];
      for (const [name, actuator] of Object.entries(this.actuators)) {
        descriptions.push({
          name,
          description: actuator.description,
          parameters: actuator.parameters || {}
        });
      }
      return descriptions;
    }
  }

export { Base_Actuator, Actuator_Registry };