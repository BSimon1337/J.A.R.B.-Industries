import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  incompleteTodos: { title: string; completed: boolean; dueDate: Date }[] = [];
  completedTodos: { title: string; completed: boolean; dueDate: Date }[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadTodos() {
    const allTodos = this.todoService.getAllTodos();
    this.incompleteTodos = allTodos.filter(todo => !todo.completed);
    this.completedTodos = allTodos.filter(todo => todo.completed);
  }

  markComplete(index: number) {
    this.incompleteTodos[index].completed = true;
    this.todoService.markTodoComplete(this.incompleteTodos[index]);
    this.loadTodos(); // Refresh the lists
  }

  isOverdue(dueDate: Date): boolean {
    return new Date(dueDate) < new Date();
  }
}
