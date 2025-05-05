import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private todos: { title: string; completed: boolean; dueDate: Date }[] = [
    { title: 'Finish Homework 5', completed: false, dueDate: new Date('2025-05-02') },
    { title: 'Start Essay Draft', completed: true, dueDate: new Date('2025-04-30') },
    { title: 'Prepare Presentation', completed: false, dueDate: new Date('2025-05-04') },
    { title: 'Submit Lab Report', completed: false, dueDate: new Date('2025-05-03') },
    { title: 'Meeting with Advisor', completed: true, dueDate: new Date('2025-04-29') },
  ];

  constructor() {}

  // Get all todos (both completed and incomplete)
  getAllTodos(): { title: string; completed: boolean; dueDate: Date }[] {
    return this.todos;
  }

  // Get only incomplete todos
  getIncompleteTodos(): { title: string; completed: boolean; dueDate: Date }[] {
    return this.todos.filter(todo => !todo.completed);
  }

  // Get count of incomplete todos
  getIncompleteTodosCount(): number {
    return this.getIncompleteTodos().length;
  }

  // Get completion percentage (completed / total)
  getTodoCompletionPercentage(): number {
    const totalTodos = this.todos.length;
    const completedTodos = this.todos.filter(todo => todo.completed).length;
    return totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
  }

  // Add a new todo
  addTodo(todo: { title: string; completed: boolean; dueDate: Date }) {
    this.todos.push(todo);
  }

  // Mark an existing todo as complete
  markTodoComplete(todo: { title: string; completed: boolean; dueDate: Date }) {
    const found = this.todos.find(t => 
      t.title === todo.title && 
      t.dueDate.getTime() === todo.dueDate.getTime()
    );
    if (found) {
      found.completed = true;
    }
  }
}
