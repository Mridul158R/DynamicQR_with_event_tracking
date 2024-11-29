const connectToMongo = require('./db');
const express = require('express')
const bodyParser = require('body-parser')
require('dotenv').config();
var cors = require('cors')
connectToMongo();
const app = express();
const port = 3000;
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors())
app.use(express.json())
const QRCodeModel = require("./models/QRCode");
const crypto = require('crypto');
const QRCode = require('qrcode');
const fetchuser = require('./middleware/fetchuser');




app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));
app.use('',require('./routes/qr'));

// app.post('/qr/static', async (req, res) => {
//   const { url, metadata } = req.body;
//   try {
//       const qrImage = await QRCode.toDataURL(url);
//       res.send({ qrImage });
//   } catch (err) {
//       res.status(500).send('Error generating QR code');
//   }
// });

// app.post('/qr/dynamic', fetchuser, async (req, res) => {
//   const { url, metadata } = req.body;
//   const qrId = crypto.randomUUID();

//   const newQRCode = new QRCodeModel({
//       qrId,
//       url,
//       owner: req.user._id,
//   });
//   await newQRCode.save();

//   try {
//       const qrImage = await QRCode.toDataURL(url);
//       res.send({ qrImage, qrId });
//   } catch (err) {
//       res.status(500).send('Error generating QR code');
//   }
// });


app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
}) 