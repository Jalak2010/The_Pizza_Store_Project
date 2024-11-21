const mongoose = require("mongoose");

const Schema = mongoose.Schema;



const userSchema = new Schema({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true,
        unique : true
    },
    password: {
        type : String,
        required : true
    },
    role: {                               //customer che k admin a batave.
        type: String,
        default: 'customer'
    }
}, {timestamps: true});



module.exports = mongoose.model('User', userSchema);


