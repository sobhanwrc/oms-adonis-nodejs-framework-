const mongoose = use ('mongoose')

var Schema = mongoose.Schema;

var ServiceCategory = new Schema({
    service_category : { type: String},
    service_type : {
        type: Schema.Types.ObjectId,
        ref: "ServiceType"
    },
    status : { type: Number, default:1},
    created_at : { type: Date, default : Date.now()}
})

module.exports = mongoose.model('ServiceCategory', ServiceCategory);