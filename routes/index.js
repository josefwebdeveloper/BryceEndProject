var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');
var passport = require('passport');
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res) {
    // res.render('index', {title: 'Express'});
    res.sendfile('index.html', {title: 'Express'});
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
//get users
router.get('/users', function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            return next(err);
        }

        res.json(users);
    });
});
//send mail
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

//posts
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
// Preload users objects on routes with ':id'
router.param('user', function (req, res, next, id) {
    var query = User.findById(id);

    query.exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error("can't find user"));
        }

        req.user = user;
        return next();
    });
});
//route get user
router.get('/admin/:user', auth, function (req, res, next) {
   res.json(req.user);
});
// route delete contact
router.delete('/admin/:user', auth, function (req, res, next) {
    User.findOneAndRemove({_id: req.user._id}, function (err) {
        if (err) {

            return res.json({message: 'error delete'});
        }


        return res.json({message: 'user deleted'});
    });
});

// update user
router.put('/admin/:user', function (req, res, next) {
    // if (!req.body.username ||  !req.body.email || !req.body.city
    //     || !req.body.phone || !req.body.score ) {
    //     return res.status(400).json({message: 'Please fill out all fields'});
    // }
    var id = req.user._id;
    console.log(req.user._id);
    console.log(req.user.username);
    User.findByIdAndUpdate(id, {
            username: req.body.username, email: req.body.email, city: req.body.city, phone: req.body.phone,
            score: req.body.score
        },
        function (err) {
            if (err) {

                return res.json({message: 'error update'});
            }
            // res.json({message: 'user updated'});
            res.send(req.user);
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

//update rating
router.get('/updaterating', function (req, res, next) {

    User.find(function (err, users) {
        if (err) {
            return next(err);
        }

        users.sort(function (a, b) {
            if (a.score > b.score) {
                return -1;
            }
            if (a.score < b.score) {
                return 1;
            }

            return 0;
        });
        var rating = 1;
        users[0].rating=1;
        for (var i = 0; i < users.length; i++) {


           if(i>0) {
               if (users[i].score == users[i - 1].score) {
                   users[i].rating = rating;
               } else {rating=rating+1;
                   users[i].rating = rating;
               }
           }
            users[i].save(function (err) {
                if (err) {
                    console.log(err); // Log any errors to the console
                }
            });
            console.log(users[i].score, users[i].rating,rating);
        }
    });
    res.json({message: "updated"});
});
//

//create user
router.post('/register', function (req, res, next) {
    if (!req.body.username || !req.body.password || !req.body.password1 || !req.body.email || !req.body.city
        || !req.body.phone) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    if (req.body.password != req.body.password1) {
        console.log("Passwords do not match");
        return res.status(400).json({message: 'Passwords do not match'});
    }

    var user = new User();

    user.username = req.body.username;
    user.email = req.body.email;
    user.city = req.body.city;
    user.phone = req.body.phone;
    user.score = 10;
    // user.rating=91;


    user.setPassword(req.body.password);

    user.save(function (err) {
        if (err) {

            // return next(err);
            // return res.status(500).json({message: 'Username, Email or Phone are used'});
            return res.status(500).json(err);
        }

        return res.json({token: user.generateJWT()})
    });
});

module.exports = router;
