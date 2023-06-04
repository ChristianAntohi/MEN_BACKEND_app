const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true 
    },
    roles: {
        type: Number,
        default : 0
    }, 
    password: {
        type: String,
        required: true
    },
    refreshToken: [String]
});
 module.exports =  mongoose.model('User', userSchema);
 