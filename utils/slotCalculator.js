const { difference } = require("lodash");
const moment = require("moment");
const { db } = require("../utils/admin");

async function getAllSlotsForDay(date, availableSlots ,timezone) {
  const slotsRef = db.collection("Appointments");
  const snapshot = await slotsRef.where("date", "==", date).get();
  let bookedSlots = [];
  snapshot.forEach((doc) => {
    let startTime =  moment(new Date(doc.data().startTime.toDate())).format("HH:mm");
    let endTime = moment( new Date(doc.data().endTime.toDate())).format("HH:mm");
    bookedSlots.push([
      moment(startTime , "HH:mm").tz(timezone).format("HH:mm"),
      moment(endTime , "HH:mm").tz(timezone).format("HH:mm"),
    ]);
  });
   bookedSlots.sort();
  const allSlotsForDay= availableSlots.filter(aSlot => 
    !bookedSlots.some(([bStart, bEnd]) => 
      bStart < aSlot && bEnd > aSlot
    )
  );
  return allSlotsForDay;
}

async function slotCalculator(
  date,
  startTime,
  endTime,
  duration,
  timezone = "Asia/Calcutta",
  bookedSlots = []
) {
  const allSlots = getAllSlots(startTime, endTime, duration, timezone);
  const availableSlots = difference(allSlots, bookedSlots);
  const result = await getAllSlotsForDay(date, allSlots,timezone);
  return result;
}

function getAllSlots(startTime, endTime, duration, timezone) {
  let allSlots = [];

  let sTime = moment(startTime, "HH:mm").tz(timezone);
  let eTime = moment(endTime, "HH:mm").tz(timezone);
  console.log("Details from GetAll SLots", startTime, endTime, timezone, sTime, eTime);
  while (sTime < eTime) {
    allSlots.push(sTime.format("HH:mm"));
    sTime.add(duration, "minutes");
  }
  return allSlots;
}

module.exports = slotCalculator;
