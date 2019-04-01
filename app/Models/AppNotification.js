const mongoose = use('mongoose')
const Schema = mongoose.Schema;

var data = new Schema({
    device : { type : Number }, //1 = android, 2 = iOs,
    message : { type : String},
    message_type : { type : Number },
    created_at : { type : Date , default : Date.now()} 
});

module.exports = mongoose.model('AppNotification', data);