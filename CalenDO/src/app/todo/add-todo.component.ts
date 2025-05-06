import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TodoService, TodoTask } from '../services/todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent {

  newTitle: string = '';
  newDueDate: string = '';
  isSubmitting: boolean = false;
  errorMessage: string = '';

  constructor(private todoService: TodoService, private router: Router) {}

  addTask() {
    if (this.newTitle && this.newDueDate) {
      this.isSubmitting = true;
      this.errorMessage = '';
      
      const newTodo: Partial<TodoTask> = {
        title: this.newTitle,
        done: false,
        due_date: this.newDueDate
      };
      
      this.todoService.addTodo(newTodo as TodoTask).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/todo']);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = 'Failed to add task. Please try again.';
          console.error('Error adding todo:', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/todo']);
  }
}
