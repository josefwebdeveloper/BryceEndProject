var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var passport = require('passport');
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});


var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var transporter = nodemailer.createTransport({
    service: 'Mail.ru',
    auth: {
        user: 'josef2007@list.ru',
        pass: 'josefmoscow'
    }
});


router.get('/posts', function (req, res, next) {
    Post.find(function (err, posts) {
        if (err) {
            return next(err);
        }

        res.json(posts);
    });
});
router.get('/users', function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            return next(err);
        }

        res.json(users);
    });
});
router.post('/mail', function (req, res, next) {
    // console.log(req.body[0]);
    var subjectMail = req.body.message1;
    var mailOptions = {
        from: 'josef2007@list.ru',
        to: '21101971@list.ru',
        // subject: 'Sending Email using Node.js',
        subject: subjectMail,
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.json(mailOptions);

});

router.post('/posts', auth, function (req, res, next) {
    var post = new Post(req.body);
    post.author = req.payload.username;

    post.save(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});


// Preload post objects on routes with ':post'
router.param('post', function (req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function (err, post) {
        if (err) {
            return next(err);
        }
        if (!post) {
            return next(new Error("can't find post"));
        }

        req.post = post;
        return next();
    });
});

// Preload comment objects on routes with ':comment'
router.param('comment', function (req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function (err, comment) {
        if (err) {
            return next(err);
        }
        if (!comment) {
            return next(new Error("can't find comment"));
        }

        req.comment = comment;
        return next();
    });
});


// return a post
router.get('/posts/:post', function (req, res, next) {
    req.post.populate('comments', function (err, post) {
        res.json(post);
    });
});


// upvote a post
router.put('/posts/:post/upvote', auth, function (req, res, next) {
    req.post.upvote(function (err, post) {
        if (err) {
            return next(err);
        }

        res.json(post);
    });
});


// create a new comment
router.post('/posts/:post/comments', auth, function (req, res, next) {
    var comment = new Comment(req.body);
    comment.post = req.post;
    comment.author = req.payload.username;

    comment.save(function (err, comment) {
        if (err) {
            return next(err);
        }

        req.post.comments.push(comment);
        req.post.save(function (err, post) {
            if (err) {
                return next(err);
            }

            res.json(comment);
        });
    });
});


// upvote a comment
router.put('/posts/:post/comments/:comment/upvote', auth, function (req, res, next) {
    req.comment.upvote(function (err, comment) {
        if (err) {
            return next(err);
        }

        res.json(comment);
    });
});

//login user
router.post('/login', function (req, res, next) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (user) {
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

//create user
router.post('/register', function (req, res, next) {
    if (!req.body.username || !req.body.password || !req.body.email || !req.body.city
        || !req.body.phone) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }

    var user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.city = req.body.city;
    user.phone = req.body.phone;
    user.score = 0;
    user.rating = 1000;

    user.setPassword(req.body.password);

    user.save(function (err) {
        if (err) {

                // return next(err);
            return res.status(500).json({message: 'Username, Email or Phone are used'});
        }

        return res.json({token: user.generateJWT()})
    });
});

module.exports = router;
