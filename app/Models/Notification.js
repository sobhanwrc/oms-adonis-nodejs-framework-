var mongoose = use('mongoose')
var schema = mongoose.Schema;

var notify = new schema({
    description : { type : "String"},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('Notification', notify);