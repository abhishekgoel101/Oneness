var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var communitySchema = new Schema({

    _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rule: {
        type: String,
        enum: ['Direct', 'Permission'],
        default: 'Direct',
        required: true
    },
    status: {
        type: String,
        enum: ['Activated', 'Deactivated'],
        default: 'Activated',
        required: true
    },
    image: {
        type: String,
        required: true,
        default: ""
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },
    location: {
        type: String,
        default: 'Not Added',
        required: true
    },
    admins: {                    //these are only admins array.Owner not here
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    members: {        //Here those member which are neither owner nor admin. 
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },

    requests: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },
    invitedUsers: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        default: []
    },

    /*

    // discussions part-a post array having having posted by,date,tags,
    // description,featured yes or no,global(publish)yes or no,
    // each post element having comments array which further has 
    // a reply array 

    */

});

var Community = mongoose.model('Community', communitySchema);

module.exports = Community;

