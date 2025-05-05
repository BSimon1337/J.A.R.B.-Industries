import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarService } from '../services/calendar.service';
import { TodoService } from '../services/todo.service';
import { ClassesService } from '../services/classes.service'; // <--- updated!

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  upcomingEventsCount: number = 0;
  remainingTasksCount: number = 0;
  activeClassesCount: number = 0;
  taskCompletionPercentage: number = 0;

  constructor(
    private calendarService: CalendarService,
    private todoService: TodoService,
    private classesService: ClassesService  // <-- updated!
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.upcomingEventsCount = this.calendarService.getUpcomingEventsCount();
    this.remainingTasksCount = this.todoService.getIncompleteTodosCount();
    this.taskCompletionPercentage = this.todoService.getTodoCompletionPercentage();
    this.activeClassesCount = this.classesService.getActiveClassesCount(); // <--- updated!
  }
}
