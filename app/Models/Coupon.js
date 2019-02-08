const mongoose = use ('mongoose');

const Schema = mongoose.Schema;

var couponSchema = new Schema ({
    coupons_title : {type : String},
    coupons_amount : { type : Number},
    coupons_valid_from : { type : Date},
    coupons_valid_to : {type : Date},
    coupons_code : {type : String, unique : true},
    created_at : { type: Date, default : Date.now()}
});

module.exports = mongoose.model('Coupon', couponSchema);