var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
    userid1: String,
    userid2: String,
    username1: String,
    username2: String,
    statusGame: String,
    approval1: Boolean,
    approval2: Boolean
});

GameSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Game', GameSchema);