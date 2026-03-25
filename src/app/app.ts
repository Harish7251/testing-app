import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None
})
export class App {
  userInput: string = '';
  messages: any[] = [];
  isOpen = false;
  
  isLoading: boolean = true;
  tableData: any[] = [];
  graphData: any[] = [];
  isSidebarOpen: boolean = window.innerWidth > 768;
  currentView: string = 'dashboard';

  onNavigate(view: string) {
    this.currentView = view;
  }

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
    }, 6000);
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  sendMessage() {
    if (!this.userInput.trim()) return;

    this.messages.push({ text: this.userInput, type: 'user' });

    const userText = this.userInput;
    this.userInput = '';

    // typing indicator
    this.messages.push({ text: 'Typing...', type: 'bot' });

    setTimeout(() => {
      this.messages.pop(); // remove typing
      const reply = this.getBotResponse(userText);
      this.messages.push({ text: reply, type: 'bot' });
    }, 1000);
  }

  knowledgeBase: any = [
    {
      keywords: ['hlo', 'sign in'],
      answer: 'Kya re chikne',
    },
    {
      keywords: ['ek kam to kar'],
      answer: 'muh me dedunga choco',
    },
    {
      keywords: ['bhadwa'],
      answer: 'Tu bhadwa tera baap bhadwa',
    },
    {
      keywords: ['bhai'],
      answer: 'Hn pappeeee',
    },
    {
      keywords: ['contact', 'support'],
      answer: 'For support, visit the Contact page or email support@gmail.com',
    },
  ];

  getBotResponse(input: string): string {
    input = input.toLowerCase();

    for (let item of this.knowledgeBase) {
      for (let keyword of item.keywords) {
        if (input.includes(keyword)) {
          return item.answer;
        }
      }
    }

    return "Sorry, I didn't understand that. Please try another question.";
  }
}
