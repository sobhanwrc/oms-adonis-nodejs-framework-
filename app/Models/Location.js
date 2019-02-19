const mongoose = use ('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema ({
    name : {type : String},
    status : { type: Number, default:1},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('Location',locationSchema)