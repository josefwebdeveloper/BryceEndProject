var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
    // user1id:{type: String ,unique: false},
    user1score: {type: Number, unique: false},
    user1city:{type: String, lowercase: true, unique: false},
    user1rating: {type: Number, unique: false},
    user1phone: {type: String, lowercase: true, unique: false},
    user1username: {type: String, lowercase: true, unique: false},
    // user2id:{type: String,  unique: false} ,
    user2username: {type: String, lowercase: true,unique: false},
    user2rating: {type: Number, unique: false},
    user2score: {type: Number, unique: false},
    user2phone: {type: String, lowercase: true, unique: false},
    user2city:{type: String, lowercase: true, unique: false},
    gamestatus:Boolean,
    approval1: Boolean,
    approval2: Boolean
});

GameSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Game', GameSchema);