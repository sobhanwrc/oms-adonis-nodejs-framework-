const mongoose = use('mongoose');

const Schema = mongoose.Schema;

const allocation = new Schema ({
    user_id : {type : Schema.Types.ObjectId, ref:"User"},
    job_id : {type : Schema.Types.ObjectId, ref:"Job"},
    status : {type : Number},
    sent_quote_accept : {type : Number}, //1=accept/decline,2=accept,3=decline
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('VendorAllocation',allocation);
