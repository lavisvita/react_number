//options = {
//    // some air
//};
var express = require('express'),
    router = express.Router(),
    User = require('../models/Users'),
    Post = require('../models/Post'),
    Picture = require('../models/Picture'),
    path = require('path'),
    async = require('async'),
    fs = require('fs');
var crypto = require('crypto');
var algorithm = 'aes256';
var key = 'password';

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

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm, key);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}

function passCrypt(text){
    var cipher = crypto.createCipher(algorithm, key);
    var encrypted = cipher.update(text,'utf8','hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// ------------------------------------ authorized start

router.get('/signin', function(req, res){
    res.render('signin');
});

router.post('/signin', function(req, res){
    var userLogin = req.body.login,
        userPassword = req.body.password;
    if(userLogin != '' && userPassword != '') {
        User.find({name: userLogin}, function (err, data) { // insert user login and password

            if (Object.keys(data).length != 0) {

                var decryptPass = decrypt(data[0].password);
                if ((data[0].name != userLogin) && (userPassword != decryptPass)) {
                    res.render('registration');
                } else {
                    var userIdCheck =  res.cookie('userName', userLogin);
                    res.redirect('/');
                }

            } else {
                res.redirect('/reg');
            }

        });
    }else{
        res.redirect('signin');
    }
});

router.get('/logout', function(req, res){
    res.clearCookie('userName');
    res.redirect('/');
});

// ------------------------------------ authorized end

// ------------------------------------ registration handling start
router.get('/reg',function(req, res){
    res.render('registration');
});

router.post('/reg',function(req, res){ // getting user login and password
    var userLogin = req.body.login,
        userPass = req.body.password;

    var encryptedPass = passCrypt(userPass);
    if(userLogin != '' && userPass != ''){
        var user = new User({
            name: userLogin,
            password: encryptedPass
        });

        User.find({name: userLogin}, function(err, data){ // insert user login and password
            if(Object.keys(data).length == 0){
                user.save(function(){
                    console.log('user saved!' + '\nLogin: ' + userLogin);
                });
            }
            else{
                console.log('user is exist');
            }
        });
        res.cookie('userName', userLogin);
        res.redirect('/');
    }else{
        res.render('registration');
    }
});

// ------------------------------------ registration handling end

module.exports = router;

// ------------------------------------ main start
router.get('/', function(req,res){
   //var authorizedLogin = getCookie(req);
   //res.render('index', {authorized: authorizedLogin.authorized, login: authorizedLogin.login});
    res.render('index');
});
// ------------------------------------ main end

// ------------------------------------ list of images start
router.get('/pictures', function(req,res){
    //var authorizedLogin = getCookie(req);
    //Picture.find({},
    //    function(err, data){
    //        var pictures = data,
    //            pictureList = [];
    //        pictures.forEach(function(val, key, pictures){
    //            pictureList.push({
    //                picId: pictures[key]['_id'],
    //                picName: pictures[key]['picName']
    //            });
    //        });
    //        res.render('pictures', {pictures: pictureList, authorized: authorizedLogin.authorized, login: authorizedLogin.login});
    //    });
    res.render('pictures');
});

/*
*
* getting data of one picture
*
*/
router.get('/pictures/:id', function(req,res){
    var id = req.params.id,
        commentsList = [],
        i = 0;
    var commentAuthor = getCookie(req); // gettin logged user from cookie

    function finalRenderWithComments(user, i, commentsLength, commentsList, picData, picture, commentAuthor){
        if(commentsLength == i){
            picture.push({
                title: picData['title'],
                picId: picData['_id'],
                picName: picData['picName'],
                postedBy: user.name,
                comments: commentsList
            });
            res.render('picturepage', {picture: picture, login: commentAuthor.login, authorized: commentAuthor.authorized });
        }
    }

    function finalRenderWithoutComments(user, commentsList, picData, picture, commentAuthor){
        picture.push({
                title: picData['title'],
                picId: picData['_id'],
                picName: picData['picName'],
                postedBy: user.name,
                comments: commentsList
            });
        res.render('picturepage', {picture: picture, login: commentAuthor.login, authorized: commentAuthor.authorized });
    }


    /*
    *
    * we need to find name of user who left comment, therefore looking for name of user by id in comments
    * using forEach loop. Then when loop ends use function finalRenderWithComments to get name of users
    * considering scope function, that's why we use variable i equals 'one' and length of comments
     */
    Picture.findById({ _id: id }, function (err, data){
        var comments = data.comments;
        var commentsLength = comments.length;
        var picData = data,
            picture = [];
        if(commentsLength > 0){
            comments.forEach(function(val, key, comments){
                User.findOne({_id:val['postedBy']},function(err,user){
                    i++;
                    commentsList.push({
                        text: val.text,
                        commentId: val._id,
                        postedBy: user.name
                    });

                    finalRenderWithComments(user, i, commentsLength, commentsList, picData, picture, commentAuthor)
                });
            });
        }else{
            User.findOne({_id:data.authorId},function(err,user){
                finalRenderWithoutComments(user, commentsList, picData, picture, commentAuthor)
            });
        }
    });
});

/*
*
*  adding comment for current picture
*
*/

router.post('/addcomment/:id', function(req, res){
    var id = req.params.id,
        text = req.body.commentText;

    var commentAuthor = getCookie(req); // getting user name from cookie

    Picture.findOne({ _id: id }, function (err, doc){
        if (err) {
            return handleError(err);
        }else{
            User.findOne({name: commentAuthor.login}).populate('_id').exec(function (err, user) {
                doc.comments.push({
                    text: text, postedBy: user._id
                });
                doc.save();
            });
        }
    });
    res.redirect('/pictures/'+id);
});
// ------------------------------------ list of images end

// ------------------------------------ add picture start
    router.get('/addpicture', function(req, res){
        var authorizedLogin = getCookie(req);
        res.render('addpicture', {login: authorizedLogin.login, authorized: authorizedLogin.authorized});
    });
// ------------------------------------ add picture end

/*
* delete picture from user account
* */
router.get('/deletepic/:id', function(req, res){
    var id = req.params.id;
    console.log('delete pic for deleting: ' + id);
    Picture.find({_id: id}, function(err, data){
        /*
         * delete file from folder
         * */
        fs.unlinkSync('public/img/' + data[0].picName, function (err) {
            if (err) throw err;
            console.log("file deleted");
        });
        Picture.remove({_id:id}, function(err, pics){
            if(!err) console.log('picture deleted from db');
            res.redirect('/account');
        });
    });


});
/*
 *
 * updating only one comment
 *
 */
router.post('/updatecomment/:id', function(req, res){
    var id = req.params.id;
    console.log(id);
    var comId = req.body.commentId,
        commentText = req.body.commentText;
    comId = comId.substr(1);
    comId = comId.substr(0, comId.length - 1);
    console.log(comId, commentText);
    /*
    *
    * updating only one comment
    *
    */
    Picture.update({_id : id,
            comments : {$elemMatch: {_id: comId} } },
            { $set: { "comments.$.text" : commentText } },function(err, data){

        });
        res.redirect('/pictures/' + id);
});

router.post('/insert', function(req, res){
    //res.end(JSON.srtingify(req.files) + '\n');
    //db.insert({picName: picName, picUrl:picUrl});
});
//var userName =[];

router.get('/posts', function(req, res){
//    var postList =[],
//        commentsList = [],
//        title = '';
//
//    function finalRender(postList,commentsList){
//
//        console.log('callback called!');
//        postList.push({
//            comments:commentsList
//        });
//        res.render('posts', {postList: postList});
//    }
//
//    function findPostOwner(obj, postList, commentsList){
//        obj.forEach(function(val, key, UserPosts) {
//            // STEP 2. GETTING USER NAME BY ID
//            var id = UserPosts[key]['postedBy'];
//            User.findById(id, function (err, userName) {
//
//                postList.push({
//                    title: UserPosts[key]['title'],
//                    postedBy: userName.name
//                });
//                var commentsLength = val.comments.length;
//                var ObjComments = val.comments;
//                if(commentsLength > 0) {
//                    findCommentOwner(commentsLength, ObjComments, commentsList);
//                }
//            });
//        });
//    }
//    function findCommentOwner(commentsLength, ObjComments, commentsList){
//        var i = 0;
//        ObjComments.forEach(function(val, key, UserPosts) {
//            var postedBy = UserPosts[key]['postedBy'];
//
//            User.findById(postedBy, function(err, userComments){
//                i++;
//                commentsList.push({
//                    text: val.text,
//                    postedBy: userComments.name
//                });
//                if(i == commentsLength){
//                    finalRender(postList, commentsList);
//                }
//            });
//        });
//
//    }
//    // STEP 1. GETTING DATA FROM POSTS TABLE
//    Post.find({}, function(err, UserPosts){
//        findPostOwner(UserPosts, postList, commentsList);
//    });
//
//    res.render('posts');
});


module.exports = router;
