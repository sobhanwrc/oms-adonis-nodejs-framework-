const mongoose = use('mongoose');

const Schema = mongoose.Schema;

const allocation = new Schema ({
    user_id : {type : Schema.Types.ObjectId, ref:"User"},
    job_id : {type : Schema.Types.ObjectId, ref:"Job"},
    status : {type : Number},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('VendorAllocation',allocation);
