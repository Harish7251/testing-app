import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  standalone: false
})
export class Dashboard implements OnInit {
  isLoading: boolean = true;
  tableData: any[] = [];
  graphData: any[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.tableData = [
        { id: '#1023', name: 'Alena Donin', email: 'alena@example.com', contact: '+1 (555) 123-4567', role: 'Admin', status: 'Active' },
        { id: '#1024', name: 'James Botosh', email: 'james@example.com', contact: '+1 (555) 987-6543', role: 'Editor', status: 'Inactive' },
        { id: '#1025', name: 'Maria Lipshutz', email: 'maria@example.com', contact: '+1 (555) 456-7890', role: 'Subscriber', status: 'Active' },
        { id: '#1026', name: 'Justin Septimus', email: 'justin@example.com', contact: '+1 (555) 111-2222', role: 'User', status: 'Pending' },
        { id: '#1027', name: 'Marcus Bator', email: 'marcus@example.com', contact: '+1 (555) 444-5555', role: 'Admin', status: 'Active' }
      ];
      this.graphData = [
        { day: 'Mon', value: 40 },
        { day: 'Tue', value: 70 },
        { day: 'Wed', value: 55 },
        { day: 'Thu', value: 90 },
        { day: 'Fri', value: 65 },
        { day: 'Sat', value: 30 },
        { day: 'Sun', value: 45 },
      ];
      this.isLoading = false;
    }, 5000);
  }
}
