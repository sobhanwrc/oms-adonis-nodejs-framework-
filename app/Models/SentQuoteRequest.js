const mongoose = use('mongoose');
const Schema = mongoose.Schema;

const sentQuoteSchema = new Schema({
    quote_received_customer_id : { type : Schema.Types.ObjectId, ref:"User"},
    quote_sent_vendor_id : {type : Schema.Types.ObjectId, ref:"User"},
    job_id : {type : Schema.Types.ObjectId, ref:"Job"},
    ask_for_quote_details : [{
        parent_service_id : { type: Schema.Types.ObjectId, ref: "ServiceType"},
        child_service_id : { type: String},
        quote_price : { type : String},
        quote_price_for_child_service : { type : Number} // 1 = vendor set quote price, 0 = default
    }],
    total_amount : { type : String},
    note : { type : String},
    quote_accept : { type : Number , default : 0},
    status : { type : Number , default : 0},
    sent_quote_accept : {type : Number}, //1=accept/decline,2=accept,3=decline
    created_at : { type : Date, default : Date.now()}
})

module.exports = mongoose.model('SentQuoteRequest',sentQuoteSchema);