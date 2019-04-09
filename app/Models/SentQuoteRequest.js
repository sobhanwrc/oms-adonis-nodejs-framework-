const mongoose = use('mongoose');
const Schema = mongoose.Schema;

const sentQuoteSchema = new Schema({
    customer_id : { type : Schema.Types.ObjectId, ref:"User"},
    vendor_id : {type : Schema.Types.ObjectId, ref:"User"},
    job_id : {type : Schema.Types.ObjectId, ref:"Job"},
    ask_for_quote_details : [{
        parent_service_id : { type: Schema.Types.ObjectId, ref: "ServiceType"},
        child_service_id : { type: String},
    }],
    created_at : { type : Date, default : Date.now()}
})

module.exports = mongoose.model('SentQuoteRequest',sentQuoteSchema);