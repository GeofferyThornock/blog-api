const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    name: {type: String, required: true},
    content: {type: String, required: true},
    date: {type: Date},
    postId: {type: String},
})

commentSchema
.virtual('url')
.get(() => {
    return '/blog/:blogId/comments/' + this._id;
});

module.exports = mongoose.model('Comment', commentSchema);