const { db } = require("../utils/admin");
const moment = require("moment");
const short = require("short-uuid");



async function canCreateSlot(date, userStartTime, userEndTime) {
  const slotsRef = db.collection("Appointments");
  const snapshot = await slotsRef.where("date", "==", date).get();
  let bookedSlots = [];
  snapshot.forEach((doc) => {
    let startDate = new Date(doc.data().startTime.toDate());
    let endDate = new Date(doc.data().endTime.toDate());
    bookedSlots.push([
      moment(startDate).format("HH:mm"),
      moment(endDate).format("HH:mm"),
    ]);
  });
  bookedSlots = bookedSlots.sort();
  let check = true;
 bookedSlots.forEach((slot) => {
    if( (userEndTime > slot[0] && userEndTime < slot[1]) ||
        (userStartTime == slot[0] && userEndTime >= slot[1]) ||
        (userStartTime > slot[0] && userStartTime < slot[1]) ||
        (userStartTime < slot[0] && userEndTime >= slot[1])
        ) 
        {
          check = false;
          return check;
        }
  });
  return check;
}

exports.createEvent = async (req, res) => {
  const requestedEvent = {...req.body};
  let userStartTime = moment(requestedEvent.startTime).format("HH:mm");
  let userEndTime = moment(requestedEvent.startTime)
    .add(requestedEvent.slot, "m")
    .format("HH:mm");
  let check = await canCreateSlot(requestedEvent.date, userStartTime, userEndTime);
  if (!check) {
    return res.status(422).json({ message: `This Slot is not available for ${requestedEvent.slot} minutes.` });
  }
  try {
    const userData = {
      startTime: moment(requestedEvent.startTime),
      endTime: moment(requestedEvent.startTime).add(requestedEvent.slot, "m"),
      duration: requestedEvent.slot,
      date: requestedEvent.date,
      name: requestedEvent.name,
      email: requestedEvent.email,
    };
    const slotsRef = db.collection("Appointments");
    const response = await slotsRef.doc(short.generate()).set(userData);
    return res.status(201).json({message:"Successfully Booked the slot.",response});
  } catch (error) {
    return res.status(500).json({ general: "Something Went Wrong" });
  }
};
