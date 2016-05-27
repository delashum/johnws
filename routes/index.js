var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var John = mongoose.model('John');

var Auth = require('../services/auth.js').Authenticate;

router.get('/login', function (req, res, next) {
    res.render('index', {
        page: "pages/login"
    });
});


router.post('/login/try', function (req, res, next) {
    Auth(req, res, next, function (data) {
        res.cookie('i', data[0].password);
        res.sendStatus(200);
    });
});


router.get('/authenticate', function (req, res, next) {
    var check = req.body;

    John.find(check, function (err, john) {
        if (err) {
            return next(err);
        }
        if (john.length > 0) {
            res.cookies.i = john[0].pass
            res.sendStatus(200);
        } else {
            res.sendStatus(200);
        }
    });
});


router.post('/view', function (req, res, next) {

    John.find({}, 'types analytics', function (err, john) {
        if (err) {
            next(err);
        }

        var analytics = john[0].analytics,
            id = john[0]._id,
            today = new Date(),
            now = {
                month: today.getMonth(),
                year: today.getFullYear(),
                day: today.getDate()
            };

        analytics.count.alltime++;

        for (key in now) {
            if (analytics.cur[key] != now[key]) {
                analytics.count[key] = 0;
                analytics.cur[key] = now[key];
            } else {
                analytics.count[key]++;
            }
        }

        John.findByIdAndUpdate(
            id, {
                $set: {
                    analytics: analytics
                }
            }, {
                safe: true,
                upsert: true
            },
            function (err, user) {
                if (err) {
                    console.log(err);
                }
                if (john.length > 0) {
                    john[0].analytics = analytics;
                    res.json(john[0]);
                } else {
                    res.json({});
                }
            }
        );

    });

});


router.get('/blog/create', function (req, res, next) {


    Auth(req, res, next, function (john) {
        res.render('index', {
            page: "pages/create"
        });
    });

});

router.get('/blog/:type', function (req, res, next) {

    var check = {
        type: req.params.type
    }

    Post.find(check).sort({
        created: -1
    }).exec(function (err, posts) {
        if (err) {
            return next(err);
        }

        if (posts.length <= 0) {
            res.render('index', {
                page: "pages/unknown"
            });
            return;
        }
        res.render('index', {
            page: "pages/blog",
            posts: posts
        });
    })

});

router.post('/blog/:type/addcomment/:id', function (req, res, next) {

    if (req.body.text == "" || req.body.text == undefined || req.body.user == '' || req.body.user == undefined) {
        res.sendStatus(400);
        return;
    }

    Post.findByIdAndUpdate(
        req.params.id, {
            $push: {
                comments: req.body
            }
        }, {
            safe: true,
            upsert: true
        },
        function (err, user) {
            if (err) {
                console.log(err);
            }
            res.sendStatus(200);
        }
    );

});


router.post('/blog/:type/new', function (req, res, next) {

    var temp = req.body;
    temp.type = req.params.type;

    var post = new Post(temp);

    post.save(function (err, post) {
        if (err) {
            return next(err);
        }

        John.find({}, 'types', function (err, john) {

            if (err) {
                next(err);
            }

            console.log(john);

            console.log(john[0].types.indexOf(req.params.type));



            if (john[0].types.indexOf(req.params.type) < 0) {
                John.findByIdAndUpdate(
                    john[0]._id, {
                        $push: {
                            types: req.params.type
                        }
                    }, {
                        safe: true,
                        upsert: true
                    },
                    function (err, user) {
                        if (err) {
                            next(err);
                        }
                        console.log(req.params.type);
                        res.sendStatus(200);
                        return;
                    }
                );
            } else {
                console.log(req.params.type);

                res.sendStatus(200);
            }

        });




    })



});


router.get('/:page', function (req, res, next) {
    res.render('index', {
        page: "pages/" + req.params.page
    });
});



router.get('*', function (req, res, next) {
    res.render('index', {
        page: "pages/unknown"
    });
});

module.exports = router;