const { db } = require("../utils/admin");

exports.getEvents = async (req, res) => {
  const slotsRef = db.collection("Appointments");
  try {
    let startDate = new Date(req.query.startDate);
    let endDate = new Date(req.query.endDate);
    const snapshot = await slotsRef
      .where("startTime", ">=", startDate)
      .where("startTime", "<=", endDate)
      .get();
    let events = [];
    snapshot.forEach((doc) => {
      const result = {
        ...doc.data(),
        startTime: new Date(doc.data().startTime.toDate())
      }
      events.push(result);
    });
    return res.status(200).json(events);
  } catch (error) {}
};
