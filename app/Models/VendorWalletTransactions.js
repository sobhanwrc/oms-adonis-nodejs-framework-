const mongoose = use('mongoose');
const Schema = mongoose.Schema;

var vendor_wallet = new Schema({
    vendor_id : {type : Schema.Types.ObjectId, ref:"User"},
    credit: { type : Number},
    earning : { type : Number},
    deduction_amount : { type: Number},
    job_id : {type : Schema.Types.ObjectId, ref:"Job"},
    created_at : { type: Date, default : Date.now()},
});

module.exports = mongoose.model('VendorWalletTransactions', vendor_wallet);