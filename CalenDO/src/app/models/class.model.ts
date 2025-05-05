// models/class.model.ts
export interface SchoolClass {
  id: number;
  name: string;
  instructor: string;
  location: string;
  daysOfWeek: string[]; // e.g. ['Monday', 'Wednesday']
  time: string;         // e.g. "10:00 AM - 11:15 AM"
}
