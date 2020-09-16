import getBookingSlots from "@salesforce/apex/BookingService.getBookingSlots";
import bookingSlot from "@salesforce/apex/BookingService.bookingSlot";
import cr from "@salesforce/apex/BookingService.contactRegister";
import gbt from "@salesforce/apex/BookingService.getBookingTypes";
import bsd from "@salesforce/apex/BookingService.getSlotDetails";
import updateBSC from "@salesforce/apex/BookingService.updateBookingSlotContact";
import uss from "@salesforce/apex/BookingService.updateSlotStatus";
import bib from "@salesforce/apex/BookingService.getBookingInfoByContact";
import cb from "@salesforce/apex/BookingService.cancelBooking";
import gslots from "@salesforce/apex/BookingAdminService.generateBookingSlots";
import bc from "@salesforce/apex/BookingService.getConfig";

const getBookingTimeSlots = (typeId, startDate, endDate) => {
  console.log("==== booking service getBookingTimeSlots ===");
  var startDateTime = startDate || "";
  let pm = getBookingSlots({
    startDate: startDateTime,
    endDate: endDate,
    bookingTypeId: typeId
  });
  return pm;
};

const updateSlot = (id, contactId, bookingTypeId) => {
  console.log("==== booking service getBookingTimeSlots ===");
  return bookingSlot({
    slotId: id,
    contactId: contactId,
    bookingTypeId: bookingTypeId
  });
};

const contactRegister = (fname, lname, mobile, email, typeId) => {
  console.log("==== booking service contactRegister ===");
  return cr({
    firstName: fname,
    lastName: lname,
    mobilePhone: mobile,
    email: email,
    typeId: typeId
  });
};

const getBookingTypes = () => {
  console.log("==== booking service getBookingTypes ===");
  let pm = gbt();
  return pm;
};

const getBookingSlotDetails = (slotId) => {
  return bsd({ slotId: slotId });
};

const updateBookingSlotContact = (input) => {
  return updateBSC({ input: input });
};

const updateSlotStatus = (slotId, status) => {
  return uss({ slotId: slotId, status: status });
};

const getBookingInfoByContact = (email, phone, confirmCode) => {
  return bib({ mobilePhone: phone, email: email, confirmCode: confirmCode });
};

const cancelBooking = (bookingId) => {
  return cb({ bookingId: bookingId });
};

const generateBookingSlots = (bookingTypeId, startDate, endDate) => {
  return gslots({
    bookingTypeId: bookingTypeId,
    startDate: startDate,
    endDate: endDate,
    deleteOldSlots: true
  });
};

const getConfig = (bookingTypeId) => {
  return bc({ bookingTypeId: bookingTypeId });
};

export {
  getBookingTimeSlots,
  updateSlot,
  contactRegister,
  getBookingTypes,
  getBookingSlotDetails,
  updateBookingSlotContact,
  updateSlotStatus,
  getBookingInfoByContact,
  cancelBooking,
  generateBookingSlots,
  getConfig
};