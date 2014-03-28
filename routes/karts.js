/**
 * Created by Roberto Marco
 */

module.exports = function(app) {

    var Kart = require('../models/kart');
    var Tshirt = require('../models/tshirt');

    var redis = require('redis'),
        client = redis.createClient();

    var ttl = 300; // 5 minutes for expiration time

    // We are using IP as kart identifier. Care with that - IP conflicts?
    var kart_id = 'kart.' + 1;

    showKart = function(req, res) {
        console.log('GET - /showCart');

        client.hgetall(kart_id, function(err, items){
            if (err) {
                res.statusCode = 500;
                res.send(res.statusCode, {error: err.message});
            } else {
                if (!items) {
                    res.statusCode = 404;
                    res.send(res.statusCode, {error: 'Cart without items'});
                } else {
                    res.send({ status: 'OK', items: items });
                }
            }

        });
    };

    addProductToKart = function(req, res) {
        console.log('POST - /kart/addproduct');
        console.log('Params: %d %d', req.body.id, req.body.amount);

        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        if (!req.body.id || !req.body.amount) {
            res.statusCode = 404;
            console.log(Date.now());
            res.send(res.statusCode, { error: "Not product id or amount detected"});
        } else {
            Tshirt.findById(req.body.id, function(err, tshirt){
                if (err) {
                    res.statusCode = 500;
                    res.send(res.statusCode, { error: err.message });
                } else {
                    if (!tshirt) {
                        res.statusCode = 404;
                        res.send(res.statusCode, { error: 'Product not found'});
                    } else {

                        client.hmset(kart_id, req.body.id, req.body.amount, function(err){
                           if (err) {
                               console.log('Error creating Redis hashkey for addProduct');
                               res.statusCode = 500;
                               res.send(res.statusCode, {error: err.message });
                           } else {
                               console.log('Product add to kart successfully');
                               res.send ({ status: 'OK', message: 'Product added successfully to the cart' });
                           }
                        });

                        client.expire(kart_id, ttl);
                    }

                }
            });
        }

    };

    deleteProductToKart = function(req, res) {
        console.log('DELETE - /kart/deleteproduct');

        client.hdel(kart_id, req.params.id, function(err, productsDeleted){
            if (err) {
                res.statusCode = 500;
                res.send(res.statusCode, { error: err.message });
            } else {
                if (productsDeleted == 0) {
                    console.log('Deleting item. Product not found');
                    res.statusCode = 404;
                    res.send(res.statusCode, { error: 'Product not found'});
                } else {
                    console.log('Product deleted from the kart successfully');
                    res.send({ status: 'OK', nessage: 'Product removed successfully from the cart'});
                }
            }
        });

    };

    app.post('/kart/addproduct', addProductToKart);
    app.get('/kart/showcart', showKart);
    app.delete('/kart/deleteproduct/:id', deleteProductToKart);
};