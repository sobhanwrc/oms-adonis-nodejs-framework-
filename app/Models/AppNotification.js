const mongoose = use('mongoose')
const Schema = mongoose.Schema;

var data = new Schema({
    user_id : {type : Schema.Types.ObjectId, ref:"User"},
    message : { type : String},
    created_at : { type : Date , default : Date.now()} 
});

module.exports = mongoose.model('AppNotification', data);