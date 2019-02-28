const mongoose = use ('mongoose')

var Schema = mongoose.Schema;

var ServiceType = new Schema({
    service_type : { type: String},
    child_services_type : [{
        name : {type: String},
        price : {type : String},
    }],
    status : { type: Number, default:1},
    created_at : { type: Date, default : Date.now()}
})

module.exports = mongoose.model('ServiceType', ServiceType);