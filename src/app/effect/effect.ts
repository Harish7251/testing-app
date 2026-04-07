import {
  Component, OnInit, ElementRef, ViewChild,
  AfterViewInit, HostListener, NgZone
} from '@angular/core';

const CATEGORIES = ['Nature', 'Architecture', 'Technology', 'Art', 'Travel', 'Urban'];
const TAGS = ['New', 'Popular', 'Trending', 'Featured', 'HD', 'Exclusive'];

@Component({
  selector: 'app-effect',
  standalone: false,
  templateUrl: './effect.html',
  styleUrl: './effect.css',
})
export class Effect implements OnInit, AfterViewInit {
  items: any[] = [];
  isLoading = false;
  page = 1;
  totalLoaded = 0;

  @ViewChild('anchor', { static: false }) anchor!: ElementRef;
  private observer!: IntersectionObserver;

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.loadMore();
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !this.isLoading) {
        this.zone.run(() => this.loadMore());
      }
    }, { rootMargin: '200px' });

    if (this.anchor) {
      this.observer.observe(this.anchor.nativeElement);
    }
  }

  loadMore() {
    this.isLoading = true;
    setTimeout(() => {
      const newItems = Array.from({ length: 9 }).map((_, i) => {
        const id = (this.page - 1) * 9 + i + 1;
        const category = CATEGORIES[id % CATEGORIES.length];
        const tag = TAGS[id % TAGS.length];
        const w = [400, 500, 600][id % 3];
        const h = [300, 400, 350][id % 3];
        return {
          id,
          title: `${category} Scene #${id}`,
          image: `https://picsum.photos/seed/${id * 7}/600/400`,
          thumb: `https://picsum.photos/seed/${id * 7}/40/40`,
          description: `A breathtaking ${category.toLowerCase()} capture that transports you to another world.`,
          category,
          tag,
          likes: Math.floor(Math.random() * 900) + 100,
          views: Math.floor(Math.random() * 9000) + 1000,
          rotateX: 0,
          rotateY: 0,
          glowX: 50,
          glowY: 50,
        };
      });
      this.items = [...this.items, ...newItems];
      this.page++;
      this.totalLoaded = this.items.length;
      this.isLoading = false;
    }, 1000);
  }

  onMouseMove(event: MouseEvent, item: any) {
    const el = (event.currentTarget as HTMLElement);
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    item.rotateX = ((y - cy) / cy) * -12;
    item.rotateY = ((x - cx) / cx) * 12;
    item.glowX = (x / rect.width) * 100;
    item.glowY = (y / rect.height) * 100;
  }

  onMouseLeave(item: any) {
    item.rotateX = 0;
    item.rotateY = 0;
    item.glowX = 50;
    item.glowY = 50;
  }
}
