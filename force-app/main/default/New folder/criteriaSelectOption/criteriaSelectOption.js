import { LightningElement, api ,track } from 'lwc';

export default class CustomPath extends LightningElement {
    @api currentOption;
    @api optionValues;
    @api criteriaId;
    @track optionVal;
    connectedCallback() {

    }
    handleSelect(event)
    {
        var currOption = event.currentTarget.dataset.value;
       /* var tmpoptionValues = [];
        this.optionVal.forEach(function (item, index) {
            console.log('item.value-1->',item);
            console.log('item.currOption-1->',currOption);
            console.log('is it equal',item.value == currOption);
            if(item.value == currOption)
            {
                item['classList'] = 'slds-path__item slds-is-complete';
                tmpoptionValues.push(item);
                console.log('if');
            }
            else
            {
                item['classList'] = 'slds-path__item slds-is-incomplete';
                tmpoptionValues.push(item)
                console.log('else-if');
            }
        });
        this.optionVal = tmpoptionValues;*/
        let selectedOption = event.currentTarget.dataset.value;
        
        
        this.dispatchEvent(new CustomEvent('optionchange', { detail: {
            criteriaId: this.criteriaId,
            selectedOption:selectedOption
        }  }));
    }
}