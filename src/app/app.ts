import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
  encapsulation: ViewEncapsulation.None
})
export class App {

  // 🔐 Auth & UI
  isLoggedIn: boolean = false;
  isOpen = false;
  isLoading: boolean = true;

  // 📊 Dashboard Data
  tableData: any[] = [];
  graphData: any[] = [];

  // 📱 Layout
  isSidebarOpen: boolean = window.innerWidth > 768;
  currentView: string = 'dashboard';
  isScrolled: boolean = false;

  // 💬 Chatbot
  messages: any[] = [];
  userInput: string = '';
  isGenerating: boolean = false;

  // 🔐 Login
  onLogin() {
    this.isLoggedIn = true;

    // Automatically log the user out after 10 seconds (10000 milliseconds)
    // setTimeout(() => {
    //   this.isLoggedIn = false;
    //   this.currentView = 'dashboard'; // reset view on logout
    //   alert('Session expired. You have been automatically logged out after 10 seconds.');
    // }, 100000);

  }

  // 📜 Scroll
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    this.isScrolled = target.scrollTop > 10;
  }

  // 🔄 Navigation
  onNavigate(view: string) {
    this.currentView = view;
  }

  // 📦 Load dummy data
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
        { day: 'Sun', value: 45 }
      ];

      this.isLoading = false;
    }, 2000);
  }

  // 💬 Toggle Chat
  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  // 📱 Sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // 🤖 Send Message (MAIN LOGIC)
  sendMessage() {
    if (!this.userInput.trim() || this.isGenerating) return;

    this.messages.push({ text: this.userInput, type: 'user' });
    const userMsg = this.userInput;
    this.userInput = '';
    this.isGenerating = true;

    const evt = new EventSource(`https://localhost:7260/api/chat/chat?prompt=${encodeURIComponent(userMsg)}`);
    let botReply = '';

    evt.onmessage = (event) => {
      this.isGenerating = false;
      try {
        const data = JSON.parse(event.data);
        if (data.response) botReply += data.response;
      } catch { }

      // Update last bot message
      if (this.messages.length && this.messages[this.messages.length - 1].type === 'bot') {
        this.messages[this.messages.length - 1].text = botReply;
      } else {
        this.messages.push({ text: botReply, type: 'bot' });
      }

      // Close SSE if done
      try {
        const data = JSON.parse(event.data);
        if (data.done) evt.close();
      } catch {}
    };

    evt.onerror = () => {
      this.isGenerating = false;
      evt.close();
      if (!botReply) this.messages.push({ text: 'Server error ❌', type: 'bot' });
    };
  }
}