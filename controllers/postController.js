const asyncHandler = require("express-async-handler")
const User = require("../models/alllUsersModel")
const Post = require("../models/postModel")
const { mediaDeleteS3 } = require("../utils/aws-v3")
const util = require('util')
const bucketName = process.env.bucket_Name


const createPost = asyncHandler(async (req, res) => {
    try {
        const newPostData = req.body // The request body should contain the data for the new post
        // console.log(req.body)
        const files = req.files
        // console.log("asasas")
        // console.log(files)

        if (!files || files.length === 0) {
            return res.status(500).json({ message: 'Failed to upload Post Media' })
        }
        const mediaUrls = await Promise.all(files.map(async (file) => {
            return file.location
        }))



        newPostData.mediaUrls = mediaUrls
        newPostData.postCreated = new Date()
        newPostData.mediaTypes = files.map(file => file.mimetype)
        newPostData.awsBucketPostKeys = files.map(file => file.key)

        // console.log(newPostData)

        const post = new Post(newPostData)
        await post.save()
        res.status(200).json({ message: 'Post created successfully', post })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Error creating post' })
    }
})
const editPost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params
        const { DwellingStyle,
            city,
            zipCode,
            YearBuilt,
            state,
            NoOfBedromoms,
            NoOfBathrooms,
            NoOfInteriorLevel,
            yearOfBuilt,
            Approx_SQFT,
            HAO_Feature,
            Monthly_PMT,
            Garage_Spaces,
            Pool,
            Basement,
            Repair_Needs,
            Loan_Type,
            close_of_Escrow,
            other_Terms,
            Estimated_Rents,
            Sale_Type,
            Payment_PITI,
            Interest_Rate,
            Mortgage_Balance,
            Loan_Term,
            Loan_Balance,
            Est_Repairs,
            ARV,
            Down_Payment,
            Est_Closing_Costs_Buy,
            Est_Closing_Costs_Sell,
            location,
            postDealType,
            postDescription,
            Est_Profit, Price } = req.body // The request body should contain the updated data for the post

        // Find the post by ID
        const post = await Post.findById(postId)

        if (!post) {
            return res.status(404).json({ message: 'Post not found' })
        }
        console.log("before")
        // console.log(post)
        console.log(Price)
        console.log(postDescription)
        console.log(NoOfBedromoms)
        // Update the post data
        if (postDescription) {
            console.log(postDescription)
            console.log("postDescription")

            post.postDescription = postDescription
        }

        if (Price) {
            console.log(Price)
            console.log("Price")

            post.Price = Price
        }

        if (postDealType) {
            post.postDealType = postDealType
        }
        if (location) {
            post.location = location
        }
        if (city) {
            post.city = city
        }
        if (zipCode) {
            post.zipCode = zipCode
        }
        if (YearBuilt) {
            post.YearBuilt = YearBuilt
        }
        if (state) {
            post.state = state
        }
        if (NoOfBedromoms) {
            post.NoOfBedromoms = NoOfBedromoms
        }
        if (NoOfBathrooms) {
            post.NoOfBathrooms = NoOfBathrooms
        }
        if (Approx_SQFT) {
            post.Approx_SQFT = Approx_SQFT
        }
        if (HAO_Feature) {
            post.HAO_Feature = HAO_Feature
        }
        if (Monthly_PMT) {
            post.Monthly_PMT = Monthly_PMT
        }
        if (Garage_Spaces) {
            post.Garage_Spaces = Garage_Spaces
        }
        if (Repair_Needs) {
            post.Repair_Needs = Repair_Needs
        }
        if (Loan_Type) {
            post.Loan_Type = Loan_Type
        }
        if (close_of_Escrow) {
            post.close_of_Escrow = close_of_Escrow
        }
        if (other_Terms) {
            post.other_Terms = other_Terms
        }
        if (Interest_Rate) {
            post.Interest_Rate = Interest_Rate
        }
        if (Sale_Type) {
            post.Sale_Type = Sale_Type
        }
        if (Payment_PITI) {
            post.Payment_PITI = Payment_PITI
        }
        if (Mortgage_Balance) {
            post.Mortgage_Balance = Mortgage_Balance
        }
        if (ARV) {
            post.ARV = ARV
        }
        if (Pool) {
            post.Pool = Pool
        }
        if (Basement) {
            post.Basement = Basement
        }
        if (Loan_Term) {
            post.Loan_Term = Loan_Term
        }
        if (Loan_Balance) {
            post.Loan_Balance = Loan_Balance
        }
        if (Est_Repairs) {
            post.Est_Repairs = Est_Repairs
        }
        if (Down_Payment) {
            post.Down_Payment = Down_Payment
        }
        if (Est_Closing_Costs_Buy) {
            post.Est_Closing_Costs_Buy = Est_Closing_Costs_Buy
        }
        if (Est_Closing_Costs_Sell) {
            post.Est_Closing_Costs_Sell = Est_Closing_Costs_Sell
        }
        if (Est_Profit) {
            post.Est_Profit = Est_Profit
        }
        if (Estimated_Rents) {
            post.Estimated_Rents = Estimated_Rents
        }
        if (DwellingStyle) {
            post.DwellingStyle = DwellingStyle
        }
        if (yearOfBuilt) {
            post.yearOfBuilt = yearOfBuilt
        }
        if (NoOfInteriorLevel) {
            post.NoOfInteriorLevel = NoOfInteriorLevel
        }

        // Add other fields you want to update
        console.log("after")
        // console.log(post)
        // Save the updated post document
        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post })
    } catch (error) {
        console.error('Error updating post:', error)
        res.status(500).json({ error: 'Unable to update post', message: error.message })
    }


})

// Route to add a post to Savedposts
const savePost = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params
        const { postId, isDiscussionPost, groupId } = req.body

        console.log(userId)

        const user = await User.findOne({ _id: userId })
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' })
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
        console.log(user.Savedposts)
        const isPostSaved = user.Savedposts.filter((post) => post.postId === postId)
        console.log(isPostSaved)
        if (isPostSaved.length > 0) {
            return res.status(400).json({ message: 'Post is already saved' })
        }
        if (isDiscussionPost) {

            user.Savedposts.push({ postId, groupId, isDiscussionPost })
        } else {
            user.Savedposts.push({ postId, isDiscussionPost })
        }
        const newNotification = {
            MessageHeading: 'Post',
            MessageContent: 'Post Saved Successfully',
            messageTime: `${new Date()}`,
        }
        user.Notification.unshift(newNotification)
        await user.save()

        res.status(200).json({ message: 'Post added to Savedposts', user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error adding post to Savedposts' })
    }
})

// Route to remove a post from Savedposts
const removeSavePost = asyncHandler(async (req, res) => {
    try {
        const { userId, postId } = req.params

        const user = await User.findOne({ _id: userId })
        if (!user.status) {
            return res.status(401).json({ message: 'User is Suspended' })
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        console.log(postId)
        console.log(user.Savedposts)

        const postIndex = user.Savedposts.findIndex((post) => post.postId === postId)

        if (postIndex === -1) {
            return res.status(400).json({ message: 'Post not found in Savedposts' })
        }

        user.Savedposts.splice(postIndex, 1)
        const newNotification = {
            MessageHeading: 'Post',
            MessageContent: 'Post removed from saved',
            messageTime: `${new Date()}`,
        }
        user.Notification.unshift(newNotification)
        await user.save()

        res.status(200).json({ message: 'Post removed from Savedposts', user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Error removing post from Savedposts' })
    }
})

// get all posts
const getPost = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find().sort({ _id: -1 })



        if (!posts && posts.length === 0) {
            return res.status(500).json({ message: "Unable to Load Posts" })
        }
        res.status(200).json({ message: 'Post Fetched Successfully', posts })

    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts' })
    }
})

const deletePost = asyncHandler(async (req, res) => {
    const postID = req.params.postID
    console.log(postID)

    try {
        const DeletedPost = await Post.findOne({ _id: postID })

        if (!DeletedPost) {
            return res.status(404).json({ message: 'Post not found' })
        }

        // Create an array of promises for deleting each object from S3
        // use mediaDeleteS3 when you have to use this code not  mediaDeleteS3Multiple
        // console.log(DeletedPost.awsBucketPostKeys)
        const deletePromises = DeletedPost.awsBucketPostKeys.map(async (awsBucketKey) => {
            await mediaDeleteS3(awsBucketKey);
        });

        await Promise.all(deletePromises);
        // await NmediaDeleteS3(DeletedPost.awsBucketPostKeys);

        // const deletePromises = DeletedPost.awsBucketPostKeys.map((awsBucketKey) => {
        //     const s3Params = {
        //         Bucket: bucketName,
        //         Key: awsBucketKey,
        //     }
        //     console.log(awsBucketKey)
        //     // Promisify the S3 deleteObject function
        //     const deleteObjectAsync = util.promisify(s3.deleteObject.bind(s3))
        //     // Return the promise for this deletion
        //     return deleteObjectAsync(s3Params)
        // })
        // // Wait for all delete promises to complete in parallel
        // await Promise.all(deletePromises)

        // Delete the post from MongoDB
        await Post.deleteOne({ _id: postID })

        res.status(200).json({ message: 'Post deleted successfully', DeletedPost })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to delete post' })
    }
})

const reactionPost = asyncHandler(async (req, res) => {
    try {
        const { postID } = req.params
        const { reaction, userReaction } = req.body
        const post = await Post.findOne({ _id: postID })
        if (!post) {
            return res.status(400).json({ message: 'No post found' })
        }
        if (reaction) {
            post.postReactions.push(userReaction)
        } else {
            if (post.postReactions && post.postReactions.length > 0) {
                post.postReactions = post.postReactions.filter(rec => rec.ReactorId !== userReaction.ReactorId)
            }
        }
        await post.save()
        res.json({ message: 'Like added successfully', post })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Unable to Add Like' })
    }
})

// add post Comment
const commentPost = asyncHandler(async (req, res) => {
    try {
        const { postID } = req.params
        const { newComment } = req.body
        const post = await Post.findOne({ _id: postID })
        if (!post) {
            return res.status(400).json({ message: 'No post found' })
        }
        post.comments.unshift(newComment)

        await post.save()
        res.json({ message: 'Comment added successfully' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Unable to Add comment' })
    }
})


// filtered_Post posts
const filtered_Post = asyncHandler(async (req, res) => {

    try {
        const { filterTypes, invesmentTypes, price, builtYear } = req.body;
        // console.log(req.body)
        const query = {
            $and: [], // Start with an empty array for filters
        };

        // Build filters for investment types, price, and built year
        if (invesmentTypes) {
            // console.log("invest")
            query.$and.push({ postDealType: invesmentTypes });
        }
        if (price) {
            // console.log("price")
            query.$and.push({ Price: { $lte: price } });
        }
        if (builtYear) {
            // console.log("year")
            query.$and.push({ YearBuilt: builtYear });
        }

        // Define sorting logic using a map for readability
        const sortMap = {
            "Newest Listing": { _id: -1 },
            "Oldest Listing": { _id: 1 },
            "Low to High": { Price: 1 },
            "High to Low": { Price: -1 },
            "Newest": { YearBuilt: -1 },
            "Oldest": { YearBuilt: 1 },
            _default: { _id: 1 }, // Default sorting
        };

        const sort = sortMap[filterTypes] || sortMap._default;

        // Fetch posts with conditional sorting
        // console.log(query)
        const posts = query.$and.length > 0
            ? await Post.find(query).sort(sort)
            : await Post.find().sort(sort);

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: "Deals Not Found" }); // Use appropriate status code
        }

        res.status(200).json({ message: "Filtered Posts Fetched", posts });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ message: "Error fetching deals", error: err.message });
    }


});


// const filtered_Post = asyncHandler(async (req, res) => {
//     try {
//         const { FilterTypes, invesmentTypes, price, builtYear } = req.body;
//         let sortQuery = {};
//         // console.log(req.body)
//         // Define the sorting logic based on the FilterTypes
//         switch (FilterTypes) {
//             case "Newest Listing":
//                 sortQuery._id = -1; // Sorting by newest to oldest
//                 break;
//             case "Oldest Listing":
//                 sortQuery._id = 1; // Sorting by oldest to newest
//                 break;
//             case "Low to High":
//                 sortQuery.Price = 1; // Sorting by low to high price
//                 break;
//             case "High to Low":
//                 sortQuery.Price = -1; // Sorting by high to low price
//                 break;
//             case "Newest":
//                 sortQuery.YearBuilt = -1; // Sorting by newest to oldest built year
//                 break;
//             case "Oldest":
//                 sortQuery.YearBuilt = 1; // Sorting by oldest to newest built year
//                 break;
//             default:
//                 break;
//         }
//         if (!FilterTypes) {
//             sortQuery._id = 1;
//         }
//         const additionalFilters = {};

//         if (invesmentTypes) {
//             additionalFilters.postDealType = invesmentTypes;
//         }

//         if (price) {
//             additionalFilters.Price = { $lte: price };
//         }

//         if (builtYear) {
//             additionalFilters.YearBuilt = builtYear;
//         }



//         const posts = additionalFilters ? await Post.find(additionalFilters).sort(sortQuery) : await Post.find().sort(sortQuery)

//         // console.log(posts)
//         if (!posts || posts.length === 0) {
//             return res.status(500).json({ message: "Deal Not Found " });
//         }

//         res.status(200).json({ message: 'Filtered Posts Fetched ', posts });

//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching Deal', error: err.message });
//     }
// });

// const filtered_Post = asyncHandler(async (req, res) => {
//     try {
//         const { filterQuery } = req.body
//         let sortQuery = {}

//         // Define the sorting logic based on the filterQuery
//         switch (filterQuery) {
//             case "Newest Listing":
//                 sortQuery = { postCreated: 1 } // Sorting by newest to oldest
//                 break
//             case "Oldest Listing":
//                 sortQuery = { postCreated: -1 } // Sorting by oldest to newest
//                 break
//             case "Low to High":
//                 sortQuery = { Price: 1 } // Sorting by low to high price
//                 break
//             case "High to Low":
//                 sortQuery = { Price: -1 } // Sorting by high to low price
//                 break
//             case "Newest":
//                 sortQuery = { YearBuilt: -1 } // Sorting by newest to oldest built year
//                 break
//             case "Oldest":
//                 sortQuery = { YearBuilt: 1 } // Sorting by oldest to newest built year
//                 break
//             default:
//                 break
//         }

//         const posts = await Post.find().sort(sortQuery)

//         if (!posts || posts.length === 0) {
//             return res.status(500).json({ message: "Unable to Load Posts" })
//         }

//         res.status(200).json({ message: 'Posts Fetched Successfully', posts })

//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching posts', error: err.message })
//     }
// })


// reportPost posts
const reportPost = asyncHandler(async (req, res) => {
    try {
        console.log(req.body)
        const { postId } = req.params
        const { userId } = req.body
        const post = await Post.findOne({ _id: postId })

        if (!post) {
            return res.status(400).json({ message: "Post not found, try again later" })
        }
        if (post.reportedUsersId.includes(userId)) {
            return res.status(400).json({ message: "You already reported this post" })
        }
        post.reportedUsersId.push(userId)
        post.isReporeted = true
        post.reportedCounts = ++post.reportedCounts
        await post.save()
        res.status(200).json({ message: 'Posts Reported Successfully', post })

    } catch (err) {
        res.status(500).json({ message: 'Error Report posts', error: err.message })
    }
})

module.exports = {
    createPost,
    savePost,
    removeSavePost,
    getPost,
    deletePost,
    reactionPost,
    commentPost,
    filtered_Post,
    reportPost,
    editPost
}


// app.delete('/api/posts/:postID/delete_post', async (req, res) => {
//   const postID = req.params.postID
//   console.log(postID)
//   try {
//     const DeletedPost = await Post.findOne({ _id: postID })

//     if (!DeletedPost) {
//       return res.status(404).json({ message: 'Post not found' })
//     }




//     const deletePromises = DeletedPost.awsBucketPostKeys.map(async (awsBucketKey) => {
//       const s3Params = {
//         Bucket: bucketName,
//         Key: awsBucketKey,
//       }
//       console.log(awsBucketKey)
//       // Promisify the S3 deleteObject function
//       const deleteObjectAsync = util.promisify(s3.deleteObject.bind(s3))

//       // Delete object from S3
//       await deleteObjectAsync(s3Params)
//     })

//     // Wait for all delete promises to complete
//     await Promise.all(deletePromises)


//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: 'Failed to delete post' })
//   }
// })

// add post Likes
