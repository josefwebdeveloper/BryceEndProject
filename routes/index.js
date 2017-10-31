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
var Game = mongoose.model('Game');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

var transporter = nodemailer.createTransport({
    service: 'Mail.ru',
    auth: {
        user: 'josef2007@list.ru',
        pass: 'josefmoscow'
    }
});


// router.get('/posts', function (req, res, next) {
//     Post.find(function (err, posts) {
//         if (err) {
//             return next(err);
//         }
//
//         res.json(posts);
//     });
// });
//get users
router.get('/users', function (req, res, next) {
    User.find(function (err, users) {
        if (err) {
            return next(err);
        }

        res.json(users);
    });
});
//get games
router.get('/games', function (req, res, next) {
    Game.find(function (err, games) {
        if (err) {
            return next(err);
        }

        res.json(games);
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
// router.param('post', function (req, res, next, id) {
//     var query = Post.findById(id);
//
//     query.exec(function (err, post) {
//         if (err) {
//             return next(err);
//         }
//         if (!post) {
//             return next(new Error("can't find post"));
//         }
//
//         req.post = post;
//         return next();
//     });
// });
// Preload users objects on routes with ':user'
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
router.param('gameid', function (req, res, next, id) {
    var query = Game.findById(id);

    query.exec(function (err, game) {
        if (err) {
            return next(err);
        }
        if (!game) {
            return next(new Error("can't find game"));
        }

        req.game = game;
        return next();
    });
});

//route get user!!!
router.get('/admin/:id', auth, function (req, res, next) {
    var id = req.params.id;
    console.log("id", id);
    User.findById(id, function (err, user) {
        if (err) {

            return res.json({message: 'error finduser'});
        }
        // doc is a Document
        console.log("user", user.username);
        res.send(user);
    });

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
//delete game by id
router.delete('/admin/delete/game/:gameid', auth, function (req, res, next) {
    Game.findOneAndRemove({_id: req.game._id}, function (err) {
        if (err) {

            return res.json({message: 'error delete'});
        }


        return res.json({message: 'game deleted'});
    });
});

// update user
router.post('/admin/update', function (req, res, next) {
    console.log("working eoute", req.body);
    if (!req.body.username || !req.body.email || !req.body.city
        || !req.body.phone) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    var id = req.body._id;


    User.findByIdAndUpdate(id, {
            username: req.body.username,
            email: req.body.email,
            city: req.body.city,
            phone: req.body.phone

        },
        function (err) {
            if (err) {

                return res.json({message: 'error update'});
            }
            res.json({message: 'user updated'});
            // res.send(req.user);
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
    console.log("login", req.body.username);
    console.log("login", req.body);
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
        users[0].rating = 1;
        for (var i = 0; i < users.length; i++) {


            if (i > 0) {
                if (users[i].score == users[i - 1].score) {
                    users[i].rating = rating;
                } else {
                    rating = rating + 1;
                    users[i].rating = rating;
                }
            }
            users[i].save(function (err) {
                if (err) {
                    console.log(err); // Log any errors to the console
                }
            });
            console.log(users[i].score, users[i].rating, rating);
        }
    });
    res.json({message: "updated"});
});
//create game
router.post('/game', auth, function (req, res, next) {
    console.log("req", req.body);
    // if (!req.body.username || !req.body.password || !req.body.password1 || !req.body.email || !req.body.city
    //     || !req.body.phone) {
    //     return res.status(400).json({message: 'Please fill out all fields'});
    // }
    //
    //
    // if (!req.body.user1username || !req.body.password || !req.body.password1 || !req.body.email || !req.body.city
    //     || !req.body.phone) {
    //     return res.status(400).json({message: 'Please fill out all fields'});
    // }
    var game = new Game();

    game.user1username = req.body.user1username;
    game.user1id = req.body.user1id;
    game.user1score = req.body.user1score;
    game.user1rating = req.body.user1rating;
    game.user1phone = req.body.user1phone;
    game.user1city = req.body.user1city;
    game.user2id = req.body.currentid;
    game.user2username = req.body.currentusername;

    game.user2rating = req.body.currentrating;
    game.user2score = req.body.currentscore;
    game.user2phone = req.body.currentphone;
    game.user2city = req.body.currentcity;
    game.gamestatus = "waiting approval";
    game.approval1 = false;
    game.approval2 = true;
    game.gamescore = "";
    game.winner = "";
    game.looser = "";

    game.save(function (err) {
        if (err) {

            // return next(err);
            // return res.status(500).json({message: 'Username, Email or Phone are used'});
            console.log(err);
            return res.status(500).json(err);
        }
        //
        return res.json({message: "OKKK"});
    });
});

//game/approval
router.post('/game/approval', function (req, res, next) {
    console.log("working aproval", req.body);
    // if (!req.body.username || !req.body.email || !req.body.city
    //     || !req.body.phone) {
    //     return res.status(400).json({message: 'Please fill out all fields'});
    // }
    var id = req.body._id;


    Game.findByIdAndUpdate(id, {
            approval1: true,
            gamestatus: "waiting results"
        },
        function (err) {
            if (err) {

                return res.json({message: 'error update'});
            }
            res.json({message: 'game approved'});
            // res.send(req.user);
        });
});

//game/winner
router.post('/game/winner', function (req, res, next) {
    console.log("working winner", req.body);
    console.log("working winner1");
    // if (!req.body.username || !req.body.email || !req.body.city
    //     || !req.body.phone) {
    //     return res.status(400).json({message: 'Please fill out all fields'});
    // }
    var id = req.body._id;

    if (req.body.user1username == req.body.winner) {
        req.body.user1score = req.body.user1score + 3;
        var newScore=req.body.user1score;
        var userId = req.body.user1id;
        console.log("newScoreus1", req.body.user1score, req.body.user1username);
    } else {
        req.body.user2score = req.body.user2score + 3;
        var newScore=req.body.user2score;
        var userId = req.body.user2id;
        console.log("newScoreus2", req.body.user2score, req.body.user2username);
    }
    Game.findByIdAndUpdate(id, {
            user1score: req.body.user1score,
            user2score: req.body.user2score,
            winner: req.body.winner,
            looser: req.body.looser,
            gamestatus: "played"

        },
        function (err) {
            if (err) {

                return res.json(err);
            }
            // res.json({message: 'game approved'});
            // res.send(req.user);
        });
    // var user1username = req.body.user1username;
    // var user2username = req.body.user2username;

    console.log("newScore",userId,newScore);

    User.findByIdAndUpdate(userId, {
            score: newScore


        },
        function (err) {
            if (err) {

                return res.json({message: 'error '});
            }
            res.json({message: 'game winner score updated'});
            console.log("message: game winner score updated");
            // res.send(req.user);
        });
    // console.log("message: game winner score");
});

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
