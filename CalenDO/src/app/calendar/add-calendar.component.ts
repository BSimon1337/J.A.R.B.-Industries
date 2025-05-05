import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-calendar',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './add-calendar.component.html',
  styleUrls: ['./add-calendar.component.css']
})
export class AddCalendarComponent {
  viewDate: Date = new Date();
  selectedDay: number | null = null;
  modalVisible: boolean = false;

  getDaysInMonth(): number[] {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: numDays }, (_, i) => i + 1);
  }

  get blanksArray(): number[] {
    const firstDayOfMonth = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1).getDay();
    return Array.from({ length: firstDayOfMonth });
  }

  prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
  }

  nextMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
  }

  dayClicked(day: number): void {
    this.selectedDay = day;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }
}
