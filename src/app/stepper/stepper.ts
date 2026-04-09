import { Component } from '@angular/core';

@Component({
  selector: 'app-stepper',
  standalone: false,
  templateUrl: './stepper.html',
  styleUrl: './stepper.css',
})
export class Stepper {
  currentStep = 1;
  steps = [
    { id: 1, title: 'Personal Info', icon: '👤' },
    { id: 2, title: 'Contact Details', icon: '📞' },
    { id: 3, title: 'Review & Submit', icon: '✅' }
  ];

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  };

  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submitForm() {
    console.log('Form Submitted', this.formData);
    alert('Form submitted successfully!');
    // Reset back to start or whatever is needed
    // this.currentStep = 1;
  }
}
