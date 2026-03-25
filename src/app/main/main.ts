import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: false,
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  userDetails = {
    name: '',
    email: '',
    contact: '',
    role: 'User',
    status: 'Active',
  };

  uploadedImagePreview: string | ArrayBuffer | null = null;
  isPreviewOpen: boolean = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePreview() {
    if (this.uploadedImagePreview) {
      this.isPreviewOpen = !this.isPreviewOpen;
    }
  }

  closePreview() {
    this.isPreviewOpen = false;
  }

  onSubmit() {
    console.log('User Details Saved:', this.userDetails);
  }
}
