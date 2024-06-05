const mongoose = require('mongoose');

// Comment Schema
const commentSchema = new mongoose.Schema({
    commentPostedBy: { type: String, trim: true },
    commentCreated: { type: String, trim: true },
    UserComment: { type: String, trim: true },
    _id: { type: String, trim: true },
});


const ReactionSchema = new mongoose.Schema({
    ReactorId: { type: String, trim: true },
    ReactionAdded: { type: String, trim: true },
    ReactionUserName: { type: String, trim: true },
   
});

// Post Schema
const postSchema = new mongoose.Schema({

    current: {
        type: Boolean,
        default: false,
    },

    postDescription: {
        type: String,
        trim : true
    },
    CreatorID: {
        type: String,trim : true
    },
    postDealType: {
        type: String,trim : true

    },
    mediaTypes: [String],
    mediaUrls: [String], 
    awsBucketPostKeys: [String], 
    Price: { type: String, trim: true },
    location: {
        type: String, trim : true

    },
    postedBy: {
        type: String,
        trim : true
    },
    userProfileImageSrc: String,
    postCreated: {
        type: String,  trim : true

    },
    postReactions: [ReactionSchema],
    postShare: {
        type: Number,
        default: 0
    },
    comments: [commentSchema],
});

// Media Schema
const mediaSchema = new mongoose.Schema({
    mediaType: { type: String, trim: true },
    mediaTitle: { type: String, trim: true },
    mediaAddedDate: { type: String, trim: true },
    mediaPostedBy: { type: String, trim: true },
    CreatorID : { type: String, trim: true },
    mediaUrl: { type: String, trim: true },
    awsBucketKeyMediaURL: { type: String, trim: true },
});



// Member Schema
const memberSchema = new mongoose.Schema({
    UserName: { type: String, trim: true },
    ProfileImage: { type: String, trim: true },
    description: { type: String, trim: true },
});

// Group Schema
const groupSchema = new mongoose.Schema({
    Pined: {
        type: Boolean,
        default: false,
    },
    current: {
        type: Boolean,
        default: false,
    },
    groupName: {
        type: String,
        required: true,
    },
    groupDescription: {
        type: String,
        required: true,
    },
    mediaType: {
        type: String,

    },
    groupThumbnilURL: String,
    createdBy: {
        type: String,
        required: true,
    },
    CreatorID: {
        type: String,
        required: true,
    },
    createdDate: {
        type: String,
        required: true,
    },
    ABKgroupgroupThumbnil: { type: String, trim: true },
    Members: [memberSchema],
    groupDicussionsPost: [postSchema],
    Media: [mediaSchema],
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
