const mongoose = use('mongoose');

const Schema = mongoose.Schema;

const schema = new Schema({
  create_job_id : { type : String, unique: true},
  user_id : {type : Schema.Types.ObjectId, ref:"User"},
  user_location_id : { type : String},
  job_title : { type: String},
  service_require_at : { type: String},
  pincode : {type : String},
  service_category : {
    type: Schema.Types.ObjectId,
    ref: "ServiceCategory"
  },

  
  added_services_details : [{
    parent_service_id : { type: Schema.Types.ObjectId, ref: "ServiceType"},
    child_service_id : { type: String},
  }],

  ask_quote : {type: String, default : 0},
  job_date : { type: Date},
  job_endDate : { type: Date},
  job_time : { type: String},
  job_end_time : {type: String},
  description : { type: String},
  duration : {type : String},
  job_amount : {type : String, default : 0.0},
  job_allocated_to_vendor : {type : Number},
  vendor_id : { type : Schema.Types.ObjectId, ref:"User"},
  transaction_id : {type : String, default :''},
  status : { type: Number},
  review : { type : Number, default : 0}, // 1 = rating done, 0= rating incomplete
  rating_details : { type : Number},
  lat : { type : String, default : 0},
  long : { type : String, default : 0},
  created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('Job', schema);