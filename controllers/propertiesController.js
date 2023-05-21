const Property = require('../model/property');
const fs = require('fs');
const upload = require('../middleware/upload');

const addProperty = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ message: 'Failed to upload images', error: err });
    }

    const { name, description, location, contactInfo, price} = req.body;
    const createdBy = req.userId; // get the user id from the decoded JWT
    console.log(req.file);
      //get the filenames of the uploaded images
    const images = {
      filename: req.file.filename,
      path: req.file.path.substring('/public'.length)
    };
    console.log(images); //console log the filenames of the uploaded images
    const existingProperty = await Property.findOne({ name, location });
    if (existingProperty) {
      return res.status(400).json({ message: 'A property with the same fields already exists' });
    }
    const property = new Property({ name, description, location, contactInfo, price, images, created_by: createdBy });

    try {
      await property.save();
      console.log(property); // log the property object after it is saved
      res.status(201).json({ message: 'Property created successfully' });
    } catch (error) {
      res.status(400).json({ message: 'Failed to create property', error });
    }
  });
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
    property.price = req.body.price;
    property.contactInfo = req.body.contactInfo;

    // Save updated property to database
    const updatedProperty = await property.save();
    res.send(updatedProperty);
    console.log(updatedProperty);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

};
const getPropertybyUserId = async (req, res) => {
  try { 
    const property = await Property.find({created_by: req.userId});
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ property });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get property', error });
  }
};
const getAllProperties = async (req, res) => {
  try {
    console.log("Fetching properties...");
    const properties = await Property.find();
    console.log("Properties fetched successfully!");
    const result = properties.map(property => {
      return {
        id: property._id,
        name: property.name,
        description: property.description,
        location: property.location,
        contactInfo: property.contactInfo,
        price: property.price,
        images: property.images.path, // Return only the image paths
        created_by: property.created_by
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.log("Error while fetching properties:", error);
    res.status(500).json({ message: 'Failed to get properties', error });
  }
};
const searchProperties = async (req, res) => {
  try {
    const { name, description, minPrice, maxPrice, location } = req.query;
    console.log(name, description, minPrice, maxPrice, location);

    // Build the search criteria
    const searchCriteria = {};

    // Add the name search query parameter
    if (name) {
      searchCriteria.name = { $regex: name, $options: 'i' };
    }

    // Add the description search query parameter
    if (description) {
      searchCriteria.description = { $regex: description, $options: 'i' };
    }

    // Add the price range search query parameters
    if (minPrice !== undefined && maxPrice !== undefined) {
      searchCriteria.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== undefined) {
      searchCriteria.price = { $gte: minPrice };
    } else if (maxPrice !== undefined) {
      searchCriteria.price = { $lte: maxPrice };
    }

    // Add the location search query parameter
    if (location) {
      searchCriteria.location = { $regex: location, $options: 'i' };
    }
    
    // Add the search text query parameter for all fields
    if (searchText) {
      const searchTextRegex = new RegExp(searchText, 'i');
      searchCriteria.$or = [
        { name: searchTextRegex },
        { description: searchTextRegex },
        { location: searchTextRegex }
      ];
    }

    // Perform the search using the constructed criteria
    const properties = await Property.find(searchCriteria);

    if (properties.length === 0) {
      return res.status(404).json({ message: 'No properties found' });
    }

    res.status(200).json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search properties', error });
  }
};
const getPropertybyId = async (req, res) => {
  try { 
    const property = await Property.findById({_id: req.params.id });
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json({ property });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get property', error });
  }
};


module.exports = {
  addProperty,
  deleteProperty,
  updateProperty,
  getPropertybyUserId,
  getAllProperties,
  searchProperties,
  getPropertybyId
}