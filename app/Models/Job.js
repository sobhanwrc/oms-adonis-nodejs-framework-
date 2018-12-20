const mongoose = use('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  create_job_id : { type : String, unique: true},
  user_id : {type : Schema.Types.ObjectId, ref:"User"},
  job_title : { type: String, unique: true},
  service_require_at : { type: String},
  job_industry : {
    type: Schema.Types.ObjectId,
    ref: "JobIndustry"
  },
  job_category : {
    type: Schema.Types.ObjectId,
    ref: "JobCategory"
  },
  job_date : { type: Date},
  job_endDate : { type: Date},
  job_time : { type: String},
  job_end_time : {type: String},
  description : { type: String},
  duration : {type : String},
  job_amount : {type : Number},
  job_allocated_to_vendor : {type : Number},
  vendor_id : { type : String, default :''},
  transaction_id : {type : String, default :''},
  status : { type: Number},
  created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('Job', schema);