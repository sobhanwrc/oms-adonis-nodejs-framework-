const mongoose = use('mongoose')

const Schema = mongoose.Schema;

const audit_log = new Schema({
    job_id : {type : Schema.Types.ObjectId, ref : "Job"},
    status : { type : String},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('AuditLog', audit_log);