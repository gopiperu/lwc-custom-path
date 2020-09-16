import { LightningElement, track, wire } from "lwc";
import {
  contactRegister,
  getBookingTypes,
  getBookingInfoByContact,
  cancelBooking
} from "c/bookingService";
import { showSuccessMsg, showFailedMsg } from "c/bookingUtils";

export default class BookingRegistrationComponent extends LightningElement {
  lastName;
  firstName;
  mobilePhone;
  email;
  MMAEmail;
  MMAPhone;
  MMAConfirmCode;
  MMAerror;
  MMAStartTime;
  MMAEndTime;
  MMABookingType;
  MMAId;
  showCalendar = false;
  showInstructionStep = false;
  showContactInfoStep = false;
  showlandingPage = true;
  showManageMyAppointmentConfirmPage = false;
  showMMABookingDetailPage = false;
  selectedTypeId;
  selectedTypeName;
  @track bookingTypes = [];

  connectedCallback() {
    getBookingTypes().then(result => {
      var optlist = [];
      result.forEach(item => {
        optlist.push({ label: item.Name, value: item.Id });
      });

      this.bookingTypes = optlist;
    });
  }

  handleTypeChange(event) {
    console.log("===Selected value: ===" + event.target.value);
    this.selectedTypeId = event.target.value;
    if (this.selectedTypeId) {
      this.bookingTypes.forEach(item => {
        if (item.value === this.selectedTypeId) {
          this.selectedTypeName = item.label;
        }
      });
    }
    console.log("====selected type name ===" + this.selectedTypeName);

    //this.selectedTypeName = event.target
  }
  handleNextClick(event) {
    if (this.selectedTypeId) {
      this.showlandingPage = false;
      this.showContactInfoStep = true;
    } else {
      alert("Please select a booking type.");
    }
  }

  handleContactInputChange(event) {
    const fieldName = event.target.fieldName;
    console.log("===fieldName ===" + fieldName);
    if (fieldName == "FirstName") {
      this.lastName = event.target.value;
    } else if (fieldName == "LastName") {
      this.firstName = event.target.value;
    } else if (fieldName == "MobilePhone") {
      this.mobilePhone = event.target.value;
    } else if (fieldName == "Email") {
      this.email = event.target.value;
    }
  }

  handleBookingClick(event) {
    console.log("==== handleBookingClick===");

    contactRegister(
      this.firstName,
      this.lastName,
      this.mobilePhone,
      this.email,
      this.selectedTypeId
    ).then(result => {
      console.log(
        "===== handleBookingClick result ===" + JSON.stringify(result)
      );
      if (result && result.contactId) {
        this.contactId = result.contactId;
        this.showCalendar = true;
        this.showContactInfoStep = false;
      }
    });
  }

  handleMMAInputChange(event) {
    const fieldName = event.target.name;
    console.log("===fieldName ===" + fieldName);
    if (fieldName === "Email") {
      this.MMAEmail = event.target.value;
    } else if (fieldName === "Phone") {
      this.MMAPhone = event.target.value;
    } else if (fieldName == "ConfirmCode") {
      this.MMAConfirmCode = event.target.value;
    }
  }

  handleManageMyAppointmentClick(event) {
    console.log("=== handleManageMyAppointmentClick ===");
    console.log(event);

    this.showManageMyAppointmentConfirmPage = true;
    this.showlandingPage = false;
  }

  handleMMAConfirmPageNextClick(event) {
    console.log("=== handleMMAConfirmPageNextClick ===");
    console.log(event);
    this.MMAerror = "";
    if (this.MMAEmail || this.MMAPhone) {
      if (this.MMAConfirmCode) {
        getBookingInfoByContact(
          this.MMAEmail,
          this.MMAPhone,
          this.MMAConfirmCode
        ).then(result => {
          if (result.error === "OK") {
            console.log("==== result.slot===" + JSON.stringify(result.infos));
            this.MMAId = result.infos.Id;
            this.MMAStartTime = result.infos.StartTime;
            this.MMAEndTime = result.infos.EndTime;
            this.MMABookingType = result.infos.BookingType;
            this.showMMABookingDetailPage = true;
            this.showManageMyAppointmentConfirmPage = false;
          } else {
            this.MMAerror = result.error;
          }
        });
      } else {
        this.MMAerror = "Confirmation Code is required.";
      }
    } else {
      this.MMAerror = "Please type in Email or Mobile Phone.";
    }
  }

  handleManageMyAppointmentCancelClick(event) {
    console.log("===== handleManageMyAppointmentCancelClick =====");
    console.log("=== id ===" + event.target.getAttribute("data-id"));

    let bookingId = event.target.getAttribute("data-id");

    if (bookingId && confirm("Are you sure to cancel this appointment?")) {
      cancelBooking(bookingId).then(result => {
        if (result.error === "OK") {
          showSuccessMsg(
            this,
            "Successful",
            "Your appointment has been Cancelled."
          );
          this.showMMABookingDetailPage = false;
          this.showlandingPage = true;
        } else {
          showFailedMsg(this, "Cancellation failed", "Cancellation failed");
        }
      });
    }
  }
}