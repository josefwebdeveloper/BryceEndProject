var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
    user1id:{type: String ,unique: false},
    user1score: {type: Number, unique: false},
    user1city:{type: String, lowercase: true, unique: false},
    user1rating: {type: Number, unique: false},
    user1phone: {type: String, lowercase: true, unique: false},
    user1username: {type: String, lowercase: true, unique: false},
    user2id:{type: String,  unique: false} ,
    user2username: {type: String, lowercase: true,unique: false},
    user2rating: {type: Number, unique: false},
    user2score: {type: Number, unique: false},
    user2phone: {type: String, lowercase: true, unique: false},
    user2city:{type: String, lowercase: true, unique: false},
    gamestatus:{type: String ,unique: false},
    approval1: Boolean,
    approval2: Boolean,
    gamescore:{type: String ,unique: false},
    winner:{type: String ,unique: false},
    looser:{type: String ,unique: false}

});



mongoose.model('Game', GameSchema);