import { LightningElement, api } from 'lwc';

export default class EventRegisterDetails extends LightningElement {

    @api event;

    handleRegisterClick(event){
        event.preventDefault();
        const selectedEvent = new CustomEvent('selected', {detail: this.event.Id});
        this.dispatchEvent(selectedEvent);

    }

}