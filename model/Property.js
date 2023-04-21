const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  guests: { type: Number, required: true },
  price: { type: Number, required: true },
  parking: { type: Boolean, default: false },
  wifi: { type: Boolean, default: false },
  breakfast: { type: Boolean, default: false },
  images: [{ type: String }]
});

module.exports = mongoose.model('Property', propertySchema);