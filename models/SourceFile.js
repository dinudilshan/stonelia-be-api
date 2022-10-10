const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sourceFileSchema = new Schema({
    name: {
        type: String,
        required: true

    },
    source_link: {
        type: String,
        required: true

    },
    category: {
        type: String,
        // required: true

    },
    location: {
        type: String,
        // required: true

    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SourceFile', sourceFileSchema);