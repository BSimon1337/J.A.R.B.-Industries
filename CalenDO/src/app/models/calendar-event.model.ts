// models/calendar-event.model.ts
export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  date: string; // ISO format
}
