const mongoose = use('mongoose');

const Schema = mongoose.Schema;

var assignCoupon = new Schema({
    user_id : {type : Schema.Types.ObjectId, ref:"User"},
    coupon_id : {type : Schema.Types.ObjectId, ref:"Coupon"},
    status : { type : String},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('AssignCouponToUser',assignCoupon);