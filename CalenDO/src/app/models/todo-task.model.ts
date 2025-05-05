// models/todo-task.model.ts
export interface TodoTask {
  id: number;
  title: string;
  done: boolean;
  dueDate: string; // ISO format (e.g. '2025-04-24')
}
