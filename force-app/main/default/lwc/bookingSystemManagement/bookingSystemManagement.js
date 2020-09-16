import { LightningElement, track } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { getBookingTypes } from "c/bookingService";
import { loadScript, loadStyle } from "lightning/platformResourceLoader";
import resourceCal from "@salesforce/resourceUrl/fullcalendar";
import {
  getBookingTimeSlots,
  getBookingSlotDetails,
  updateBookingSlotContact,
  updateSlotStatus
} from "c/bookingService";

import {
  showSuccessBooking,
  showFailedMsg,
  showSuccessMsg
} from "c/bookingUtils";
import TwilioSF__Archived__c from "@salesforce/schema/TwilioSF__Message__c.TwilioSF__Archived__c";

export default class BookingSystemManagement extends NavigationMixin(
  LightningElement
) {
  bookingTypes;
  scriptInitialized;
  calendar;
  calendarEl;
  selectedTypeId;
  @track
  bookingSlots = [];
  isModalOpen;
  isSettingModalOpen = false;
  @track draftValues = [];
  @track bookingSlotContactData = [];
  canDisable;
  toggleDisableLabel;

  COLS = [
    { label: "Name", fieldName: "Name" },
    { label: "Phone", fieldName: "Phone", type: "phone" },
    { label: "Email", fieldName: "Email", type: "email" },
    {
      label: "Cancelled",
      fieldName: "Cancelled",
      type: "boolean",
      editable: true
    },
    {
      label: "Processed",
      fieldName: "Processed",
      type: "boolean",
      editable: true
    }
  ];

  get hasBookingTypeSelected() {
    return !this.selectedTypeId;
  }
  navigateToRecordEdit() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: {
        recordId: this.selectedTypeId,
        objectApiName: "Booking_Type__c",
        actionName: "edit"
      }
    });
  }

  handleBookingSlotContactLineEditSaveClick(event) {
    console.log("==== handleSaveClick===" + JSON.stringify(event));
    var self = this;
    let input = JSON.stringify(event.detail.draftValues);
    updateBookingSlotContact(input).then((result) => {
      if (result.error === "OK") {
        this.loadBookingSlotContactData();
        showSuccessBooking(
          self,
          "Successfully Updated",
          "Successfully Updated."
        );
        this.refreshTimeSlots();
      }
    });
  }

  handleToggleDisableSlotClick(event) {
    console.log("=== handleDisableSlotClick====");
    console.log(event.target.label);
    var self = this;
    let status = "";
    if (event.target.label === "Disable the slot") {
      status = "Disabled";

      updateSlotStatus(this.currentSlot.id, status).then((result) => {
        if (result.error === "OK") {
          this.refreshTimeSlots();
          this.toggleDisableLabel = "Enable the slot";
          showSuccessMsg(self, "Successful", "Successfully disabled the slot.");
        }
      });
    } else {
      status = "Available";
      updateSlotStatus(this.currentSlot.id, status).then((result) => {
        if (result.error === "OK") {
          this.refreshTimeSlots();
          this.toggleDisableLabel = "Disable the slot";
          showSuccessMsg(self, "Successful", "Successfully enabled the slot.");
        }
      });
    }
  }

  connectedCallback() {
    getBookingTypes().then((result) => {
      this.bookingTypes = result.map((item) => {
        return { value: item.Id, label: item.Name };
      });
    });
    this.isModalOpen = false;
  }
  renderedCallback() {
    console.log("====== renderedCallback====");

    if (this.scriptInitialized) {
      return;
    }
    this.scriptInitialized = true;

    Promise.all([
      loadStyle(this, resourceCal + "/core/main.css"), //modified by zeeman don't replace it. event font
      loadStyle(this, resourceCal + "/daygrid/main.min.css"),
      loadStyle(this, resourceCal + "/timegrid/main.css"), //modified by zeeman don't replace it. time slot size
      loadScript(this, resourceCal + "/core/main.js") //modified by zeeman don't replace it.
    ])
      .then(() => {
        console.group("=== loaded css and calendar mainjs===");
        console.log("==== loadscript === daygrid JS");
        return loadScript(this, resourceCal + "/daygrid/main.min.js");
      })
      .then((script) => {
        console.log("==== loadscript === timegrid JS");
        return loadScript(this, resourceCal + "/timegrid/main.min.js");
      })
      .then((script) => {
        console.log("==== loadscript === interaction JS");
        console.groupEnd();
        return loadScript(this, resourceCal + "/interaction/main.min.js");
      })
      .then(() => {
        this.initialiseFullCalendar();
      });
  }

  initialiseFullCalendar() {
    var self = this;

    this.calendarEl = this.template.querySelector("div.fullcalendar");

    this.calendar = new FullCalendar.Calendar(this.calendarEl, {
      plugins: ["interaction", "dayGrid", "timeGrid"],
      header: {
        left: "prev,next,today",
        center: "title"
      },
      defaultView: "timeGridWeek",
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
      maxTime: "17:00:00",
      height: 650,
      customButtons: {
        prev: {
          text: "Prev",
          click: function () {
            //self.handlePrevButtonClick()

            self.calendar.prev();

            console.log("view type: " + self.calendar.view.type);
            console.log(
              "First Day after click " + self.calendar.view.currentStart
            );
          }
        },
        next: {
          text: "Next",
          click: function () {
            //self.handleNextButtonClick()

            console.log(
              "First Day before click===" + self.calendar.view.currentStart
            );

            console.log(
              "End Day before click===" + self.calendar.view.currentEnd
            );

            self.calendar.next();

            console.log(
              "End Day after click===" + self.calendar.view.currentStart
            );

            console.log(
              "End Day before click===" + self.calendar.view.currentEnd
            );
          }
        }
      }
    });
    this.calendar.render();
  }

  refreshTimeSlots() {
    if (this.selectedTypeId) {
      this.calendar.removeAllEvents();
    }
    var start = new Date().toISOString();

    getBookingTimeSlots(this.selectedTypeId, start).then((result) => {
      console.log("===get time slots ====" + JSON.stringify(result));
      let slots = [];
      console.log("===result===" + JSON.stringify(result));

      if (result) {
        for (var i = 0; i < result.length; i++) {
          slots.push({
            title: result[i].title + "(" + result[i].count + " booked)",
            id: result[i].id,
            start: new Date(result[i].startStr),
            end: new Date(result[i].endStr),
            borderColor: result[i].borderColor,
            backgroundColor: result[i].backgroundColor,
            textColor: result[i].textColor,
            allDay: false,
            extendedProps: {
              typeName: result[i].typeName,
              slotStatus: result[i].status
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

  handleBookingTypeChange(event) {
    this.selectedTypeId = event.target.value;
    console.log("===seleced Type Id ===" + this.selectedTypeId);
    this.refreshTimeSlots();
  }

  handleSlotClick(info) {
    this.openModal();

    console.log("===handleSlotClick===");
    console.log(info);
    this.currentSlot = info.event;
    this.currentSlot.startStr =
      this.currentSlot.start.toDateString() +
      " " +
      this.currentSlot.start.toTimeString().substring(0, 8);
    this.currentSlot.endStr =
      this.currentSlot.end.toDateString() +
      " " +
      this.currentSlot.end.toTimeString().substring(0, 8);

    if (this.currentSlot.extendedProps.slotStatus === "Disabled") {
      this.toggleDisableLabel = "Enable the slot";
      this.canDisable = true;
    } else if (this.currentSlot.extendedProps.slotStatus === "Full") {
      this.canDisable = false;
    } else {
      this.toggleDisableLabel = "Disable the slot";
      this.canDisable = true;
    }
    this.loadBookingSlotContactData();
  }

  loadBookingSlotContactData() {
    getBookingSlotDetails(this.currentSlot.id).then((result) => {
      console.log("===getBookingSlotDetails===" + JSON.stringify(result));
      this.draftValues = [];

      this.bookingSlotContactData = result.map((item) => {
        return {
          Id: item.Id,
          Name: item.Contact__r.Name,
          Phone: item.Contact__r.MobilePhone,
          Email: item.Contact__r.Email,
          Cancelled: item.Cancelled__c,
          Processed: item.Processed__c
        };
      });
      console.log(
        "===this.bookingSlotContactData====" +
          JSON.stringify(this.bookingSlotContactData)
      );
    });
  }

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  openSettingModal() {
    this.isSettingModalOpen = true;
  }
  closeSettingModal() {
    this.isSettingModalOpen = false;
  }
}