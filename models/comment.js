var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({

    _id: Schema.Types.ObjectId,

    commentText: {
        type: String,
        required: true
    },
    commentedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ofPost: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },
    reply: {
        type: [{
            replyText: {
                type: String,
                required: true
            },
            repliedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            dateCreated: {
                type: Date,
                default: Date.now,
                required: true
            },
        }],

        default: []
    },
    tags: {
        type: [{
            type: String,
        }],
        default: []
    },

    /*
    image: {
        type: String,
        required: true,
        default: ""
    },

    */

});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

