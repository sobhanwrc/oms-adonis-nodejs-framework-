const mongoose = use ('mongoose');

const Schema = mongoose.Schema;

var service = new Schema ({
    user_id : {type : Schema.Types.ObjectId, ref: 'User'},
    service_title : { type: String},
    // service_type : {
    //     type: Schema.Types.ObjectId,
    //     ref: "JobIndustry"
    // },
    service_category : {
        type: Schema.Types.ObjectId,
        ref: "JobCategory"
    },
    rate : { type :String},
    start_date : { type: Date},
    end_date : { type: Date},
    description : { type: String},
    status : { type: Number},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model ('Service', service);