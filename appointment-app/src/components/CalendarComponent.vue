<template>
  <b-container aligh-h="center" class="m-5" id="container">
    <b-row>
      <b-col md="auto">
        <b-calendar
          v-model="value"
          @context="onContext"
          locale="en-US"
          :date-disabled-fn="dateDisabled"
          selected-variant="success"
          today-variant="info"
          nav-button-variant="primary"
          class="border rounded p-2"
        ></b-calendar>
      </b-col>
      <b-col>
        <h4>Book your slot</h4>
        <b-row>
          <div v-for="slot in slots" :key="slot">
            <b-button
              class="m-3"
              v-on:click="onSlotSelect(`${slot}`)"
              variant="outline-info"
              v-b-modal="'value' + slot"
              >{{ slot }}</b-button
            >
            <b-modal
              :id="'value' + slot"
              ref="modal"
              :title="'Book an Appointment for ' + time"
              @show="resetModal"
              @hidden="resetModal"
              @ok="handleOk"
            >
              <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                  :class="{ 'form-group--error': $v.name.$error }"
                  label="Name"
                  label-for="name-input"
                  invalid-feedback="Name is required"
                  :state="nameState"
                >
                  <b-form-input
                    id="name-input"
                    v-model.trim="name"
                    type="text"
                    :state="nameState"
                    required
                  ></b-form-input>
                  <div class="error" v-if="!$v.name.required">
                    Field is required
                  </div>
                  <div class="error" v-if="!$v.name.minLength">
                    Name must have at least
                    {{ $v.name.$params.minLength.min }} letters.
                  </div>
                </b-form-group>
                <b-form-group
                  label="Email"
                  :class="{ 'form-group--error': $v.email.$error }"
                  label-for="email-input"
                  invalid-feedback="Email is required"
                  :state="emailState"
                >
                  <b-form-input
                    id="name-input"
                    v-model.trim="email"
                    :state="emailState"
                    type="email"
                    required
                  ></b-form-input>
                  <div class="error" v-if="!$v.email.required">
                    Field is required
                  </div>
                  <div class="error" v-if="!$v.email.email">
                    Email is invalid
                  </div>
                </b-form-group>
                <b-form-group
                  label="Duration"
                  label-for="duration-input"
                  :state="durationState"
                >
                  <b-form-spinbutton
                    id="duration-input"
                    v-model="duration"
                    min="30"
                    max="120"
                    step="30"
                    placholder="mins"
                    inline
                  ></b-form-spinbutton>
                </b-form-group>
              </form>
            </b-modal>
          </div>
        </b-row>
      </b-col>
      <b-col cols="2"></b-col>
    </b-row>
    <b-row>
      <b-col cols="2" class="mt-3">
        <label for="timezone-selector"> Select Timezone </label>
      </b-col>
      <b-col cols="5">
        <b-form-select
          id="tiemzone-selector"
          v-model="selectedTimeZone"
          :options="timezones"
          @click="handleSlots()"
          class="mt-2"
        ></b-form-select>
      </b-col>
    </b-row>
    <EventRange class="mt-5" />
  </b-container>
</template>

<script>
import axios from "axios";
import moment from "moment-timezone";
import EventRange from "./EventRange.vue";
import { required, minLength, email } from "vuelidate/lib/validators";
export default {
  name: "CalendarComponent",
  data() {
    return {
      value: moment().format("YYYY-MM-DD"),
      time: "",
      selectedTimeZone: "Asia/Calcutta",
      selectedTimestamp: "",
      timezones: [],
      context: null,
      events: [],
      slots: [],
      name: "",
      nameState: null,
      duration: 30,
      durationState: null,
      email: "",
      emailState: null,
    };
  },
  validations: {
    name: {
      required,
      minLength: minLength(4),
    },
    email: {
      required,
      email,
    },
  },
  components: {
    EventRange,
  },
  async beforeMount() {
    let currDate = moment().format("YYYY-MM-DD");
    this.slots = await this.getSlots(currDate, this.selectedTimeZone);
    this.getTimezones();
  },
  watch: {
    async selectedTimeZone(newV) {
      this.slots = await this.getSlots(this.value, newV);
    },
  },
  methods: {
    async onContext(ctx) {
      this.context = ctx;

      this.slots = await this.getSlots(
        this.context.selectedYMD,
        this.selectedTimeZone
      );
    },
    dateDisabled(ymd, date) {
      const weekday = date.getDay();
      return weekday === 0;
    },
    onSlotSelect(e) {
      this.time = e;
      let timestamp = `${this.value}T${e}:00`;
      this.selectedTimestamp = timestamp;
    },
    async getSlots(date, timezone) {
      let availableSlots = [];
      availableSlots = await axios
        .get(
          `http://localhost:3000/api/slots?date=${date}&timezone=${timezone}`
        )
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          console.log(err);
        });
      return availableSlots;
    },
    getTimezones() {
      let ary = Intl.supportedValuesOf("timeZone");
      this.timezones = ary;
      return ary;
    },
    checkFormValidity() {
      return this.error;
    },
    resetModal() {
      this.name = "";
      this.email = "";
      this.nameState = null;
    },
    async handleSlots() {
      this.slots = await this.getSlots(this.value, this.selectedTimeZone);
    },
    handleOk(bvModalEvent) {
      if (this.$v.$invalid) {
        bvModalEvent.preventDefault();
      } 
      else {
        this.handleSubmit();
      }
    },
    async handleSubmit() {
      let event = {
        startTime: moment
          .tz(this.selectedTimestamp, this.selectedTimeZone)
          .format(),
        slot: this.duration,
        date: this.value,
        name: this.name,
        email: this.email,
      };
       await axios
        .post("http://localhost:3000/api/createEvent", event)
        .then((res) => {
          this.$bvToast.toast("Your slot has been successfully booked", {
            title: res.data.message,
            variant: "success",
            autoHideDelay: 3000,
          });
        })
        .catch((err) => {
          this.$bvToast.toast(err.response.data.message, {
            title: "Error",
            variant: "danger",
            autoHideDelay: 3000,
          });
        });
      this.slots = await this.getSlots(this.value, this.selectedTimeZone);
      this.$nextTick(() => {
        this.$bvModal.hide("modal-prevent-closing");
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h4 {
  font-family: "Roboto", sans-serif;
  font-weight: 700;
  color: #b393d0;
  text-transform: uppercase;
}
#container {
  border: 2px groove #b393d3;
  border-radius: 5px;
  margin-top: 15px;
  margin-bottom: 15px;
}
.error {
  color: red;
}
</style>
