class InMemory{
    constructor(max_length=10){
        this.history=[]
        this.max_length=max_length
    } 

    addMessage(role,content){
        console.log(`${role} and ${content}`)
        this.history.push({role,content})
        if (this.history.length > this.max_length) {
            this.history.shift();
        }
    }
    getHistory(){
        return this.history;
    }
    clear(){
        return this.history=[];
    }
}

module.exports= InMemory;