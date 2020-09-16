import { LightningElement, api } from "lwc";
// import MONDAY_START from '@salesforce/schema/Booking_Type__c.Monday_Start_Time__c';
// import MONDAY_END from '@salesforce/schema/Booking_Type__c.Monday_End_Time__c';
import { generateBookingSlots } from "c/bookingService";

export default class BookingTypeSettings extends LightningElement {
  @api bookingTypeId;

  startdate;
  enddate;
  hasError = false;
  errorMessage = "";
  objectApiName = "Booking_Type__c";

  handlePopulateSlotsClick(event) {
    console.log("=======handlePopulateSlotsClick====");
    this.hasError = false;
    this.errorMessage = "";
    //if (this.validateDates()) {
    console.log("Validated inputs");
    generateBookingSlots(this.bookingTypeId, this.startdate, this.enddate).then(
      (result) => {
        if (result.error === "OK") {
          console.log("==== solts populated successfully====");
          console.log("===== num of slots populated ====");
        }
      }
    );
    //}
  }

  handleFormInputChange(event) {
    this[event.target.name] = event.target.value;
  }

  checkInputFilled(inputname) {
    let returnvalue;
    let inputCmp = this.template.querySelector(inputname);

    if (inputCmp.value === "") {
      inputCmp.setCustomValidity("Field is Required!");
      inputCmp.reportValidity();
      returnvalue = false;
    } else {
      inputCmp.setCustomValidity("");
      returnvalue = true;
    }

    return returnvalue;
  }

  validateDates() {
    var fdsvalidates =
      this.validateDates(".inputStart") && this.checkInputFilled(".inputEnd");

    if (!fdsvalidates) {
      return false;
    }

    let dateStart = new Date(this.startdate);
    let dateEnd = new Date(this.enddate);
    let inputCmp = this.template.querySelector(".inputEnd");
    if (dateEnd < dateStart) {
      inputCmp.setCustomValidity("Start Date must be before End Date");
      inputCmp.reportValidity();

      return false;
    } else {
      inputCmp.setCustomValidity("");
      return true;
    }
  }

  handleSubmit(event) {
    // event.preventDefault();
    // const fields = event.detail.fields;
  }
}