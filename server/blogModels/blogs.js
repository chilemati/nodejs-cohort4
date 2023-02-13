// require the mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create a mongoose model or templete
const BlogSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    author: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    blogImg_url: {
        type: String,
        require: true
    },
    blogImg_id: {
        type: String,
        require: true
    }
}, { timestamps: true });


const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;