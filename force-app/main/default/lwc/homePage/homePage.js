import { LightningElement } from 'lwc';

export default class HomePage extends LightningElement {
   showeventregistration = false;
   showeventcancellation = false;
   showhomepage = true;
    handleExplore(){
           this.showhomepage = false;
           this.showeventcancellation = false;
            this.showeventregistration = true;
            

    }
    handleManage(){
            this.showhomepage = false;
            this.showeventregistration = false;
            this.showeventcancellation = true;
    }

    handleBack(event){
        this.showeventregistration = false;
        this.showeventcancellation = false;
            this.showhomepage = event.detail;

    }
}