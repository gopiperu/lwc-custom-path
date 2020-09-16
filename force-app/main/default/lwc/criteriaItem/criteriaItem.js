import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import updateCriteriaEvaluation from '@salesforce/apex/PrioritizationMatrixController.updateCriteriaEvaluation';

export default class CriteriaItem extends LightningElement {
    @api criteria;
    @api option;
    @track currentOption;
    @api val=15000;
    @api isRange = false;
    connectedCallback() {
        if(this.criteria.type == 'Range')
        {
            this.isRange = true;
        }
        this.currentOption = this.criteria.selectedOption;
    }
    handleStepBlur(event) {
        const stepIndex = event.detail.index;
        console.log('stepIndex--',stepIndex);
    }
    
    handleChange(event)
    {
        this.dispatchEvent(new CustomEvent('optionchange', {detail: {
            criteriaId: event.detail.criteriaId,
            selectedOption:event.detail.selectedOption}}));
    }
    resetValue(newVal)
    {
        this.currentOption = newVal;
    }
}

