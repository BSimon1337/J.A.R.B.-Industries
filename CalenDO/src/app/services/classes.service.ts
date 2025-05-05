import { Injectable } from '@angular/core';
import { SchoolClass } from '../models/class.model';

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private classes: SchoolClass[] = [];

  constructor() {}

  getAll(): SchoolClass[] {
    return this.classes;
  }

  addClass(newClass: SchoolClass): void {
    this.classes.push(newClass);
  }

  deleteClass(id: number): void {
    this.classes = this.classes.filter(c => c.id !== id);
  }

  getActiveClassesCount(): number {
    return this.classes.length;
  }

  updateClass(id: number, updatedClass: SchoolClass): void {
  const index = this.classes.findIndex(cls => cls.id === id);
  if (index !== -1) {
    this.classes[index] = updatedClass;
  }
}
}
