const mongoose = use ('mongoose')

var Schema = mongoose.Schema;

var ServiceType = new Schema({
    parent_service : { type: String},
    parent_service_image : { type : String },
    child_services : [{
        name : {type: String},
        price : {type : String},
        ask_for_quote : {type : Number, default : 0} //1 or 0
    }],
    status : { type: Number, default:1},
    created_at : { type: Date, default : Date.now()}
})

module.exports = mongoose.model('ServiceType', ServiceType);