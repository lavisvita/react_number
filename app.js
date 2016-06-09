'use strict';

require('babel-register')({});

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    User = require('./models/Users'),
    port = 4000,

    pictureAction = require('./routes/pictureAction'),
    accountAction = require('./routes/accountAction'),

    busboy = require('connect-busboy'),
    inspect = require('util').inspect,
    Picture = require('./models/Picture'),
    cookieParser = require('cookie-parser'),
    fs = require('fs-extra'),
    path = require('path');
var mongoose = require('mongoose');

app.use(busboy());
app.use(cookieParser());

// ---------------------------------------------- uploading pictures start
app.post('/addpicture', function (req, res, next) {
    var pictureAuthor = req.cookies.userName,
        fstream,
        titleName = '',
        authorId = '';
    /*
        *
        *   getting user id to unify picture
        *
    */
    User.findOne({ name: pictureAuthor }).populate('_id').exec(function (err, user) {
            if (err) return handleError(err);

        req.pipe(req.busboy);

        req.busboy.on('field', function(fieldname, val) {
            titleName = inspect(val);
        });

        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
            var picture = new Picture({
                title: titleName,
                picName: filename,
                authorId: user._id,
                postedBy: pictureAuthor
            });
            picture.save(function(err){
                if(err) throw err;
            });

            //Path where image will be uploaded
            fstream = fs.createWriteStream(__dirname + '/public/img/' + filename);

            file.pipe(fstream);

            fstream.on('close', function () {
                console.log("Upload Finished of " + filename);
                res.redirect('back');
            });
        });
    });
});
// ---------------------------------------------- uploading pictures end
mongoose.connect('mongodb://localhost/jsStudying');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true, defer: true}));
app.use(bodyParser.json());
app.use('/public', express.static(__dirname + '/public'));
//app.use('/views', express.static(path.join(__dirname + 'views')));
app.use('/', pictureAction);
//app.use('/', accountAction);

app.listen(port, function(){
    console.log('listening on port: ' + port);
});

