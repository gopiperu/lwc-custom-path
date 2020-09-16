import { LightningElement } from "lwc";

export default class CovidStatus extends LightningElement {
  todayDate;

  connectedCallback() {
    this.todayDate = new Date()
      .toString()
      .split(" ")
      .splice(1, 3)
      .join(" ");
  }
}