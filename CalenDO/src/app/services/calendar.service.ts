import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface CalendarEvent {
  id?: number;
  title: string;
  description?: string;
  date: string; // ISO format
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = 'http://localhost:8000/api/calendar-events';
  
  private eventsSubject = new BehaviorSubject<CalendarEvent[]>([]);
  public events = this.eventsSubject.asObservable();
  
  // Fallback data for when not logged in or API is unavailable
  private fallbackEvents: CalendarEvent[] = [
    { title: 'Math Exam', date: '2025-05-01' },
    { title: 'Group Project Meeting', date: '2025-05-03' },
    { title: 'Doctor Appointment', date: '2025-05-05' },
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load events when user logs in
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.loadEvents();
      } else {
        // Use fallback data when logged out
        this.eventsSubject.next(this.fallbackEvents);
      }
    });
    
    // Initialize with fallback data if not logged in
    if (!this.authService.isLoggedIn) {
      this.eventsSubject.next(this.fallbackEvents);
    }
  }

  // Load events from API
  loadEvents(): void {
    if (this.authService.isLoggedIn) {
      this.http.get<CalendarEvent[]>(this.apiUrl)
        .subscribe(events => {
          this.eventsSubject.next(events);
        });
    }
  }

  // Return all events
  getAllEvents(): Observable<CalendarEvent[]> {
    return this.events;
  }

  // Return only future events
  getUpcomingEvents(): Observable<CalendarEvent[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.events.pipe(
      map(events => events.filter(event => event.date >= today))
    );
  }

  // Return how many upcoming events
  getUpcomingEventsCount(): Observable<number> {
    return this.getUpcomingEvents().pipe(
      map(events => events.length)
    );
  }

  // Add a new calendar event
  addEvent(event: CalendarEvent): Observable<CalendarEvent> {
    if (this.authService.isLoggedIn) {
      return this.http.post<CalendarEvent>(this.apiUrl + '/', event)
        .pipe(
          tap(newEvent => {
            const currentEvents = this.eventsSubject.value;
            this.eventsSubject.next([...currentEvents, newEvent]);
          })
        );
    } else {
      // Fallback for when not logged in
      const newEvent = { ...event, id: Math.floor(Math.random() * 1000) };
      const currentEvents = this.eventsSubject.value;
      this.eventsSubject.next([...currentEvents, newEvent]);
      return new Observable(observer => {
        observer.next(newEvent);
        observer.complete();
      });
    }
  }
  
  // Update an existing event
  updateEvent(event: CalendarEvent): Observable<CalendarEvent> {
    if (this.authService.isLoggedIn && event.id) {
      return this.http.put<CalendarEvent>(`${this.apiUrl}/${event.id}/`, event)
        .pipe(
          tap(updatedEvent => {
            const currentEvents = this.eventsSubject.value;
            const index = currentEvents.findIndex(e => e.id === event.id);
            if (index !== -1) {
              currentEvents[index] = updatedEvent;
              this.eventsSubject.next([...currentEvents]);
            }
          })
        );
    } else {
      // Fallback for when not logged in
      return new Observable(observer => {
        observer.next(event);
        observer.complete();
      });
    }
  }
  
  // Delete an event
  deleteEvent(eventId: number): Observable<any> {
    if (this.authService.isLoggedIn) {
      return this.http.delete(`${this.apiUrl}/${eventId}/`)
        .pipe(
          tap(() => {
            const currentEvents = this.eventsSubject.value;
            this.eventsSubject.next(currentEvents.filter(e => e.id !== eventId));
          })
        );
    } else {
      // Fallback for when not logged in
      const currentEvents = this.eventsSubject.value;
      this.eventsSubject.next(currentEvents.filter(e => e.id !== eventId));
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }
  }
}
