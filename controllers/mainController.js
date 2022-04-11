const Message = require('../models/messages');
const Comment = require('../models/comment');
const User = require('../models/user')

const { DateTime } = require('luxon');
const { body,validationResult } = require('express-validator')

const jwt = require('jsonwebtoken');
const passport = require('passport')
const JwtStrategy = require('../middleware/passport');


const async = require('async');


exports.index_get = function(req, res, next) {
    return res.send('This is a get request');
}

exports.blog_get = (req, res, next) =>{
    Message.find()
        .exec((err, messages) => {
            if(err) {return next(err)}

            return res.send(messages);
        })
}

exports.blog_id_get = (req, res, next) => {
    async.parallel({
        blog: function(callback){
            Message.findById(req.params.id)
                .exec(callback);
        },
        comment: function(callback){
            Comment.find({'postId': req.params.id})
                .exec(callback);
        }

    }, function(err, results) {
        if(err) {return next(err)}

        if(results.blog == null){
            return next(err);
        }

        return res.send(results)
    })
}

exports.blog_id_comment_post = [
    body('name', 'Name must not be empty').trim().isLength({ min: 1 }).escape(),
    body('content', 'Content must not be empty').trim().isLength({ min: 1 }).escape(),
    

    (req, res, next) => {
        const errors = validationResult(req);


        const comment = new Comment(
            {
                name: req.body.name,
                content: req.body.content,
                date: DateTime.now().toISO(),
                postId: req.params.id,
            }
        )
        
        if(!errors.isEmpty()) {
            return res.send(errors);
        }else{
            comment.save(function (err) {
                if(err) { return next(err) }

                return res.send("Successful Post Req")
            })
        }

    }
]

exports.blog_create = [
    body('title', 'Title must not be empty').trim().isLength({ min: 1 }),
    body('content', 'Content must not be empty').trim().isLength({ min: 1 }),
    

    (req, res, next) => {
        const errors = validationResult(req);


        const post = new Message(
            {
                title: req.body.title,
                content: req.body.content,
                date: DateTime.now().toISO(),
            }
        )
        
        if(!errors.isEmpty()) {
            return res.send(errors);
        }else{
            post.save(function (err) {
                if(err) { return next(err) }

                return res.send("Successful Post Req")
            })
        }
    }
]

exports.blog_update = [
    body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
    body('content', 'Content must not be empty').trim().isLength({ min: 1 }).escape(),
    

    (req, res, next) => {
        const errors = validationResult(req);


        const post = new Message(
            {
                _id: req.params.id,
                title: req.body.title,
                content: req.body.content,
                date: DateTime.now().toISO(),
            }
        )
        
        if(!errors.isEmpty()) {
            return res.send(errors);
        }else{
            Message.findByIdAndUpdate(req.params.id, post,{}, function(err, posts){
                if(err) {return next(err)}

                return res.send("successful post");
            })
        }
    }
]

exports.blog_delete = (req, res, next) => {
    async.parallel({
        post: function(callback){
            Message.findById(req.params.id).exec(callback);
        },
        comments: function(callback){
            Comment.find({ 'postId': req.params.id}).exec(callback);
        }
    }, function(err, results){
        if(err) {return next(err)};

        Comment.findByIdAndRemove(results.comments._id, (err) => {
            if(err) {return next(err)};

            Message.findByIdAndRemove(req.params.id, (err) =>{
                if(err) {return next(err)};

                return res.send('Successful deletion');
            })
        })
    })
}

exports.index_test = function(req, res, next){
    const comment = new Message(
        {
            title: "Hype",
            content: "Yo this blog kinda slaps Yeah it really does",
            date: DateTime.now().toISO(),
        }
    );

    comment.save((err) => {
        if(err) { return next(err) }

        return res.send(`successfully stored ${comment}`)
    })
}

exports.user_test = function(req, res, next){

    // Auth jwt key maker;;;
    User.findById("620d2278a8134a5265192626")
        .exec((err, user) => {
            if(err) {return next(err)};

            if(user.username === "RoloThornock"){
                if(user.password === "HelloWorld"){
                    const secret = "Super_Secret_Key";
                    let username = user.username;
                    const token = jwt.sign({username}, secret);
                    return res.status(200).json({
                        message: "Auth Passed",
                        token,
                    })
                }
            }
            return res.status(401).json({ message: "Auth Failed" })
        
        })
   
}

exports.user_auth = (req,res,next) =>{
    return res.status(200).send("YAY! this is a protected Route")
}