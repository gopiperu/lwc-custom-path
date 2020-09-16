import { LightningElement, track } from 'lwc';
import updateRegisteredEvent from '@salesforce/apex/EventRegistrationController.updateRegisteredEvent';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
 

export default class CancelEventRegistration extends LightningElement {
@track ID;
@track Seats_Booked__c;
@track Registration_Status__c;
confirmationcode;
email;
secondconfirmation = false;
confirmation=true;
canceled = false;
errorincancelation = false;
cancelregisterbutton = true;
navigateback;

/*@wire(updateRegisteredEvent , { registrationId: this.confirmationcode,
    emailid: this.email })
    wiredRecord({ error, data }) {
        if (data) {
            this.data  = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.data  = undefined;
        }
      //  this.tableLoadingState  = false;
    }*/

cancelRegistration(event){
   this.cancelregisterbutton = false;
   this.confirmation = true;
}

handleCodeChange(event){
    //this.recordId = undefined;
        this.confirmationcode = event.target.value;
        
}
handleEmailChange(event){
        this.email = event.target.value;
        
}

updateRegistration(){
    
    updateRegisteredEvent({registrationId: this.confirmationcode,
                           emailid: this.email})
                           .then(result =>{
                               if(result=='success'){
                                this.canceled = true;
                                this.confirmation = false;
                               } else{
                                   this.errorincancelation = true;
                                   this.confirmation = false;
                               }
                               this.registeredrecorddetails = result;
                               
                           });
          // alert("result from apex after cancelation" +JSON.stringify(this.registeredrecorddetails));
            
            
         //   this.showToast(this.registeredrecorddetails);
            
       

}

handleback(event){
    this.canceled = false;
    this.errorincancelation = false;
  //  this.cancelregisterbutton = true;
    this.navigateback = true;
    const backEvent = new CustomEvent('back', {detail: this.navigateback});
    this.dispatchEvent(backEvent);
}

/*showToast(){
            const toastevent = new ShowToastEvent({
                title: 'Success',
                message: 'Booking canceled successfully. Thank you!',
                variant: 'SUCCESS',
                mode: 'sticky',
            });
            this.dispatchEvent(toastevent);
    
}*/
   /* if(this.registeredrecorddetails.Id != null){
        this.recordid = this.registeredrecorddetails.Id;
        this.firstname = this.registeredrecorddetails.First_name__c;
        this.lastname = this.registeredrecorddetails.Last_name__c;
        this.noofseats = this.registeredrecorddetails.Seats_Booked__c;
        this.confirmation = false;
        this.secondconfirmation = true;

    }*/

}

/*cancelRegistration(){
    this.secondconfirmation = false;
    let record = {
        fields: {
            Id: this.recordId,
            Seats_Booked__c: 0,
            Registration_Status__c: 'Canceled'
        },
    };
    updateRecord(record)
        // eslint-disable-next-line no-unused-vars
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Record Is Updated',
                    variant: 'sucess',
                }),
            );
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error on data save',
                    message: error.message.body,
                    variant: 'error',
                }),
            );
        });
}*/