const express = require("express");
const router = express.Router();
const db = require("../models/dbSchema");
const qrcode = require("qrcode");
const { nanoid } = require("nanoid");
const validateUrl = require("../Utils/validateUrl");
const useragent = require("express-useragent"); // To parse device type from user-agent
const geoip = require("geoip-lite");
const fetchuser = require("../middleware/fetchuser");

router.get("/nav/:urlid", async (req, res) => {
  try {
    const url = await db.findOne({ ID: req.params.urlid });
    if (url){
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Client's IP address
      const userAgent = req.headers["user-agent"]; // User-Agent string
      const deviceType = useragent.parse(userAgent).platform; // Extract device type
      const geo = geoip.lookup(ip); // Fetch location data

      const eventDetails = { 
        timestamp: new Date(),
        location: geo ? `${geo.city}, ${geo.country}` : "Unknown", // City and country
        deviceType: deviceType || "Unknown", // Device type, fallback if not detected
        url: url.OriginalUrl, // The original URL from the QR code
      };

      // Add the event details to the existing record in the database
      await db.updateOne(
        { ID: req.params.urlid },
        {
          $push: { Events: eventDetails }, // Assuming you have an 'Events' array in your schema
        }
      );
      await db.updateOne(
        {
          ID: req.params.urlid,
        },
        {
          $inc: { ClickCount: 1 },
        }
      );
      return res.redirect(302, url.OriginalUrl);
    } else {
      res.status(404).json("Not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});





router.post("/QRCode",fetchuser, async (req, res) => {
  const { OriginalUrl } = req.body;
  // const base = req.headers.origin //process.env.BASE;
  const userId = req.user.id;
  const base = process.env.BASE;

  const ID = nanoid();

  if (validateUrl(OriginalUrl)) {
    try {
      // Check if URL already exists
      let url = await db.findOne({ OriginalUrl,user: userId });

      if (url ) {
        res.send(url); // Return existing URL
      } else {
        // Generate short URL
        const shortUrl = `${base}/nav/${ID}`;
        // Generate QR code
        const QrCode = await qrcode.toDataURL(shortUrl);

        // Save new entry in database
        let newQr = new db({
          user: userId,
          OriginalUrl,
          ShortUrl: shortUrl,
          QrCode,
          ID,
          date: new Date(),
        });

        await newQr.save();

        // Send the newly created URL object
        res.send(newQr);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(400).json("Invalid Original Url");
  }
});


router.post("/:urlid/update",fetchuser, async (req, res) => {
  const { NewUrl } = req.body;
  const userId = req.user.id;
  try {
    const url = await db.findOne({ ID: req.params.urlid});
    if (url) {
      const history = { 
        timestamp: new Date(),
        previousUrl: url.OriginalUrl, 
        newURl : NewUrl
      };
      await db.updateOne(
        { ID: req.params.urlid}, // Match the correct document
        { $set: { OriginalUrl: NewUrl }, $push: { History: history } }
      );
      let History = url.History;
      History.push(history);
       
      return res.send({
        History
      });
    } else {
      res.status(404).json("Not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});


router.get("/qr/my-codes", fetchuser, async (req, res) => {
  const userId = req.user.id; 
  
  try {
    const qrCodes = await db.find({ user: userId });
    
    if (qrCodes.length > 0) {
      res.status(200).json(qrCodes);
    } else {
      res.status(404).json("No QR codes found for this user.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});



module.exports = router;
