import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar-grid.component.html',
  styleUrls: ['./calendar-grid.component.css']
})
export class CalendarGridComponent {
  @Input() viewDate: Date = new Date();
  @Output() dateSelected = new EventEmitter<Date>();

  selectedDate: Date | null = null;
  modalVisible = false;
  editingMode = false;
  editingIndex: number | null = null;

  eventTitle: string = '';
  events: { date: Date, title: string }[] = [];

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
    return date.toDateString() === today.toDateString();
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
    this.eventTitle = '';
  }

  openModalForToday() {
    this.selectedDate = new Date();
    this.modalVisible = true;
    this.editingMode = false;
    this.eventTitle = '';
  }

  addEvent() {
    if (this.selectedDate && this.eventTitle.trim()) {
      if (this.editingMode && this.editingIndex !== null) {
        this.events[this.editingIndex].title = this.eventTitle.trim();
      } else {
        this.events.push({ date: new Date(this.selectedDate), title: this.eventTitle.trim() });
      }
      this.resetModal();
    }
  }

  editEvent(day: Date, index: number) {
    const eventsForDay = this.getEventsForDate(day);
    const event = eventsForDay[index];
    this.selectedDate = new Date(event.date);
    this.eventTitle = event.title;
    this.editingMode = true;
    this.modalVisible = true;
    this.editingIndex = this.events.findIndex(e =>
      e.date.toDateString() === event.date.toDateString() && e.title === event.title
    );
  }

  deleteEvent(day: Date, index: number) {
    const eventsForDay = this.getEventsForDate(day);
    const event = eventsForDay[index];
    const globalIndex = this.events.findIndex(e =>
      e.date.toDateString() === event.date.toDateString() && e.title === event.title
    );
    if (globalIndex > -1) this.events.splice(globalIndex, 1);
  }

  getEventsForDate(date: Date) {
    return this.events.filter(event => event.date.toDateString() === date.toDateString());
  }

  closeModal() {
    this.resetModal();
  }

  resetModal() {
    this.modalVisible = false;
    this.editingMode = false;
    this.editingIndex = null;
    this.eventTitle = '';
  }
}
