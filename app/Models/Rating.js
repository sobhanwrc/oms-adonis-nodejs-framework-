const mongoose = use ('mongoose');

const Schema = mongoose.Schema;

var Rating = new Schema ({
    vendor_id: { type: Schema.Types.ObjectId, ref: 'User' },
    rating_by_user: [
        {
            user_id : {type: Schema.Types.ObjectId, ref: 'User'},
            number_of_rating : {type : Number},
            comment : { type : String},
            job_id : {type: Schema.Types.ObjectId, ref: 'Job'}
        }
    ]
});

module.exports = mongoose.model('Rating',Rating);