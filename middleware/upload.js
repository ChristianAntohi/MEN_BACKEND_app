const multer = require('multer');

// Configurarea locației și a numelui fișierelor pentru a salva imaginile
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configurarea filtrului de tip de fișier pentru a accepta doar imagini
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Formatul fișierului nu este acceptat!'), false);
  }
};

// Configurarea middleware-ului Multer pentru a încărca imagini
const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } });

module.exports = upload;