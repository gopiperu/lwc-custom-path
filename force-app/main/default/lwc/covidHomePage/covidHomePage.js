import { LightningElement } from "lwc";

export default class CovidHomePage extends LightningElement {
  handleTakeAssessmentClick(event) {
    window.open(
      "https://vlocityps10-154826750bc-16b7-171ac18b149.force.com/s/covid19-self-assessment"
    );
  }
}