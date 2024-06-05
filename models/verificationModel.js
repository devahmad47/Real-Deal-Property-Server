const mongoose = require('mongoose');

// Define the Verification schema
const verificationSchema = new mongoose.Schema({
  useremail: {
    type: String,
    required: true,
    trim : true
   
  },
  verificationCode: {
    type: String,
    trim : true,
    required: true,
  },
  expirationTime: {
    type: Date,
    required: true,
    trim : true
  },
});

// Create the Verification model
const VerificationModel = mongoose.model('Verification', verificationSchema);

module.exports = VerificationModel;
