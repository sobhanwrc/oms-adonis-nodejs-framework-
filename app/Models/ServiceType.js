const mongoose = use ('mongoose')

var Schema = mongoose.Schema;

var ServiceType = new Schema({
    parent_service : { type: String},
    parent_service_image : { type : String },
    child_services : [{
        name : {type: String},
        price : {type : String},
        ask_for_quote : {type : String, default : 0}, //1 or 0
        delete : { type : Number, default : 0} // 0=Not delete,1 = delete;
    }],
    status : { type: Number, default:1},
    isDelete : { type : Number, default : 0}, // 0=Not delete,1 = delete;
    deleted_at : { type : Date, default : ''},
    created_at : { type: Date, default : Date.now()}
})

module.exports = mongoose.model('ServiceType', ServiceType);