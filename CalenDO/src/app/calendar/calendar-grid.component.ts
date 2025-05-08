import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CalendarService, CalendarEvent } from '../services/calendar.service';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.css']
})
export class CalendarGridComponent implements OnInit {
  @Input() viewDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<Date>();

  selectedDate: Date | null = null;
  modalVisible = false;
  editingMode = false;
  editingEvent: CalendarEvent | null = null;

  eventTitle: string = '';
  events: CalendarEvent[] = [];
  
  constructor(private calendarService: CalendarService) {}
  
  ngOnInit(): void {
    this.loadEvents();
  }
  
  loadEvents(): void {
    this.calendarService.getAllEvents().subscribe({
      next: (events) => {
        this.events = events;
      },
      error: (error) => {
        console.error('Error loading events:', error);
      }
    });
  }

  getDaysInMonth(): Date[] {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const days: Date[] = [];

    const date = new Date(year, month, 1);
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return days;
  }

  getStartDay(): number {
    return new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1).getDay();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  prevMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
  }

  nextMonth() {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
  }

  dayClicked(day: Date) {
    this.selectedDate = day;
    this.modalVisible = true;
    this.editingMode = false;
    this.editingEvent = null;
    this.eventTitle = '';
  }

  addEvent() {
    if (this.selectedDate && this.eventTitle.trim()) {
      if (this.editingMode && this.editingEvent) {
        // Update existing event
        const updatedEvent: CalendarEvent = {
          ...this.editingEvent,
          title: this.eventTitle.trim()
        };
        
        this.calendarService.updateEvent(updatedEvent).subscribe({
          next: () => {
            this.loadEvents();
            this.resetModal();
          },
          error: (error) => console.error('Error updating event:', error)
        });
      } else {
        // Add new event
        const newEvent: CalendarEvent = {
          title: this.eventTitle.trim(),
          date: this.selectedDate.toISOString()
        };
        
        this.calendarService.addEvent(newEvent).subscribe({
          next: () => {
            this.loadEvents();
            this.resetModal();
          },
          error: (error) => console.error('Error adding event:', error)
        });
      }
    }
  }

  editEvent(day: Date, index: number) {
    const eventsForDay = this.getEventsForDate(day);
    const event = eventsForDay[index];
    this.selectedDate = new Date(event.date);
    this.eventTitle = event.title;
    this.editingMode = true;
    this.modalVisible = true;
    this.editingEvent = event;
  }

  deleteEvent(day: Date, index: number) {
    const eventsForDay = this.getEventsForDate(day);
    const event = eventsForDay[index];
    
    if (event.id) {
      this.calendarService.deleteEvent(event.id).subscribe({
        next: () => {
          this.loadEvents();
        },
        error: (error) => console.error('Error deleting event:', error)
      });
    }
  }

  getEventsForDate(date: Date) {
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  closeModal() {
    this.resetModal();
  }

  resetModal() {
    this.modalVisible = false;
    this.editingMode = false;
    this.editingEvent = null;
    this.eventTitle = '';
  }
}
