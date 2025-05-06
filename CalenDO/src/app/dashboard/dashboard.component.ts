import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CalendarService } from '../services/calendar.service';
import { TodoService } from '../services/todo.service';
import { ClassesService } from '../services/classes.service';
import { forkJoin } from 'rxjs';

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
  isLoading: boolean = false;

  constructor(
    private calendarService: CalendarService,
    private todoService: TodoService,
    private classesService: ClassesService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    // Use forkJoin to handle multiple observables
    forkJoin({
      upcomingEvents: this.calendarService.getUpcomingEventsCount(),
      remainingTasks: this.todoService.getIncompleteTodosCount(),
      taskCompletion: this.todoService.getTodoCompletionPercentage(),
      activeClasses: this.classesService.getActiveClassesCount()
    }).subscribe({
      next: (results) => {
        this.upcomingEventsCount = results.upcomingEvents;
        this.remainingTasksCount = results.remainingTasks;
        this.taskCompletionPercentage = results.taskCompletion;
        this.activeClassesCount = results.activeClasses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;
      }
    });
  }
}
