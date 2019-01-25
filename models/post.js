var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({

    _id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ofCommunity: {
        type: Schema.Types.ObjectId,
        ref: 'Community',
        required: true
    },
    featured: {
        type: Boolean,
        default: false,
        required: true
    },
    global: {
        type: Boolean,
        default: false,
        required: true
    },
    deleted: {
        type: Boolean,
        default: false,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now,
        required: true
    },
    commentsCount: {
        type: Number,
        default: 0,
        required: true
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

var Post = mongoose.model('Post', postSchema);

module.exports = Post;

