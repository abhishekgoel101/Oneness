var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Commuity Manager', 'User'],
        default: 'User'
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    },
    activated: {
        type: Boolean,
        default: true,
        required: true
    },
    gender: {
        type: String,
        default: 'Male',
        enum: ['Male', 'Female', 'Transgender'],
        required: true
    },
    dob: {
        type: Date,
        default: Date.now

    },
    phone: {
        type: String,
        default: "9999999999",
        required: true

    },
    city: {
        type: String,
        required: true,
        default: ""
    },
    image: {
        type: String,
        required: true,
        default: ""
    },
    interests: {
        type: [{ type: String }],
        default: []
    },
    journey: {
        type: String,
        default: ""

    },
    expectation: {
        type: String,
        default: ""

    },
    ownerCommunity: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Community'
        }],
        default: []
    },

    myCommunity: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Community'
        }],
        default: []
    },

    requestedCommunity: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Community'
        }],
        default: []
    },
    invitesCommunity: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Community'
        }],
        default: []
    },

    /*
    
    //link with communities also
    //array of communities created,member,requested,

    */


});

var User = mongoose.model('User', userSchema);

module.exports = User;
