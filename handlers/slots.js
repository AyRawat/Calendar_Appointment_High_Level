const { db } = require("../utils/admin");
const moment = require("moment-timezone");
const config = require("config");
const slotCalculator = require("../utils/slotCalculator");

exports.slots = async (req, res) => {
  const slotsRef = db.collection("Appointments");
  try {
    const snapshot = await slotsRef.where("date", "==", req.query.date).get();
    let timezone = req.query.timezone;
    let bookedSlots = [];
    snapshot.forEach((doc) => {
      let timestampValue = new Date(doc.data().startTime.toDate());
      bookedSlots.push(moment.tz(timestampValue, timezone).format("HH:mm"));
    });
    let allSlots = await slotCalculator(
      req.query.date,
      config.server.startTime,
      config.server.endTime,
      config.server.duration,
      timezone,
      bookedSlots
    );
    return res.status(200).json(allSlots);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ general: "Something Went Wrong", error });
  }
};
