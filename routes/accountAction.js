var express = require('express'),
    router = express.Router(),
    User = require('../models/Users'),
    Post = require('../models/Post'),
    Picture = require('../models/Picture');

function getCookie(req){
    var login = req.cookies.userName,
        authorized = '';
    if(login != undefined){
        authorized = true;
    }else{
        authorized = false;
    }
    return {
        authorized: authorized,
        login: login
    };
}

router.get('/account', function(req, res){
    var authorizedUser = getCookie(req);
    User.find({name: authorizedUser.login}, function(err, data){
        Picture.find({authorId: data[0]._id}, function(err, data){
            var pictures = data,
                pictureList = [];
            pictures.forEach(function(val, key, pictures){
                pictureList.push({
                    picId:pictures[key]['_id'],
                    picName:pictures[key]['picName']
                });
            });
            res.render('account', {pictures: pictureList, login: authorizedUser.login, authorized: authorizedUser.authorized});
        });
    });
});

module.exports = router;