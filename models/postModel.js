const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
    ReactorId: { type: String, trim: true },
    ReactionAdded: { type: String, trim: true },
    ReactionUserName: { type: String, trim: true },

});
const postSchema = new mongoose.Schema({
    isReporeted: {
        type: Boolean,
        default: false,
    },
    reportedCounts: {
        type: Number,
        default  : 0
    },
    reportedUsersId: {
        type: Array,
    },
    current: {
        type: Boolean,
        default: false,
    },
    postDescription: {
       type: String, trim: true 
    },
    CreatorID: {
         type: String, trim: true
    },
    postDealType: {
       type: String, trim: true
    },
    Price: Number,
    mediaTypes: [String],
    mediaUrls: [String],
    awsBucketPostKeys: [String],
    location: {
        type: String, trim: true
    },
    postedBy: {
         type: String, trim: true ,
        required: true,
    },
    userProfileImageSrc: { type: String, trim: true },
    postCreated: {
        type: Date,

    },
    postReactions: [ReactionSchema],

    postShare: {
        type: Number,
        default: 0
    },
    SavedUser: [{
        UserId: { type: String, trim: true }
    }],
    comments: [
        {
            commentPostedBy: { type: String, trim: true },
            commentCreated: { type: String, trim: true },
            UserComment: { type: String, trim: true },
            userProfilePicture: { type: String, trim: true },
            postId: { type: String, trim: true },
            userId: { type: String, trim: true },
        }
    ],

    DwellingStyle: { type: String, trim: true },
    city: { type: String, trim: true },
    zipCode: Number,
    YearBuilt: Number,
    state: { type: String, trim: true },
    NoOfBedromoms: Number,
    NoOfBathrooms: Number,
    NoOfInteriorLevel: Number,
    yearOfBuilt: Number,
    Approx_SQFT: Number,
    HAO_Feature: { type: String, trim: true },
    Monthly_PMT: Number,
    Garage_Spaces: Number,
    Pool: { type: String, trim: true },
    Basement: { type: String, trim: true },
    Repair_Needs: { type: String, trim: true },
    Loan_Type: { type: String, trim: true },
    close_of_Escrow: { type: String, trim: true },
    other_Terms: { type: String, trim: true },
    Estimated_Rents: Number,
    Sale_Type: { type: String, trim: true },
    Payment_PITI: Number,
    Interest_Rate: Number,
    Mortgage_Balance: Number,
    Loan_Term: Number,
    Loan_Balance: Number,
    Est_Repairs: Number,
    ARV: Number,
    Down_Payment: Number,
    Est_Closing_Costs_Buy: Number,
    Est_Closing_Costs_Sell: Number,
    Est_Profit: Number,


}, { timestamps: true });


const Post = mongoose.model('Post', postSchema);
module.exports = Post;
