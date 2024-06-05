const asyncHandler = require("express-async-handler");
const User = require("../models/alllUsersModel")
const Group = require("../models/groupModel")
// const { s3 } = require("../utils/aws")
const {  NmediaDeleteS3} = require("../utils/aws-v3")
const util = require('util');

const groupPostReaction = asyncHandler(async (req, res) => {
    try {
        const { postID, groupID } = req.params;
        const { reaction, userReaction } = req.body;


        const group = await Group.findOne({ _id: groupID });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const postIndex = group.groupDicussionsPost.findIndex(post => post._id == postID);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Discussion post not found' });
        }
        const post = group.groupDicussionsPost[postIndex]
        if (reaction) {
            post.postReactions.push(userReaction)
        } else {
            if (post.postReactions && post.postReactions.length > 0) {
                post.postReactions = post.postReactions.filter(rec => rec.ReactorId !== userReaction.ReactorId)
            }
        }

        await group.save()
        res.json({ message: 'Reaction Updated successfully', group });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to Add Like' });
    }
});

const groupPostComment = asyncHandler(async (req, res) => {
    try {
        const { postID, groupID } = req.params;
        const { newComment } = req.body;

        const group = await Group.findOne({ _id: groupID });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const postIndex = group.groupDicussionsPost.findIndex(post => post._id == postID);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Discussion post not found' });
        }

        group.groupDicussionsPost[postIndex].comments.unshift(newComment)

        await group.save()
        res.json({ message: 'Comment added successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unable to Add comment' });
    }
});

const createGroupPost = asyncHandler(async (req, res) => {
    try {
        const { groupID } = req.params;
        const newPostData = req.body

        const group = await Group.findOne({ _id: groupID });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const files = req.files;
        console.log("asasas");
        console.log(files);

        if (!files || files.length === 0) {
            return res.status(500).json({ message: 'Failed to upload Post Media' });
        }
        const mediaUrls = await Promise.all(files.map(async (file) => {
            return file.location;
        }));

        newPostData.mediaUrls = mediaUrls;
        newPostData.mediaTypes = files.map(file => file.mimetype);
        newPostData.awsBucketPostKeys = files.map(file => file.key);


        group.groupDicussionsPost.push(newPostData)
        await group.save()

        res.status(200).json({ message: 'Post created successfully', group });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating post' });
    }
});

const deleteGroupPost = asyncHandler(async (req, res) => {
    const { groupID, postID } = req.params;
    try {
        const group = await Group.findOne({ _id: groupID });
        const allUsers = await User.find();

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const postIndex = group.groupDicussionsPost.findIndex(post => post._id == postID);

        if (postIndex === -1) {
            return res.status(404).json({ message: 'Discussion post not found' });
        }

        // const deletePromises = group.groupDicussionsPost[postIndex].awsBucketPostKeys.map(async (awsBucketKey) => {
        //     const s3Params = {
        //         Bucket: bucketName,
        //         Key: awsBucketKey,
        //     };
        //     const deleteObjectAsync = util.promisify(s3.deleteObject.bind(s3));
        //     await deleteObjectAsync(s3Params);
        // });

        // await Promise.all(deletePromises);


        await NmediaDeleteS3(group.groupDicussionsPost[postIndex].awsBucketPostKeys)


        // if (User && User.length > 0) {

        //   const updateShortcutsPromises = User.map(async (eachUser) => {
        //     eachUser.Savedposts = eachUser.Savedposts.filter((svd) => svd.postID !== postID);
        //     return eachUser.save();
        //   });

        //   await Promise.all(updateShortcutsPromises);
        // }

        const deletedPost = group.groupDicussionsPost[postIndex];
        group.groupDicussionsPost.splice(postIndex, 1);
        await group.save();

        // const s3Params = {
        //   Bucket: bucketName,
        //   Key: awsBucketPostKey,
        // };

        // s3.deleteObject(s3Params, async (err, data) => {
        //   if (err) {
        //     console.error('Error deleting object from S3:', err);
        //     return res.status(500).json({ message: 'Unable to delete the Group  post, try Again Later ' });
        //   } else {
        //     console.log('Object deleted from S3:', data);


        //   }
        // });
        res.status(200).json({ message: 'Group post deleted successfully', deletedPost });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error deleting discussion post' });
    }
});


module.exports = {
    groupPostReaction,
    groupPostComment,
    createGroupPost,
    deleteGroupPost
};


