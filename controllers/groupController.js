const asyncHandler = require("express-async-handler");
const User = require("../models/alllUsersModel")
const Group = require("../models/groupModel")
const { mediaDeleteS3, NmediaDeleteS3 } = require("../utils/aws-v3")
const util = require('util');




// function flattenArray(nestedArray) {
//     return [].concat(...nestedArray.map((subArray) => flattenArray(subArray) || subArray));
// }

const createGroup = asyncHandler(async (req, res) => {
    try {
        const newGroupData = req.body; // The request body should contain the data for the new post
        console.log(req.body)
        const file = req.file;
        console.log("asasas");
        console.log(file);
        if (!file) {
            return res.status(500).json({ message: 'Failed to upload Group Thumbnil' });
        }
        const imageUrl = await file.location;

        if (!imageUrl) {
            return res.status(500).json({ message: 'Failed to Upload Group Thumbnil' });
        }
        newGroupData.groupThumbnilURL = await imageUrl;
        newGroupData.mediaType = file.mimetype;
        newGroupData.ABKgroupgroupThumbnil = await file.key;

        console.log(newGroupData);

        const Newgroup = new Group(newGroupData);
        await Newgroup.save();
        res.status(200).json({ message: 'Group created successfully', Newgroup });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error creating Group' });
    }
});

const addMedia = asyncHandler(async (req, res) => {
    try {


        const { groupID } = req.params;
        const Newmedia = req.body
        const file = req.file;

        const group = await Group.findOne({ _id: groupID });
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        console.log(file);
        if (!file) {
            return res.status(500).json({ message: 'Failed to upload Post Media' });
        }

        const MediaUrl = await file.location;
        if (!MediaUrl) {
            return res.status(500).json({ message: 'Failed to Upload Post Media' });
        }

        Newmedia.mediaType = file.mimetype
        Newmedia.mediaUrl = MediaUrl
        Newmedia.awsBucketKeyMediaURL = file.key

        group.Media.unshift(Newmedia)
        await group.save()

        res.status(200).json({ message: 'Media added successfully', group });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error adding Media' });
    }
});

const getGroups = asyncHandler(async (req, res) => {
    try {
        const groups = await Group.find();

        if (!groups) {
            return res.status(500).json({ message: "Unable to Load Groups" })
        }

        res.status(200).json({ message: 'Groups Fetched Successfully', groups });

    } catch (err) {
        res.status(500).json({ message: 'Error fetching Groups' });
    }
});

const deleteGroups = asyncHandler(async (req, res) => {
    const groupID = req.params.groupID;
   
    try {
        const DeletedGroup = await Group.findOne({ _id: groupID });
        // const allUsers = await User.find();

        if (!DeletedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // const s3Params = {
        //     Bucket: bucketName,
        //     Key: DeletedGroup.ABKgroupgroupThumbnil,
        // };
        // const deleteObjectAsync = util.promisify(s3.deleteObject.bind(s3));
        // await deleteObjectAsync(s3Params);
        await mediaDeleteS3(DeletedGroup.ABKgroupgroupThumbnil)
        await Group.deleteOne({ _id: groupID });


        // const deletePromises = DeletedGroup.groupDicussionsPost.map(async (eachpost) => {
        //     return Promise.all(eachpost.awsBucketPostKeys.map(async (awsBucketKey) => {
        //         const s3Params = {
        //             Bucket: bucketName,
        //             Key: awsBucketKey,
        //         };
        //         const deleteObjectAsync = util.promisify(s3.deleteObject.bind(s3));
        //         await deleteObjectAsync(s3Params);
        //     }));
        // });

        // await Promise.all(deletePromises);

        // const deletePromises = DeletedGroup.groupDicussionsPost.map(async (eachpost) => {
        //     // Flatten the nested array to get all `awsBucketKey` values
        //     const flatBucketKeys = flattenArray(eachpost.awsBucketPostKeys);

        //     // Call `mediaDeleteS3Multiple` with the flattened array
        //     await mediaDeleteS3Multiple(flatBucketKeys);
        // });

        // await Promise.all(deletePromises);

        const deletePromises = DeletedGroup.groupDicussionsPost.map(async (eachpost) => {
            const bucketKeys = eachpost.awsBucketPostKeys;
            await NmediaDeleteS3(bucketKeys);
        });

        await Promise.all(deletePromises);
        // if (User && User.length > 0) {


        //   const updateShortcutsPromises = User.map(async (eachUser) => {
        //     eachUser.shortcuts = eachUser.shortcuts.filter((shortcut) => shortcut.groupID !== groupID);
        //     return eachUser.save();
        //   });

        //   await Promise.all(updateShortcutsPromises);
        // }


        res.status(200).json({ message: 'Group deleted successfully', DeletedGroup });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete Group' });
    }
});


module.exports = {
    createGroup,
    addMedia,
    getGroups,
    deleteGroups
};
