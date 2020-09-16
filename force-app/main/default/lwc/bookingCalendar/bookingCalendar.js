import { track, api, LightningElement } from "lwc";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";

import { NavigationMixin } from "lightning/navigation";
import resourceCal from "@salesforce/resourceUrl/fullcalendar";
import { getBookingTimeSlots, updateSlot } from "c/bookingService";
import { showSuccessBooking, showFailedMsg } from "c/bookingUtils";
import FORM_FACTOR from "@salesforce/client/formFactor";
export default class BookingCalendar extends NavigationMixin(LightningElement) {
  @track calendar;
  @track calendarEl;
  @track currentSlot;
  @track events;
  scriptInitialized;
  @track bookingSlots;
  isModalOpen;
  @api contactId;
  @api typeId;
  @api typeName;
  defaultCalenderView =
    FORM_FACTOR === "Small" ? "timeGridDay" : "timeGridWeek";
  renderedCallback() {
    console.log("====== renderedCallback====");
  }

  connectedCallback() {
    console.log("====== connectedCallback====");
    console.log("====== api contactid ====" + this.contactId);
    if (this.scriptInitialized) {
      return;
    }
    this.scriptInitialized = true;
    if (this.UITheme) {
      if (this.UITheme !== "Theme4t" || this.UITheme !== "Theme4d") {
        this.isLightning = false;
      }
    }

    Promise.all([
      loadStyle(this, resourceCal + "/core/main.css"),
      loadStyle(this, resourceCal + "/daygrid/main.css"),
      loadStyle(this, resourceCal + "/timegrid/main.css"),
      loadScript(this, resourceCal + "/core/main.js")
    ])
      .then(() => {
        console.group("=== loaded css and calendar mainjs===");
        console.log("==== loadscript === daygrid JS");
        return loadScript(this, resourceCal + "/daygrid/main.js");
      })
      .then((script) => {
        console.log("==== loadscript === timegrid JS");
        return loadScript(this, resourceCal + "/timegrid/main.js");
      })
      .then((script) => {
        console.log("==== loadscript === interaction JS");
        console.groupEnd();
        return loadScript(this, resourceCal + "/interaction/main.js");
      })
      .then(() => {
        console.log("==== booking type id in calendar ==== " + this.typeId);

        getBookingTimeSlots(this.typeId)
          .then((result) => {
            let slots = [];
            console.log("===result===" + JSON.stringify(result));
            let numOfLeft = 0;
            let title = "";

            if (result) {
              for (var i = 0; i < result.length; i++) {
                numOfLeft =
                  (result[i].maxBookingNumber || 10) - result[i].count;
                if (result[i].status === "Available") {
                  title = result[i].title + "(" + numOfLeft + " left)";
                } else {
                  title = result[i].title;
                }
                slots.push({
                  title: title,
                  id: result[i].id,
                  start: new Date(result[i].startStr),
                  end: new Date(result[i].endStr),
                  borderColor: result[i].borderColor,
                  backgroundColor: result[i].backgroundColor,
                  textColor: result[i].textColor,
                  allDay: false,
                  extendedProps: {
                    typeName: result[i].typeName,
                    slotStatus: result[i].status,
                    count: result[i].count,
                    maxBookingNumber: result[i].maxBookingNumber
                  }
                });
              }
            }
            this.bookingSlots = slots;
            this.isModalOpen = false;
            return slots;
          })
          .then((slots) => {
            this.initialiseFullCalendar();
          });
      });
  }

  initialiseFullCalendar() {
    var self = this;

    this.calendarEl = this.template.querySelector("div.fullcalendar");

    this.calendar = new FullCalendar.Calendar(this.calendarEl, {
      plugins: ["interaction", "dayGrid", "timeGrid"],
      header: {
        left: "",
        center: "title",
        right: "prev,next,today"
      },
      defaultView: this.defaultCalenderView,
      selectable: true,
      allDaySlot: false,
      eventStartEditable: false,
      eventDurationEditable: false,
      eventClick: function (info) {
        // eslint-disable-next-line no-console
        console.log("eventClick : ", info);
        self.handleSlotClick(info);
      },
      businessHours: [
        // specify an array instead
        {
          daysOfWeek: [1, 2, 3, 4], // Monday, Tuesday, Wednesday
          startTime: "08:30:00", // 8am
          endTime: "16:00:00" // 4pm
        },
        {
          daysOfWeek: [5], // Thursday, Friday
          startTime: "09:00", // 10am
          endTime: "12:00" // 4pm
        },
        {
          daysOfWeek: [6], // Thursday, Friday
          startTime: "12:00", // 10am
          endTime: "16:00" // 4pm
        }
      ],
      //startTime: "09:00", // a start time (10am in this example)
      //endTime: "18:00", // an end time (6pm in this example)
      minTime: "08:00:00",
      maxTime: "16:00:00",
      events: self.bookingSlots
    });
    this.calendar.render();
  }

  refreshCalendar() {
    this.calendar.removeAllEvents();

    getBookingTimeSlots(this.typeId).then((result) => {
      let slots = [];
      console.log("===result===" + JSON.stringify(result));
      let numOfLeft = 0;
      let title = "";

      if (result) {
        for (var i = 0; i < result.length; i++) {
          numOfLeft = (result[i].maxBookingNumber || 10) - result[i].count;
          if (result[i].status === "Available") {
            title = result[i].title + "(" + numOfLeft + " left)";
          } else {
            title = result[i].title;
          }
          slots.push({
            title: title,
            id: result[i].id,
            start: new Date(result[i].startStr),
            end: new Date(result[i].endStr),
            borderColor: result[i].borderColor,
            backgroundColor: result[i].backgroundColor,
            textColor: result[i].textColor,
            allDay: false,
            extendedProps: {
              typeName: result[i].typeName,
              slotStatus: result[i].status,
              count: result[i].count,
              maxBookingNumber: result[i].maxBookingNumber
            }
          });
        }
      }
      if (slots.length > 0) {
        slots.forEach((item) => {
          this.calendar.addEvent(item);
        });
      }

      this.bookingSlots = slots;
    });
  }

  handleSlotClick(info) {
    console.log("===handleSlotClick===");
    console.log(info);
    if (info.event.extendedProps.slotStatus === "Available") {
      this.currentSlot = info.event;
      this.currentSlot.startStr =
        this.currentSlot.start.toDateString() +
        " " +
        this.currentSlot.start.toTimeString().substring(0, 8);
      this.currentSlot.endStr =
        this.currentSlot.end.toDateString() +
        " " +
        this.currentSlot.end.toTimeString().substring(0, 8);

      this.openModal();
    } else {
      this.currentSlot = null;
    }
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }

  handleSubmitBooking() {
    console.log("==== handleSubmitBooking=====");
    let self = this;

    updateSlot(this.currentSlot.id, this.contactId, this.typeId).then(
      (result) => {
        console.log("===booking slot===" + JSON.stringify(result));
        if (result) {
          if (result.error === "OK") {
            if (result.isFull && result.isFull === "true") {
              self.currentSlot.setProp("backgroundColor", "WhiteSmoke");
              self.currentSlot.setProp("title", "Full");
              self.currentSlot.setProp("borderColor", "red");
            }

            self.refreshCalendar();

            showSuccessBooking(self);
            self.isModalOpen = false;
          } else {
            if (result.isFull && result.isFull === "true") {
              self.currentSlot.setProp("backgroundColor", "WhiteSmoke");
              self.currentSlot.setProp("title", "Full");
              self.currentSlot.setProp("borderColor", "red");
            }
            self.refreshCalendar();
            showFailedMsg(self, "Booking Failed", result.error);
            self.isModalOpen = false;
          }
        }
      }
    );
  }
}