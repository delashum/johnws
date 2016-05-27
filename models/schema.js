var mongoose = require('mongoose');

var Post = mongoose.model('Post', new mongoose.Schema({
    title: String,
    type: String,
    created: {
        type: Date,
        default: Date.now
    },
    edited: {
        type: Date,
        default: Date.now
    },
    body: String,
    comments: [{
        user: String,
        created: {
            type: Date,
            default: Date.now
        },
        text: String
    }]
}));

var John = mongoose.model('John', new mongoose.Schema({
    password: String,
    types: [String],
    analytics: {
        cur: {
            month: {
                type: Number,
                default: 0
            },
            year: {
                type: Number,
                default: 0
            },
            day: {
                type: Number,
                default: 0
            }
        },
        count: {
            day: {
                type: Number,
                default: 0
            },
            month: {
                type: Number,
                default: 0
            },
            year: {
                type: Number,
                default: 0
            },
            alltime: {
                type: Number,
                default: 0
            }
        }
    }
}));