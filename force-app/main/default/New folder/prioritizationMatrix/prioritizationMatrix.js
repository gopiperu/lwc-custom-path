import { LightningElement,api,wire,track } from 'lwc';
import getCriteriaList from '@salesforce/apex/PrioritizationMatrixController.getCriteriaList';


export default class PrioritizationMatrix extends LightningElement {
    @track criteriaList;
    @api recordId;
    connectedCallback() { }

    @wire(getCriteriaList,{ recordId: '$recordId'}) wiredCriteriaList({ error, data }) {
        this.criteriaList = data;
        console.log('priority data-1->',this.criteriaList);
    };

    handleChange1(event)
        {
            console.log('grand parent',event.detail.criteriaId);
            console.log('grand parent',event.detail.selectedOption);
            //this.criteriaList = null;
            /*
            this.criteriaList.forEach(function(item) {
                if(item.Id == event.detail.criteriaId)
                {
                    console.log('item-->',item);
                    item.options.forEach(function(option)
                    {
                        if(option.value == event.detail.selectedOption)
                        {
                            option['classList'] = 'slds-path__item slds-is-complete';
                        }
                    });
                }
            });*/
        }
}
