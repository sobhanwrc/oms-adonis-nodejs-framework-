const mongoose = use ('mongoose');

const Schema = mongoose.Schema;

var service = new Schema ({
    user_id : {type : Schema.Types.ObjectId, ref: 'User'},
    service_title : { type: String},
    added_services_details : [{
        parent_service_id : { type: Schema.Types.ObjectId, ref: "ServiceType"}
    }],
    service_category : {
        type: Schema.Types.ObjectId,
        ref: "ServiceCategory"
    },
    rate : { type :String},
    start_date : { type: Date},
    end_date : { type: Date},
    description : { type: String},
    status : { type: Number, default : 1},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model ('Service', service);