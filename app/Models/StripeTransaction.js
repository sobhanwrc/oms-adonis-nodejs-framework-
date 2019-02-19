const mongoose = use ('mongoose');

const Schema = mongoose.Schema;

var chargeDetails = new Schema ({
    user_id : {type : Schema.Types.ObjectId, ref: "User"},
    transaction_id : { type : String, default: ''},
    type: {type : String, default : ''},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('StripeTransaction', chargeDetails);