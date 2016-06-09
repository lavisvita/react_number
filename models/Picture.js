var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PictureSchema = new Schema({
    title: String,
    picName: String,
    authorId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postedBy: String,
    comments: [{
        text: String,
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }

    }]
});

var Picture = mongoose.model('PictureSchema', PictureSchema);
module.exports = Picture;