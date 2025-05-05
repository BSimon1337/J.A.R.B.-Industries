import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent {

  newTitle: string = '';
  newDueDate: string = '';

  constructor(private todoService: TodoService, private router: Router) {}

  addTask() {
    if (this.newTitle && this.newDueDate) {
      this.todoService.addTodo({
        title: this.newTitle,
        completed: false,
        dueDate: new Date(this.newDueDate)
      });
      this.router.navigate(['/todo']);
    }
  }

  cancel() {
    this.router.navigate(['/todo']);
  }
}
