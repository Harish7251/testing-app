import { Component, OnInit } from '@angular/core';

interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-payment-c',
  standalone: false,
  templateUrl: './payment-c.html',
  styleUrl: './payment-c.css',
})
export class PaymentC implements OnInit {
  transactionId: number = 0;
  upiQrCells: number[] = Array.from({length: 25}, (_, i) => i + 1);
  generatedQrUrl: string = '';
  isGeneratingQr: boolean = false;
  // Steps: 1 = method, 2 = details, 3 = confirm, 4 = success
  currentStep: number = 1;
  isCardFlipped: boolean = false;
  isProcessing: boolean = false;
  showSuccess: boolean = false;

  selectedMethod: string = 'card';

  paymentMethods: PaymentMethod[] = [
    { id: 'card', label: 'Credit / Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
    { id: 'upi', label: 'UPI Payment', icon: '📱', description: 'PhonePe, GPay, Paytm' },
    { id: 'netbanking', label: 'Net Banking', icon: '🏦', description: 'All major banks' },
    { id: 'wallet', label: 'Mobile Wallet', icon: '👛', description: 'Amazon Pay, Mobikwik' },
  ];

  // Card details
  cardNumber: string = '';
  cardHolder: string = '';
  expiryMonth: string = '';
  expiryYear: string = '';
  cvv: string = '';
  amount: string = '2,450.00';

  // UPI
  upiId: string = '';

  // Net Banking
  selectedBank: string = '';
  banks: string[] = ['State Bank of India', 'Punjab National Bank', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank'];

  // Display card
  get displayCardNumber(): string {
    const raw = this.cardNumber.replace(/\s/g, '');
    const padded = raw.padEnd(16, '•');
    return padded.match(/.{1,4}/g)?.join(' ') ?? '•••• •••• •••• ••••';
  }

  get displayHolder(): string {
    return this.cardHolder || 'FULL NAME';
  }

  get displayExpiry(): string {
    const m = this.expiryMonth || 'MM';
    const y = this.expiryYear || 'YY';
    return `${m}/${y}`;
  }

  get cardBrand(): string {
    const n = this.cardNumber.replace(/\s/g, '');
    if (n.startsWith('4')) return 'VISA';
    if (n.startsWith('5') || n.startsWith('2')) return 'MASTERCARD';
    if (n.startsWith('6')) return 'RUPAY';
    return 'CARD';
  }

  get cardGradient(): string {
    const n = this.cardNumber.replace(/\s/g, '');
    if (n.startsWith('4')) return 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';
    if (n.startsWith('5') || n.startsWith('2')) return 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)';
    if (n.startsWith('6')) return 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)';
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }

  ngOnInit(): void {}

  selectMethod(id: string): void {
    this.selectedMethod = id;
  }

  formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').substring(0, 16);
    this.cardNumber = value.match(/.{1,4}/g)?.join(' ') ?? value;
    input.value = this.cardNumber;
  }

  flipCard(flip: boolean): void {
    this.isCardFlipped = flip;
  }

  goToStep(step: number): void {
    this.currentStep = step;
    this.isCardFlipped = false;
  }

  processPayment(): void {
    this.isProcessing = true;
    this.currentStep = 3;
    this.transactionId = Math.floor(9000000 + Math.random() * 999999);
    setTimeout(() => {
      this.isProcessing = false;
      this.showSuccess = true;
      this.currentStep = 4;
    }, 3000);
  }

  resetPayment(): void {
    this.currentStep = 1;
    this.showSuccess = false;
    this.isProcessing = false;
    this.transactionId = 0;
    this.cardNumber = '';
    this.cardHolder = '';
    this.expiryMonth = '';
    this.expiryYear = '';
    this.cvv = '';
    this.upiId = '';
    this.selectedBank = '';
    this.selectedMethod = 'card';
    this.isCardFlipped = false;
    this.generatedQrUrl = '';
    this.isGeneratingQr = false;
  }

  getMethodLabel(): string {
    return this.paymentMethods.find(m => m.id === this.selectedMethod)?.label ?? '';
  }

  generateQr(): void {
    this.isGeneratingQr = true;
    this.generatedQrUrl = '';
    // Merchant/receiver UPI — the payer scans this QR, no input needed
    const merchantUpi = 'ebudget.punjab@sbi';
    const upiData = encodeURIComponent(
      `upi://pay?pa=${merchantUpi}&pn=E-Budget+Pay&am=${this.amount.replace(/,/g,'')}&cu=INR&tn=Budget+Payment`
    );
    this.generatedQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${upiData}&format=png&bgcolor=ffffff&margin=10`;
    setTimeout(() => { this.isGeneratingQr = false; }, 800);
  }

  resetQr(): void {
    this.generatedQrUrl = '';
    this.isGeneratingQr = false;
  }

  get isStepTwoValid(): boolean {
    if (this.selectedMethod === 'card') {
      return this.cardNumber.replace(/\s/g, '').length === 16 &&
             this.cardHolder.trim().length > 2 &&
             this.expiryMonth !== '' && this.expiryYear !== '' &&
             this.cvv.length >= 3;
    }
    // UPI: valid if QR was generated (scan to pay) OR user typed a UPI ID
    if (this.selectedMethod === 'upi') return !!this.generatedQrUrl || this.upiId.includes('@');
    if (this.selectedMethod === 'netbanking') return this.selectedBank !== '';
    return true;
  }

  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  years = ['25','26','27','28','29','30','31','32'];
}
