var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imageSchema = new Schema({
    imageType: { type: String,
                 enum: ['thumbnail', 'detail'],
                 required: true
               },
    url: { type: String, required: true }
});

var tshirtSchema = new Schema({
    model:  { type: String,
              require: true
            },
    images: [ imageSchema ],
    style:  { type: String,
             enum: ['Casual', 'Vintage', 'Alternative'],
             require: true
            },
    size:   { type: String,
              enum: [36, 38, 40, 42, 44, 46],
              require: true
            },
    color:  { type: String },
    price:  { type: Number,
              require: true
            },
    description: { type: String },
    created_at: { type: Date, default: Date.now },
    modified_at: { type: Date, default: Date.now }
});

tshirtSchema.path('model').validate(function (v) {
    return ((v != "") && (v != null));
});

module.exports = mongoose.model('Tshirt', tshirtSchema);