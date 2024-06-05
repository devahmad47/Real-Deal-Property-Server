const asyncHandler = require("express-async-handler");
const ADs = require("../models/adsModel")
// const { s3 } = require("../utils/aws")
const { mediaDeleteS3 } = require("../utils/aws-v3")
const util = require('util');
const bucketName = process.env.bucket_Name


const postAds = asyncHandler(async (req, res) => {
    try {
        const { adsDiscription, adsRating } = req.body;
        const file = req.file;
        // console.log("file");
        // console.log(file);

        if (!file) {
            return res.status(500).json({ message: 'Failed to upload Post Media' });
        }

        const ad = new ADs({ adsDiscription, adsRating, adsImageType: file.mimetype, adsImagAwsBucketKey: file.key, adsImageUrl: file.location });
        await ad.save();
        res.status(200).json({ message: 'Ad Added successfully', ad });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error Uploading Ad' });
    }
});

// get all Ads
const getAllAds = asyncHandler(async (req, res) => {
    try {
        const Ads = await ADs.find();

        if (!Ads && Ads.length == 0) {
            return res.status(500).json({ message: "Unable to Load Posts" })
        }

        res.status(200).json({ message: 'Ads Fetched Successfully', Ads });

    } catch (err) {
        res.status(500).json({ message: 'Error fetching Ads' });
    }
});

const deleteAd = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    console.log(taskId);

    try {
        const DeletedAd = await ADs.findOne({ _id: taskId });

        if (!DeletedAd) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await mediaDeleteS3(DeletedAd.adsImagAwsBucketKey)
        // const s3Params = {
        //     Bucket: bucketName,
        //     Key: DeletedAd.adsImagAwsBucketKey,
        // };

        // s3.deleteObject(s3Params, async (err, data) => {
        //     if (err) {
        //         console.error('Error deleting object from S3:', err);
        //         return res.status(500).json({ message: 'Unable to delete the Ads , try Again Later ' });
        //     } else {
        //         console.log('Object deleted from S3:', data);
        //         await ADs.deleteOne({ _id: id });
        //         return res.status(200).json({ message: 'Ad deleted' });

        //     }
        // });

        await ADs.deleteOne({ _id: taskId });

        res.status(200).json({ message: 'Post deleted successfully', DeletedAd });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete post' });
    }
});


module.exports = {
    getAllAds,
    deleteAd,
    postAds
};


// app.delete('/api/posts/:postID/delete_post', async (req, res) => {
//   const postID = req.params.postID;
//   console.log(postID);
//   try {
//     const DeletedPost = await Post.findOne({ _id: postID });

//     if (!DeletedPost) {
//       return res.status(404).json({ message: 'Post not found' });
//     }




//     const deletePromises = DeletedPost.awsBucketPostKeys.map(async (awsBucketKey) => {
//       const s3Params = {
//         Bucket: bucketName,
//         Key: awsBucketKey,
//       };
//       console.log(awsBucketKey)
//       // Promisify the S3 deleteObject function
//       const deleteObjectAsync = util.promisify(s3.deleteObject.bind(s3));

//       // Delete object from S3
//       await deleteObjectAsync(s3Params);
//     });

//     // Wait for all delete promises to complete
//     await Promise.all(deletePromises);


//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to delete post' });
//   }
// });

// add post Likes
