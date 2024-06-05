
const multer = require('multer');
const multerS3 = require("multer-s3");
const bucketName = process.env.bucket_Name
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: process.env.Region,
    credentials: {
        accessKeyId: process.env.access_Key_Id,
        secretAccessKey: process.env.secret_Access_Key,
    },
});
const upload = (folderName) => multer({
    storage: multerS3({
        s3: s3Client,
        bucket: bucketName,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: async (req, file, cb) => {
            try {
                const currentDate = new Date().toISOString().replace(/:/g, "-");
                const currentTimeInSeconds = Math.floor(Date.now() / 1000);
                const { email, CreatorID } = req.body
                const { groupID } = req.params

                let objectKey = `${folderName}/${currentDate}-${currentTimeInSeconds}-${file.originalname}`
                if (email) {
                    objectKey = `${folderName}/${email}/${currentDate}-${currentTimeInSeconds}-${file.originalname}`;
                } else if (CreatorID) {
                    objectKey = `${folderName}/${CreatorID}/${currentDate}-${currentTimeInSeconds}-${file.originalname}`;
                } else if (groupID) {
                    objectKey = `${folderName}/${groupID}/${currentDate}-${currentTimeInSeconds}-${file.originalname}`;
                }

                // await uploadObject(objectKey, file); // Upload directly, removing callback

                cb(null, objectKey);
            } catch (error) {
                console.error("Error generating object key:", error);
                cb(error); // Pass the error to Multer
            }
        },
    }),
});
async function uploadObject(objectKey, file) {
    try {

        const uploadParams = {
            Bucket: bucketName,
            Key: objectKey,
            Body: file.stream,
            ContentType: file.mimetype,
        }

        const data = await s3Client.send(new PutObjectCommand(uploadParams));
        console.log("File uploaded successfully:", data.Location);

    } catch (err) {
        console.error("Error uploading file:", err);
        throw err; // Re-throw the error for handling
    }
}



const NmediaDeleteS3 = async (awsBucketKeys) => {
    for (const awsBucketKey of awsBucketKeys) {
        const params = {
            Bucket: bucketName, // Replace with your bucket name
            Key: awsBucketKey,
        };

        try {
            const deleteCommand = new DeleteObjectCommand(params);
            const deleteResult = await s3Client.send(deleteCommand);
            console.log(`File deleted successfully: ${awsBucketKey}`);
        } catch (err) {
            console.error(`Error deleting file: ${awsBucketKey}`, err);
            throw err; // Re-throw the error for handling
        }
    }
}

const mediaDeleteS3 = async function (filename) {
    const params = {
        Bucket: bucketName,
        Key: filename,
    };

    try {
        const deleteCommand = new DeleteObjectCommand(params);
        const deleteResult = await s3Client.send(deleteCommand);
        console.log(`File deleted successfully: ${filename}`);
    } catch (err) {
        console.error(`Error deleting file  ${filename}`, err);
        throw err; // Re-throw the error for handling
    }
};


module.exports = { upload, mediaDeleteS3 , NmediaDeleteS3 };










/////////////////////////////


// const multer = require('multer');
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// // ... other imports

// const s3Client = new S3Client({
//     region: process.env.Region,
//     credentials: {
//         accessKeyId: process.env.access_Key_Id,
//         secretAccessKey: process.env.secretAccessKey,
//     },
// });

// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
// });

// const uploadMiddleware = async (req, res, next) => {
//     try {
//         const { userId } = req.params;
//         const { dealerName, carMake, carModel, year, trim, dealDescription } = req.body;
//         const files = req.files;

//         if (!userId) {
//             return res.status(400).json({ message: "Invalid UserId" });
//         }
//         if (!files || files.length !== 3) {
//             return res.status(400).json({ message: 'Profile Pictures are invalid' });
//         }

//         const user = await User.findOne({ _id: userId });
//         if (!user) {
//             return res
//                 .status(404)
//                 .json({ message: "Bad Request, user invalid data" });
//         }

//         const mediaUrls = [];
//         const bucketKeys = [];
//         const filesmediatypes = [];

//         for (const file of files) {
//             const objectKey = generateUniqueKey(req); // Use a secure key generation function
//             const uploadParams = {
//                 Bucket: bucketName,
//                 Key: objectKey,
//                 Body: file.buffer, // Access the buffer directly
//                 ContentType: file.mimetype,
//             };

//             const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams));
//             mediaUrls.push(uploadResult.Location);
//             bucketKeys.push(objectKey);
//             filesmediatypes.push(file.mimetype);
//         }

//         req.uploadedMedia = {
//             mediaUrls,
//             bucketKeys,
//             filesmediatypes,
//         };

//         next();
//     } catch (error) {
//         console.error("Error uploading deal:", error);
//         res.status(500).json({ message: "Failed to upload Deal", error: error.message });
//     }
// };

// module.exports = { upload, uploadMiddleware };
