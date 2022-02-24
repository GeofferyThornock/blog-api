const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    title: String,
    content: String,
    date: Date,
    view: String,
})

messageSchema
.virtual('url')
.get(() => {
    return '/blog/' + this._id;
});

module.exports = mongoose.model('Blog', messageSchema);