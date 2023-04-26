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
  numberOfBedrooms: {
    type: Number,
    required: true
  },
  numberOfBaths: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  created_by: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Property', propertySchema);