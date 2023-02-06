<template>
  <b-container>
    <b-row><h2>See all the appointments</h2></b-row>
    <b-row>
      <b-col>
        <label for="startDatePicker">Choose Starting date</label>
        <b-form-datepicker
          id="startDatePicker"
          v-model="startDate"
          locale="en"
        ></b-form-datepicker>
      </b-col>
      <b-col>
        <label for="endDatePicker">Choose Ending date</label>
        <b-form-datepicker
          id="endDatePicker"
          v-model="endDate"
          :min="minEnd"
          :max="maxEnd"
          locale="en"
        ></b-form-datepicker>
      </b-col>
    </b-row>
    <b-row>
      <b-button
        @click="getAllEvents()"
        variant="outline-primary"
        class="mt-2 ml-3"
        >See Appointments</b-button
      >
    </b-row>
    <b-row>
      <div v-for="event in events" :key="event.timestamp">
        <b-card
          :header="eventTimeFormater(event.date, event.startTime)"
          header-tag="header"
          :footer="event.email"
          footer-tag="footer"
          :title="event.name"
          border-variant="info"
        >
          <b-card-text
            >Appointment Duration: {{ event.duration }} minutes</b-card-text
          >
        </b-card>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import axios from "axios";
import moment from "moment-timezone";
export default {
  name: "EventRange",
  data() {
    return {
      startDate: "",
      endDate: "",
      minEnd: "",
      maxEnd: "",
      events: [],
      eventTime: "",
    };
  },
  watch: {
    startDate(newV) {
      this.minEnd = new Date(newV);
    },
  },
  methods: {
    async getAllEvents() {
      let result = await axios
        .get(
          `http://localhost:3000/api/getEvents?startDate=${this.startDate}&endDate=${this.endDate}`
        )
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
      this.events = result;
    },
    eventTimeFormater(eventDate, eventTime) {
      return eventDate + " " + moment(new Date(eventTime)).format("HH:mm");
    },
  },
};
</script>
<style scoped>
h2,
label {
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  color: #b393d0;
  text-transform: uppercase;
}
</style>
