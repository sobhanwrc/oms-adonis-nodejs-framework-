const mongoose = use ('mongoose');

const Schema = mongoose.Schema;

var service = new Schema ({
    create_service_id : { type : String, unique: true},
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
    service_allocated_or_not : {type : Number, default : 0}, //1= allocated, 0 = not allocated
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model ('Service', service);