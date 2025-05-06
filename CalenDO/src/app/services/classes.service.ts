import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SchoolClass } from '../models/class.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private apiUrl = 'http://localhost:8000/api/school-classes';
  
  private classesSubject = new BehaviorSubject<SchoolClass[]>([]);
  public classes = this.classesSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load classes when user logs in
    this.authService.currentUser.subscribe(user => {
      if (user) {
        this.loadClasses();
      } else {
        // Reset to empty array when logged out
        this.classesSubject.next([]);
      }
    });
  }

  // Load classes from API
  loadClasses(): void {
    if (this.authService.isLoggedIn) {
      this.http.get<SchoolClass[]>(this.apiUrl)
        .subscribe(classes => {
          this.classesSubject.next(classes);
        });
    }
  }

  getAll(): Observable<SchoolClass[]> {
    return this.classes;
  }

  addClass(newClass: SchoolClass): Observable<SchoolClass> {
    if (this.authService.isLoggedIn) {
      return this.http.post<SchoolClass>(this.apiUrl + '/', newClass)
        .pipe(
          tap(createdClass => {
            const currentClasses = this.classesSubject.value;
            this.classesSubject.next([...currentClasses, createdClass]);
          })
        );
    } else {
      // Fallback for when not logged in
      const classWithId = { ...newClass, id: Math.floor(Math.random() * 1000) };
      const currentClasses = this.classesSubject.value;
      this.classesSubject.next([...currentClasses, classWithId]);
      return new Observable(observer => {
        observer.next(classWithId);
        observer.complete();
      });
    }
  }

  deleteClass(id: number): Observable<any> {
    if (this.authService.isLoggedIn) {
      return this.http.delete(`${this.apiUrl}/${id}/`)
        .pipe(
          tap(() => {
            const currentClasses = this.classesSubject.value;
            this.classesSubject.next(currentClasses.filter(c => c.id !== id));
          })
        );
    } else {
      // Fallback for when not logged in
      const currentClasses = this.classesSubject.value;
      this.classesSubject.next(currentClasses.filter(c => c.id !== id));
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }
  }

  getActiveClassesCount(): Observable<number> {
    return this.classes.pipe(
      map(classes => classes.length)
    );
  }

  updateClass(id: number, updatedClass: SchoolClass): Observable<SchoolClass> {
    if (this.authService.isLoggedIn) {
      return this.http.put<SchoolClass>(`${this.apiUrl}/${id}/`, updatedClass)
        .pipe(
          tap(updated => {
            const currentClasses = this.classesSubject.value;
            const index = currentClasses.findIndex(cls => cls.id === id);
            if (index !== -1) {
              currentClasses[index] = updated;
              this.classesSubject.next([...currentClasses]);
            }
          })
        );
    } else {
      // Fallback for when not logged in
      const currentClasses = this.classesSubject.value;
      const index = currentClasses.findIndex(cls => cls.id === id);
      if (index !== -1) {
        currentClasses[index] = updatedClass;
        this.classesSubject.next([...currentClasses]);
      }
      return new Observable(observer => {
        observer.next(updatedClass);
        observer.complete();
      });
    }
  }
}
