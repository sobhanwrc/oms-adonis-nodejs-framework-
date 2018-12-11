const mongoose = use ('mongoose');

const Schema = mongoose.Schema;

var chargeDetails = new Schema ({
    user_id : {type : Schema.Types.ObjectId, ref: "User"},
    charge_id : { type : String},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('StripeCharge', chargeDetails);