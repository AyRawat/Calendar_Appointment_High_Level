const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const { slots } = require("../handlers/slots");
const { createEvent } = require("../handlers/createEvent");
const { getEvents } = require("../handlers/getEvents");

router.get("/", (req, res) => {
  res.send("Welcome to Calendar Booking System");
});

router.get("/slots", slots);
router.post(
  "/createEvent",
  [
    body("email").not().isEmpty().isEmail().trim(),
    body("startTime").not().isEmpty().trim(),
    body("slot").not().isEmpty().isNumeric().trim(),
    body("date").not().isEmpty().trim()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      createEvent(req, res);
    }
  }
);
router.get("/getEvents", getEvents);

module.exports = router;
