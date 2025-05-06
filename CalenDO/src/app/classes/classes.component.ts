import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SchoolClass } from '../models/class.model';
import { ClassesService } from '../services/classes.service';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  classes: SchoolClass[] = [];
  newClass: Partial<SchoolClass> = { daysOfWeek: [] };
  showForm: boolean = false;
  editingId: number | null = null;
  isLoading: boolean = false;

  constructor(private classesService: ClassesService) {}

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    this.isLoading = true;
    this.classesService.getAll().subscribe({
      next: (classes) => {
        this.classes = classes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.isLoading = false;
      }
    });
  }

  addOrUpdateClass() {
    if (!this.newClass.name || !this.newClass.time || !this.newClass.daysOfWeek?.length) return;

    if (this.editingId !== null) {
      this.classesService.updateClass(this.editingId, {
        ...this.newClass,
        id: this.editingId,
        daysOfWeek: [...this.newClass.daysOfWeek!]
      } as SchoolClass).subscribe({
        next: () => {
          this.resetForm();
          this.loadClasses();
        },
        error: (error) => console.error('Error updating class:', error)
      });
    } else {
      const classToAdd: SchoolClass = {
        id: Date.now(),
        name: this.newClass.name!,
        instructor: this.newClass.instructor || '',
        location: this.newClass.location || '',
        time: this.newClass.time!,
        daysOfWeek: this.newClass.daysOfWeek!
      };
      this.classesService.addClass(classToAdd).subscribe({
        next: () => {
          this.resetForm();
          this.loadClasses();
        },
        error: (error) => console.error('Error adding class:', error)
      });
    }
  }

  deleteClass(id: number) {
    this.classesService.deleteClass(id).subscribe({
      next: () => this.loadClasses(),
      error: (error) => console.error('Error deleting class:', error)
    });
  }

  editClass(cls: SchoolClass) {
    this.newClass = { ...cls, daysOfWeek: [...cls.daysOfWeek] };
    this.editingId = cls.id;
    this.showForm = true;
  }

  cancelEdit() {
    this.resetForm();
  }

  toggleDay(day: string) {
    const days = this.newClass.daysOfWeek!;
    const index = days.indexOf(day);
    index === -1 ? days.push(day) : days.splice(index, 1);
  }

  private resetForm() {
    this.newClass = { daysOfWeek: [] };
    this.showForm = false;
    this.editingId = null;
  }
}
