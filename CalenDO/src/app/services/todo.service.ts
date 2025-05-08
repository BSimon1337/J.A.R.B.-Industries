import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface TodoTask {
  id?: number;
  title: string;
  done: boolean;
  due_date: string; // ISO format
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = 'http://localhost:8000/api/todo-tasks';
  
  private todosSubject = new BehaviorSubject<TodoTask[]>([]);
  public todos = this.todosSubject.asObservable();
  
  // Fallback data for when not logged in or API is unavailable
  private fallbackTodos: TodoTask[] = [
    { title: 'Finish Homework 5', done: false, due_date: '2025-05-02' },
    { title: 'Start Essay Draft', done: true, due_date: '2025-04-30' },
    { title: 'Prepare Presentation', done: false, due_date: '2025-05-04' },
    { title: 'Submit Lab Report', done: false, due_date: '2025-05-03' },
    { title: 'Meeting with Advisor', done: true, due_date: '2025-04-29' },
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load todos when user logs in
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.loadTodos();
      } else {
        // Use fallback data when logged out
        this.todosSubject.next(this.fallbackTodos);
      }
    });
    
    // Initialize with fallback data if not logged in
    if (!this.authService.isLoggedIn) {
      this.todosSubject.next(this.fallbackTodos);
    }
  }

  // Load todos from API
  loadTodos(): void {
    if (this.authService.isLoggedIn) {
      this.http.get<TodoTask[]>(this.apiUrl)
        .subscribe(todos => {
          this.todosSubject.next(todos);
        });
    }
  }

  // Get all todos (both completed and incomplete)
  getAllTodos(): Observable<TodoTask[]> {
    return this.todos;
  }

  // Get only incomplete todos
  getIncompleteTodos(): Observable<TodoTask[]> {
    return this.todos.pipe(
      map(todos => todos.filter(todo => !todo.done))
    );
  }

  // Get count of incomplete todos
  getIncompleteTodosCount(): Observable<number> {
    return this.getIncompleteTodos().pipe(
      map(todos => todos.length)
    );
  }

  // Get completion percentage (completed / total)
  getTodoCompletionPercentage(): Observable<number> {
    return this.todos.pipe(
      map(todos => {
        const totalTodos = todos.length;
        const completedTodos = todos.filter(todo => todo.done).length;
        return totalTodos === 0 ? 0 : Math.round((completedTodos / totalTodos) * 100);
      })
    );
  }

  // Add a new todo
  addTodo(todo: TodoTask): Observable<TodoTask> {
    if (this.authService.isLoggedIn) {
      return this.http.post<TodoTask>(this.apiUrl + '/', todo)
        .pipe(
          tap(newTodo => {
            const currentTodos = this.todosSubject.value;
            this.todosSubject.next([...currentTodos, newTodo]);
          })
        );
    } else {
      // Fallback for when not logged in
      const newTodo = { ...todo, id: Math.floor(Math.random() * 1000) };
      const currentTodos = this.todosSubject.value;
      this.todosSubject.next([...currentTodos, newTodo]);
      return new Observable(observer => {
        observer.next(newTodo);
        observer.complete();
      });
    }
  }

  // Mark an existing todo as complete
  markTodoComplete(todo: TodoTask): Observable<TodoTask> {
    const updatedTodo = { ...todo, done: true };
    
    if (this.authService.isLoggedIn && todo.id) {
      return this.http.put<TodoTask>(`${this.apiUrl}/${todo.id}/`, updatedTodo)
        .pipe(
          tap(updated => {
            const currentTodos = this.todosSubject.value;
            const index = currentTodos.findIndex(t => t.id === todo.id);
            if (index !== -1) {
              currentTodos[index] = updated;
              this.todosSubject.next([...currentTodos]);
            }
          })
        );
    } else {
      // Fallback for when not logged in
      const currentTodos = this.todosSubject.value;
      const index = currentTodos.findIndex(t =>
        t.title === todo.title &&
        t.due_date === todo.due_date
      );
      
      if (index !== -1) {
        currentTodos[index].done = true;
        this.todosSubject.next([...currentTodos]);
      }
      
      return new Observable(observer => {
        observer.next(updatedTodo);
        observer.complete();
      });
    }
  }
  
  // Update an existing todo
  updateTodo(todo: TodoTask): Observable<TodoTask> {
    if (this.authService.isLoggedIn && todo.id) {
      return this.http.put<TodoTask>(`${this.apiUrl}/${todo.id}/`, todo)
        .pipe(
          tap(updatedTodo => {
            const currentTodos = this.todosSubject.value;
            const index = currentTodos.findIndex(t => t.id === todo.id);
            if (index !== -1) {
              currentTodos[index] = updatedTodo;
              this.todosSubject.next([...currentTodos]);
            }
          })
        );
    } else {
      // Fallback for when not logged in
      return new Observable(observer => {
        observer.next(todo);
        observer.complete();
      });
    }
  }
  
  // Delete a todo
  deleteTodo(todoId: number): Observable<any> {
    if (this.authService.isLoggedIn) {
      return this.http.delete(`${this.apiUrl}/${todoId}/`)
        .pipe(
          tap(() => {
            const currentTodos = this.todosSubject.value;
            this.todosSubject.next(currentTodos.filter(t => t.id !== todoId));
          })
        );
    } else {
      // Fallback for when not logged in
      const currentTodos = this.todosSubject.value;
      this.todosSubject.next(currentTodos.filter(t => t.id !== todoId));
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }
  }
}
