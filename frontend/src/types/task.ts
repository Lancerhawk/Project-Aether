import { TaskStatus, Priority, EnergyLevel } from './enums';

export interface SubTask {
  id: string;
  taskId: string;
  title: string;
  isCompleted: boolean;
  sortOrder: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface TaskTag {
  id: string;
  taskId: string;
  tagId: string;
  tag: Tag;
  createdAt: string;
}

export interface Task {
  id: string;
  userId: string;
  projectId: string | null;
  goalId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  energyLevel: EnergyLevel | null;
  estimatedMinutes: number | null;
  actualMinutes: number | null;
  dueDate: string | null;
  completedAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  subtasks: SubTask[];
  taskTags: TaskTag[];
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId?: string | null;
  goalId?: string | null;
  priority?: Priority;
  energyLevel?: EnergyLevel | null;
  estimatedMinutes?: number | null;
  dueDate?: string | null;
  tagIds?: string[];
  subtasks?: { title: string }[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  projectId?: string | null;
  goalId?: string | null;
  priority?: Priority;
  energyLevel?: EnergyLevel | null;
  estimatedMinutes?: number | null;
  dueDate?: string | null;
  tagIds?: string[];
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: Priority;
  energyLevel?: EnergyLevel;
  projectId?: string;
  goalId?: string;
  tagIds?: string;
  search?: string;
  dueDate?: string;
  dueBefore?: string;
  dueAfter?: string;
  sortBy?: 'sortOrder' | 'priority' | 'dueDate' | 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationMeta;
}
