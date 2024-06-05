let mongoose = require('mongoose');


let adsSchema = mongoose.Schema({
    adsImageUrl: {
        type: String,
        trim : true
    },
    adsDiscription: {
        type: String,
        trim : true
    },
    adsRating: {
        type: Number,
    },
    adsImagAwsBucketKey: {
        type: String,
        trim : true
    },
    adsImageType: {
        type: String,
        trim : true
    },

}, { timestamps: true });


module.exports = mongoose.model('ADs', adsSchema);




