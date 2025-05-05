import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private events: { title: string; date: Date }[] = [
    { title: 'Math Exam', date: new Date('2025-05-01') },
    { title: 'Group Project Meeting', date: new Date('2025-05-03') },
    { title: 'Doctor Appointment', date: new Date('2025-05-05') },
  ];

  constructor() {}

  // Return all events
  getAllEvents(): { title: string; date: Date }[] {
    return this.events;
  }

  // Return only future events
  getUpcomingEvents(): { title: string; date: Date }[] {
    const today = new Date();
    return this.events.filter(event => event.date >= today);
  }

  // Return how many upcoming events
  getUpcomingEventsCount(): number {
    return this.getUpcomingEvents().length;
  }

  // Add a new calendar event
  addEvent(event: { title: string; date: Date }) {
    this.events.push(event);
  }
}
