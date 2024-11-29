const mongoose = require('mongoose');
const { Schema } = mongoose;

const QRCodeSchema = new Schema({
    qrId: { type: String, unique: true },
    url: String,
    owner: mongoose.Schema.Types.ObjectId,
    events: [{
        timestamp: Date,
        location: String,
        device: String,
        metadata: Object,
    }],
    history: [{
        updatedAt: Date,
        oldUrl: String,
        newUrl: String,
    }],
});

module.exports = mongoose.model('QRCode', QRCodeSchema);