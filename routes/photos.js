var Photo = require('../models/photo');
var path = require('path');
var fs = require('fs');
var join = path.join;
var multiparty = require('multiparty');
var extend = require('util')._extend;

exports.list = function (req, res, next) {
    Photo.find({}, function (err, photos) {
        if (err) return next(err);
        res.render('photos', {
            title: 'Photos',
            photos: photos
        });
    });
};

exports.show = function (req, res) {
    Photo.findById(req.params.id, function (err, photo) {
        if (err) return err;
        res.render('photos/show', {
            title: 'Photo',
            photo: photo
        });
    });
};


// @TODO The image retrieval can be a reusable method
exports.update = function (dir) {
    return function (req, res) {
        Photo.findById(req.params.id, function (err, photo) {
            if (err) return err;
            var form = new multiparty.Form();
            form.parse(req, function (err, fields, files) {
                if (fields.name) photo.name = fields.name;
                var img = files['photo[image]'][0];
                var path = join(dir, img.originalFilename);

                fs.rename(img.path, path, function (err) {
                    if (err) return next(err);
                    photo.path = img.originalFilename;
                    photo.save(function (err) {
                        res.redirect('/photo/' + photo.id);
                    });
                });
            });
        });
    };
};

exports.destroy = function (req, res) {
    Photo.findById(req.params.id, function (err, photo) {
        if (err) return err;
        photo.remove(function (err) {
            res.redirect('/');
        });
    });
};

exports.form = function (req, res) {
    res.render('photos/upload', {
        title: 'Photo upload'
    });
};

exports.submit = function (dir) {
    return function (req, res, next) {
        // @NOTE See fix http://stackoverflow.com/questions/23063317/express-3-4-8-photo-uploading-issue-how-to-solve-without-using-bodyparser
        var form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            var img = files['photo[image]'][0];
            var name = fields.name || img.originalFilename; // @TODO We want a serial filename
            var path = join(dir, img.originalFilename);

            fs.rename(img.path, path, function (err) {
                if (err) return next(err);

                Photo.create({
                    name: name,
                    path: img.originalFilename
                }, function (err) {
                    if (err) return next(err);
                    res.redirect('/'); // @TODO Probably should be a success code
                });
            });
        });
    };
};

exports.download = function (dir) {
    return function (req, res, next) {
        var id = req.params.id;
        Photo.findById(id, function (err, photo) {
            if (err) return next(err);
            var path = join(dir, photo.path);
            res.download(path, photo.name + '.jpg');
        });
    };
};

exports.search = function (req, res, next) {
    var form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
        if (err) return next(err);
        var search = new RegExp(fields.search, 'i');

        Photo.find({ name: search }, function (err, photos) {
            if (err) return err;
            res.render('photos/search', {
                title: 'Photo Search Results',
                photo: photos
            });
        });
    });
}