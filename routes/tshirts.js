/**
 * Created by Roberto Marco
 */

module.exports = function(app) {

    var Tshirt = require('../models/tshirt');

    getAllTshirts = function(req, res) {
        console.log("GET - /tshirts");
        Tshirt.find(function(err, results){
            if (!err)
                res.send(results);
            else {
                res.statusCode = 500;
                console.log('Internal error %d: %s', res.statusCode, err.message);
                res.send(500, {error: err.message });
            }

        });
    };

    addTshirt = function(req, res) {
        console.log('POST - /tshirt/:id');
        console.log(req.body);

        var tshirt = new Tshirt({
            model:  req.body.model,
            images: req.body.images,
            style:  req.body.style,
            size:   req.body.size,
            color:  req.body.color,
            price:  req.body.price,
            description: req.body.description
        });

        tshirt.save(function(err){
            if (!err) {
                console.log('Tshirt added successfully');
                res.send({ status: 'OK', tshirt: tshirt});
            } else {
                console.log(err.message);
            }
        });
    };

    // Routes functions
    app.get('/tshirts', getAllTshirts);
    app.post('/tshirts', addTshirt);
};