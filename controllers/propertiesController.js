const property = require('../model/property');
const Property = require('../model/property');
const User = require('../model/User');

const addProperty = async (req, res) => {
  const { name, description, location, contactInfo, numberOfBedrooms, numberOfBaths, images } = req.body;
  const createdBy = [req.userId]; // get the user id from the decoded JWT
  const property = new Property({ name, description, location, contactInfo, numberOfBedrooms, numberOfBaths, images, created_by: createdBy });
  try {
    await property.save();
    res.status(201).json({ message: 'Property created successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create property', error });
  }
console.log(property);
};


const deleteProperty = async (req, res) => {
  if (!req?.body?.id) return res.status(400).json({ "message": 'Property ID required' });
  const userId = req.userId;
  const userRole = req.roles;

    const property = await Property.findOne({ _id: req.body.id }).exec();
    console.log(userId, userRole, property);
    if (!property) {
      return res.status(404).send({ message: 'Property not found' });
    }

    if (userRole !== 2 && String(property.created_by) !== userId) {
      return res.status(403).send({ message: 'You are not authorized to delete this property' });
    }

    await Property.findByIdAndRemove({ _id: req.body.id });
    return res.status(204).send();
  };

const updateProperty = async (req, res) => {
  const userRole = req.roles;
  const userId = req.userId;
  console.log('user role and user id:', userRole, userId);
  try {
    const property = await Property.findById({_id: req.body.id });
    if (!property) return res.status(404).send('Property not found');

    // Check if user is authorized to update property
    if (userRole !== 2 && userId !== String(property.created_by)) {
      return res.status(403).send('Unauthorized');
    }

    // Update property fields
    property.name = req.body.name;
    property.description = req.body.description;
    property.location = req.body.location;
    property.contactInfo = req.body.contactInfo;
    property.numberOfBedrooms = req.body.numberOfBedrooms;
    property.numberOfBaths = req.body.numberOfBaths;
    property.images = req.body.images;

    // Save updated property to database
    const updatedProperty = await property.save();
    res.send(updatedProperty);
    console.log(updatedProperty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


module.exports = {
  addProperty,
  deleteProperty,
  updateProperty
}