import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Festival = 'diwali' | 'holi' | 'christmas' | 'none';

interface FestivalConfig {
  id: Festival;
  name: string;
  emoji: string;
  greeting: string;
  color: string;
  // [month (1-12), startDay, endDay]
  months: [number, number, number][];
}

export const FESTIVALS: FestivalConfig[] = [
  {
    id: 'diwali',
    name: 'Happy Diwali',
    emoji: '🪔',
    greeting: 'Wishing you a sparkling and joyful Diwali!',
    color: '#f59e0b',
    months: [[10, 20, 31], [11, 1, 5]], // Oct 20 – Nov 5 window
  },
  {
    id: 'holi',
    name: 'Happy Holi',
    emoji: '🎨',
    greeting: 'Wishing you a colourful and joyful Holi!',
    color: '#ec4899',
    months: [[3, 10, 30]], // March 10–30 window
  },
  {
    id: 'christmas',
    name: 'Merry Christmas',
    emoji: '🎄',
    greeting: 'Wishing you peace, joy and holiday cheer!',
    color: '#22c55e',
    months: [[12, 15, 31], [1, 1, 5]], // Dec 15 – Jan 5 window
  },
];

@Injectable({ providedIn: 'root' })
export class FestivalService {
  private _festival = new BehaviorSubject<Festival>('none');
  festival$ = this._festival.asObservable();

  get current(): Festival { return this._festival.value; }
  get config(): FestivalConfig | null {
    return FESTIVALS.find(f => f.id === this._festival.value) ?? null;
  }

  constructor() { this.detect(); }

  detect() {
    const now = new Date();
    const m = now.getMonth() + 1;
    const d = now.getDate();
    for (const f of FESTIVALS) {
      for (const [fm, fd1, fd2] of f.months) {
        if (m === fm && d >= fd1 && d <= fd2) {
          this._festival.next(f.id);
          return;
        }
      }
    }
    this._festival.next('none');
  }

  setFestival(f: Festival) { this._festival.next(f); }
}
