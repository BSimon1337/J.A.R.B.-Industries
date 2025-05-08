import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService, TodoTask } from '../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  incompleteTodos: TodoTask[] = [];
  completedTodos: TodoTask[] = [];
  isLoading: boolean = false;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    this.isLoading = true;
    this.todoService.getAllTodos().subscribe({
      next: (allTodos) => {
        this.incompleteTodos = allTodos.filter(todo => !todo.done);
        this.completedTodos = allTodos.filter(todo => todo.done);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.isLoading = false;
      }
    });
  }

  markComplete(index: number) {
    const todo = this.incompleteTodos[index];
    this.todoService.markTodoComplete(todo).subscribe({
      next: () => this.loadTodos(), // Refresh the lists
      error: (error) => console.error('Error marking todo as complete:', error)
    });
  }

  isOverdue(dueDate: string): boolean {
    return new Date(dueDate) < new Date();
  }
}
