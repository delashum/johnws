var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var John = mongoose.model('John');

exports.Authenticate = function (req, res, next, success) {



    if (req.cookies.i == undefined && req.body.pass == undefined) {
        res.redirect('/login');
        return;
    }


    var check = {
        password: req.cookies.i == undefined ? req.body.pass : req.cookies.i
    }


    John.find(check, function (err, john) {
        if (err) {
            return next(err);
        }
        if (john.length > 0) {
            success(john);
        } else {
            console.log(john);
            res.redirect('/login');
        }
    })

}