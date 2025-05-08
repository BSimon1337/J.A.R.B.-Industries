// src/app/classes/classes.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Grade {
  id: number;
  name: string;
  score: number;    // percentage
  weight: number;   // percentage of total
}

interface SchoolClass {
  id: number;
  name: string;
  instructor: string;
  location: string;
  time: string;
  daysOfWeek: string[];
  grades: Grade[];
}

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  classes: SchoolClass[] = [];
  newClass: Partial<SchoolClass> = { daysOfWeek: [], grades: [] };
  showForm = false;
  editingId: number | null = null;

  gradeInputs: {
    [classId: number]: { name: string; score: number|null; weight: number|null }
  } = {};

  ngOnInit() {
    this.loadClasses();
  }

  loadClasses() {
    const stored = localStorage.getItem('myClasses');
    this.classes = stored ? JSON.parse(stored) : [];
    this.classes.forEach(c => {
      if (!c.grades) c.grades = [];
      if (!this.gradeInputs[c.id]) {
        this.gradeInputs[c.id] = { name: '', score: null, weight: null };
      }
    });
  }

  saveAll() {
    localStorage.setItem('myClasses', JSON.stringify(this.classes));
  }

  addOrUpdateClass() {
    if (!this.newClass.name || !this.newClass.time || !this.newClass.daysOfWeek?.length) return;
    if (this.editingId !== null) {
      const idx = this.classes.findIndex(c => c.id === this.editingId)!;
      const oldGrades = this.classes[idx].grades;
      this.classes[idx] = {
        ...(this.newClass as SchoolClass),
        id: this.editingId,
        grades: oldGrades
      };
    } else {
      const newId = Date.now();
      this.classes.push({
        id: newId,
        name: this.newClass.name!,
        instructor: this.newClass.instructor || '',
        location: this.newClass.location || '',
        time: this.newClass.time!,
        daysOfWeek: this.newClass.daysOfWeek!,
        grades: []
      });
      this.gradeInputs[newId] = { name: '', score: null, weight: null };
    }
    this.resetForm();
    this.saveAll();
  }

  deleteClass(id: number) {
    this.classes = this.classes.filter(c => c.id !== id);
    delete this.gradeInputs[id];
    this.saveAll();
  }

  editClass(cls: SchoolClass) {
    this.newClass = { ...cls, daysOfWeek: [...cls.daysOfWeek], grades: [] };
    this.editingId = cls.id;
    this.showForm = true;
  }

  cancelEdit() {
    this.resetForm();
  }

  toggleDay(day: string) {
    const days = this.newClass.daysOfWeek!;
    const i = days.indexOf(day);
    i === -1 ? days.push(day) : days.splice(i, 1);
  }

  addGrade(classId: number) {
    const inp = this.gradeInputs[classId];
    if (!inp.name || inp.score == null || inp.weight == null) return;
    const cls = this.classes.find(c => c.id === classId)!;
    const usedW = cls.grades.reduce((sum, g) => sum + g.weight, 0);
    if (usedW + inp.weight! > 100) return;
    cls.grades.push({
      id: Date.now(),
      name: inp.name!,
      score: inp.score!,
      weight: inp.weight!
    });
    this.gradeInputs[classId] = { name: '', score: null, weight: null };
    this.saveAll();
  }

  deleteGrade(classId: number, gradeId: number) {
    const cls = this.classes.find(c => c.id === classId)!;
    cls.grades = cls.grades.filter(g => g.id !== gradeId);
    this.saveAll();
  }

  // returns null if no grades
  currentAverage(cls: SchoolClass): number|null {
    const totalW = cls.grades.reduce((sum, g) => sum + g.weight, 0);
    if (totalW === 0) return null;
    const earnedPP = cls.grades.reduce((sum, g) => sum + (g.score * g.weight / 100), 0);
    return earnedPP / (totalW / 100);
  }

  // letter from numeric (null → 'NA')
  letterGrade(avg: number|null): string {
    if (avg == null) return 'NA';
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  }

  neededForTarget(cls: SchoolClass, t: number): number|null {
    const earnedPP = cls.grades.reduce((sum, g) => sum + (g.score * g.weight / 100), 0);
    const usedW = cls.grades.reduce((sum, g) => sum + g.weight, 0);
    const remW = 100 - usedW;
    if (remW <= 0) return this.currentAverage(cls)! >= t ? 0 : null;
    const needed = (t - earnedPP) / (remW / 100);
    if (needed > 100) return null;
    return Math.max(0, needed);
  }

  displayNeed(cls: SchoolClass, t: number): string {
    const usedW = cls.grades.reduce((s, g) => s + g.weight, 0);
    if (usedW > 100) return 'NA';
    const n = this.neededForTarget(cls, t);
    if (n === null) return 'NA';
    if (n === 0) return 'Achieved';
    return n.toFixed(1) + '%';
  }

  weightOk(cls: SchoolClass, cid: number): boolean {
    const usedW = cls.grades.reduce((s, g) => s + g.weight, 0);
    const up = this.gradeInputs[cid]?.weight;
    return up != null && usedW + up <= 100;
  }

  overallAverage(): number|null {
    const avgs = this.classes
      .map(c => this.currentAverage(c))
      .filter(a => a != null) as number[];
    if (!avgs.length) return null;
    const sum = avgs.reduce((a, b) => a + b, 0);
    return sum / avgs.length;
  }

  private resetForm() {
    this.newClass = { daysOfWeek: [], grades: [] };
    this.editingId = null;
    this.showForm = false;
  }
}
