import { LightningElement, track, api, wire } from 'lwc';
import getEvents from '@salesforce/apex/EventRegistrationController.getEvents';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class EventRegister extends LightningElement {
    registrationdetails;
    registrationid;
    fields;
    confirmedid;
    showregisterform = false;
    showeventinformation = true;
    currenteventid;
    events;
    error;
    eventdetailfields;
    showmodalbox = false;
    showexitmodalbox = false;
    registrationstatus;
    confirmedseats;
    waitlistseats;
    confirmbooking = false;
    waitlistbooking = false;
    showspinner = false;
    navigateback;
   // @wire(getEvents) events;
   @track page = 1; //this will initialize 1st page
   @track items = []; //it contains all the records.
   @track data = []; //data to be display in the table
   @track columns; //holds column info.
   @track startingRecord = 1; //start record position per page
   @track endingRecord = 0; //end record position per page
   @track pageSize = 2; //default value we are assigning
   @track totalRecountCount = 0; //total record count received from all retrieved records
   @track totalPage = 0; //total number of page is needed to display all records

   @wire(getEvents)
  

   wiredEvents({error, data}){
        if(data){
            this.items=data;
            this.totalRecountCount = data.length;
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize);
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;

            this.error = undefined;
        } else if(error){
            this.error=error;
            this.data=undefined;
        }
        
    }

    //clicking on previous button this method will be called
    previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1; //decrease page by 1
            this.displayRecordPerPage(this.page);
        }
    }

    //clicking on next button this method will be called
    nextHandler() {
        if((this.page<this.totalPage) && this.page !== this.totalPage){
            this.page = this.page + 1; //increase page by 1
            this.displayRecordPerPage(this.page);            
        }             
    }

    //this method displays records page by page
    displayRecordPerPage(page){

        /*let's say for 2nd page, it will be => "Displaying 6 to 10 of 23 records. Page 2 of 5"
        page = 2; pageSize = 5; startingRecord = 5, endingRecord = 10
        so, slice(5,10) will give 5th to 9th records.
        */
        this.startingRecord = ((page -1) * this.pageSize) ;
        this.endingRecord = (this.pageSize * page);

        this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                            ? this.totalRecountCount : this.endingRecord; 

        this.data = this.items.slice(this.startingRecord, this.endingRecord);

        //increment by 1 to display the startingRecord count, 
        //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
        this.startingRecord = this.startingRecord + 1;
    }    


    handleRegister(event){
      
      const eventId = event.detail;
      this.currenteventid = eventId;
      this.showregisterform = true;
      this.showeventinformation = false;
      //this.eventid = this.item.id;
      
    }

    handleLoad(){
        //window.clearTimeout(this.delayTimeout);
        this.showspinner = true;
       /* this.delaytimeout = setTimeout(
            function(){
                this.showspinner = false;
            }.bind(this),
            5000
        );
        window.clearTimeout(this.delayTimeout);*/
     
    }

    handleSubmit(event){
      //  alert("I am in handlesubmit");

        event.preventDefault();       // stop the form from submitting
        this.showspinner = false;
        const fields = event.detail.fields;
        this.eventdetailfields = fields;
        
       
       for (let i = 0; i < this.items.length; i++) {
           
           if (this.items[i].Id == this.currenteventid) {
            
            /*if (fields.Number_of_Seats_Requested__c <= this.items[i].Available_Seats__c) {
                this.showregisterform = false;
            this.template.querySelector('lightning-record-edit-form').submit(fields);
                
            } else if (fields.Number_of_Seats_Requested__c <= (this.items[i].Available_Seats__c 
            + this.items[i].Waitlisting_Capacity__c)) {
                // set pop up flag to true & display pop-up for waitlst confirmation
                this.showmodalbox = true;
            
            } else if (fields.Number_of_Seats_Requested__c > (this.items[i].Available_Seats__c 
                + this.items[i].Waitlisting_Capacity__c)){
                this.showexitmodalbox = true;
    
            }*/

            if (fields.Number_of_Seats_Requested__c <= (this.items[i].Available_Seats__c 
                + this.items[i].Available_Waitlist_Seats__c)){
                    if (fields.Number_of_Seats_Requested__c <= this.items[i].Available_Seats__c) {
                        fields.Confirmed_Seats__c = fields.Number_of_Seats_Requested__c;
                        fields.Registration_Status__c = 'Confirmed';
                        fields.Waitlist_Seats__c = 0;
                        
                        this.showregisterform = false; //all seats are available without waitlist
                        //this.registrationstatus = 'Confirmed';
                       // this.confirmedseats = fields.Number_of_Seats_Requested__c;
                       // this.waitlistseats = 0;
                    this.template.querySelector('lightning-record-edit-form').submit(fields);
                        
                    } else{ 
                        this.showmodalbox = true; //waitlisting seats, show waitlisting pop-up confirmation
                    }
                } else{
                    this.showexitmodalbox = true; //no seats are available including waitlisting, exit pop-up
                }

           }
           
       }
          
        

        /*if (fields.number_of_requested_seats__c <= this.eventdetailsfields.available_seats__c) {
            this.showregisterform = false;
        this.template.querySelector('lightning-record-edit-form').submit(fields);
            
        } else if (fields.number_of_requested_seats__c <= this.eventdetailsfields.available_seats__c 
        + this.eventdetailsfields.waitlisting_capacity__c) {
            // set pop up flag to true & display pop-up for waitlst confirmation
            this.showmodalbox = true;
        
        } else if (fields.number_of_requested_Seats__c > this.eventdetailsfields.available_seats__c 
            + this.eventdetailsfields.waitlisting_capacity__c){
            this.showexitmodalbox = true;

        }*/
        
            
    }

    handleContinue(event){
       // alert("I am here in continue handle");
        this.showmodalbox = false;
        this.showregisterform = false;
        const fields  = this.eventdetailfields;
        //subtract available seats values and update waitlist seats too
        for (let i = 0; i < this.items.length; i++){
         //   alert("I am inside for loop");
            if (this.items[i].Id == this.currenteventid){
                const seats = fields.Number_of_Seats_Requested__c - this.items[i].Available_Seats__c;
                //const fields  = this.eventdetailfields;
                fields.Confirmed_Seats__c = this.items[i].Available_Seats__c;
              //  alert("confirmed seats"+JSON.stringify(fields.Confirmed_Seats__c));
                fields.Registration_Status__c = 'Waitlist';
              //  alert("Registration status seats"+JSON.stringify(fields.Registration_Status__c));
                fields.Waitlist_Seats__c = seats;
              //  alert("waitlist seats"+JSON.stringify(fields.Waitlist_Seats__c));
               /* alert("inside if condition");
                const seats = this.eventdetailfields.Number_of_Seats_Requested__c - this.items[i].Available_Seats__c;
                alert("seats" +seats);
                this.eventdetailfields.Confirmed_Seats__c = this.items[i].Available_Seats__c;
                alert("confirmed seats"+JSON.stringify(this.eventdetailfields.Confirmed_Seats__c));
                this.eventdetailsfields.Waitlist_Seats__c = 1;
               // this.eventdetailsfields.Waitlist_Seats__c = this.eventdetailfields.Number_of_Seats_Requested__c - this.items[i].Available_Seats__c;
                alert("waitlist seats"+JSON.stringify(this.eventdetailfields.Waitlist_Seats__c));
                this.eventdetailsfields.Registration_Status__c = 'Waitlist';
                alert("Registration status seats"+JSON.stringify(this.eventdetailfields.Registration_Status__c));*/
            }
        } 
       // alert("fields"+ JSON.stringify(fields));
        this.template.querySelector('lightning-record-edit-form').submit(fields);
    }

    handleCancel(event){
        
        this.showmodalbox = false;
        this.showexitmodalbox = false;
        this.showregisterform = false;
        //exit booking system go to list of event detail page
        this.showeventinformation = true;
    }

    handleSuccess(event){
        this.registrationid = event.detail.id; //id of the record
        this.registrationdetails = event.detail;
        this.fields = this.registrationdetails.fields;
        this.confirmedid = this.fields.Registration_ID__c.value; //confirmation Id
        this.registrationstatus = this.fields.Registration_Status__c.value; //registration status
        this.confirmedseats = this.fields.Confirmed_Seats__c.value; //confirmed seats
        this.waitlistseats = this.fields.Waitlist_Seats__c.value; //waitlist seats (if any)
        if(this.registrationstatus == 'Confirmed'){
            this.confirmbooking = true; //display confirmation message
        }else {
            this.waitlistbooking = true; //display waitlist message
        }
        //alert("first"+ JSON.stringify(this.confirmedid));
        
      // alert("after registration details are" +JSON.stringify(this.registrationdetails));
    

    }

    handleError(event){
        const error1 = event.detail.detail;
       
        this.showToast(error1);
        this.showeventinformation = true;

    }

    showToast(theMessage){
        const toastevent = new ShowToastEvent({
            title: 'Error',
            message: theMessage,
            variant: 'ERROR',
            mode: 'sticky',
        });
        this.dispatchEvent(toastevent);

    }

    handleback(event){
        this.confirmbooking = false;
        this.waitlistbooking = false;
       // this.showeventinformation = true;
        this.navigateback = true;
        const backEvent = new CustomEvent('back', {detail: this.navigateback});
        this.dispatchEvent(backEvent);

    }
}