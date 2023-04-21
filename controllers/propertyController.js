const Property = require('../models/Property');

const addProperty = async (req, res) => {
  try {
    const property = new Property({
      name: req.body.name,
      address: req.body.address,
      description: req.body.description,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      guests: req.body.guests,
      price: req.body.price,
      parkingLot: req.body.parkingLot || false,
      wiFi: req.body.wiFi || false,
      breakfast: req.body.breakfast || false,
      images: req.files.map(file => file.filename)
    });

    await property.save();

    res.status(201).json({ message: 'Proprietate încărcată cu succes!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare de server!' });
  }
};

module.exports = {
  addProperty
};