import { ShowToastEvent } from "lightning/platformShowToastEvent";

const showSuccessBooking = (cmp, title, message) => {
  const evt = new ShowToastEvent({
    title: title || "Booking successful",
    message: message || "Booking successful",
    variant: "success",
    mode: "dismissable"
  });
  cmp.dispatchEvent(evt);
};

const showFailedMsg = (cmp, title, message) => {
  const evt = new ShowToastEvent({
    title: title || "Booking failed",
    message: message || "Booking failed",
    variant: "error",
    mode: "dismissable"
  });
  cmp.dispatchEvent(evt);
};
const showSuccessMsg = (cmp, title, message) => {
  const evt = new ShowToastEvent({
    title: title,
    message: message,
    variant: "success",
    mode: "dismissable"
  });
  cmp.dispatchEvent(evt);
};
export { showSuccessBooking, showFailedMsg, showSuccessMsg };