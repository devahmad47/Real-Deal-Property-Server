let mongoose = require('mongoose');

const shortcutsSchema = new mongoose.Schema({
    groupID: String,
    // groupName: String,
    // groupDescription: String,
    // groupThumbnilURL: String,
});
const RequestSchema = new mongoose.Schema({

    name: String,
    profileImageUrl: String,
    primaryMarket: String,
    NotifcationMessage: String,
    userId: String,
    isFriend: {
        type: Boolean,
        default: false,
    }
});
// const SaveSchema = new mongoose.Schema({
//     PostId: String,
//     isDiscussionPost: {
//         type: Boolean,
//         default: false
//     }
// });
// const notificationSchema = new mongoose.Schema({
//     MessageHeading: String,
//     MessageContent: String,
//     messageTime: String,
// });

// const SavedpostSchema = new mongoose.Schema({

//     postDescription: {
//         type: String,
//         required: true,
//     },
//     CreatorID: {
//         type: String,
//         required: true,
//     },
//     postDealType: {
//         type: String,
//         required: true,
//     },
//     mediaTypes: [String],
//     mediaUrls: [String],
//     Price: String,
//     postId: String,
//     location: {
//         type: String,
//         required: true,
//     },
//     postedBy: {
//         type: String,
//         required: true,
//     },
//     userProfileImageSrc: String,


// });
let userSchema = mongoose.Schema({

    username: {
        type: String,
        trim : true

    },
    lastLogin: {
        type: Date,

    },
    createdAt: {
        type: Date,
    },
    email: {
        type: String,
        trim : true
    },
    mobileNumber: {
        type: String,
        trim : true
    },
    password: {
        type: String,
        trim : true

    },
    DOB: {
        type: String,
        trim : true
    },

    primaryMarket: {
        type: String,
        trim : true
    },
    status: {
        type: Boolean,
        default: true
    },
    profileImageUrl: {
        type: String,
        trim : true
    },
    awsBucketImagetKey:  { type: String, trim: true },

    isemailverified: {
        type: Boolean,
        default: false
    },

    // isverified: {
    //     type: Boolean,
    //     default: false
    // },
    sessionExpiration: {
        type: String,
        trim : true
    },
    jwttoken: {
        type: String,
        trim : true
    },
    verificationToken: {
        type: String,
        trim : true
    },
    expirationTokenTime: {
        type: Date,
    },
    shortcuts: [shortcutsSchema],
    Savedposts: [
        {
            postId: { type: String, trim: true },
            isDiscussionPost: {
                type: Boolean,
                default: false
            }
        },
    ],
    Notification: [
        {
            MessageHeading: { type: String, trim: true },
            MessageContent: { type: String, trim: true },
            messageTime: { type: String, trim: true },
        },
    ],
    // RequestedUsers: [RequestSchema],
    YourConnections: [
        {
            userId: { type: String, trim: true },
            isFriend: {
                type: Boolean,
                default: false,
            }
        },
    ],

}, { timestamps: true });

// ,{ timestaps: true }
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.pre("save", async function (next) {
//     if (!this.isModified) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

module.exports = mongoose.model('User', userSchema);




