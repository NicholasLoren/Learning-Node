const EventEmitter = require("events")

class Logger extends EventEmitter{




    log(message){
        this.emit('log',message)
    }
}

// export default Logger;
module.exports = Logger;