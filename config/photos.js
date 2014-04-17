// @TODO Change photo to photos for proper route naming
module.exports = function (app) {
    var photos = require('../routes/photos');
    app.set('photos', __dirname + '/../public/photos');
    app.get('/', photos.list);
    app.get('/upload', photos.form);
    app.post('/upload', photos.submit(app.get('photos')));
    app.get('/photo/:id', photos.show);
    app.post('/photo/:id', photos.update(app.get('photos')));
    app.post('/', photos.search);
    app.del('/photo/:id', photos.destroy);
    app.get('/photo/:id/download', photos.download(app.get('photos')));

    app.get('/api/photo', photos.apiAll);
    app.post('/api/photo/search', photos.apiSearch);
    app.put('/api/photo/:id', photos.apiUpdate);
    app.get('/api/photo/compile', photos.apiCompile);
};