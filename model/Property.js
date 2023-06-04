const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  contactInfo: {
    type: String,
    required: true
  },
  
  price:{
      type: String,
      required: true
    },
  images:
    {
      filename: { type: String },
      path: { type: String }
    },
  created_by: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Property', propertySchema);
