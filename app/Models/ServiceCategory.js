const mongoose = use ('mongoose')

var Schema = mongoose.Schema;

var ServiceCategory = new Schema({
    service_category : { type: String},
    service_type : [{
        service_type_id : {type: Schema.Types.ObjectId, ref: "ServiceType"}
    }],
    category_image : { type : String},
    description : { type : String},
    status : { type: Number, default:1},
    created_at : { type: Date, default : Date.now()}
})

module.exports = mongoose.model('ServiceCategory', ServiceCategory);