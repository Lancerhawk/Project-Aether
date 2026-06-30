import { subtaskRepository } from '../repositories/subtask.repository';
import { taskRepository } from '../repositories/task.repository';
import { AppError } from '../utils';

export const subtaskService = {
  async create(taskId: string, userId: string, title: string) {
    const task = await taskRepository.findById(taskId, userId);
    if (!task) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }

    const sortOrder = await subtaskRepository.getNextSortOrder(taskId);
    return subtaskRepository.create({
      title,
      sortOrder,
      task: { connect: { id: taskId } },
    });
  },

  async update(taskId: string, subtaskId: string, userId: string, data: { title?: string; isCompleted?: boolean }) {
    const task = await taskRepository.findById(taskId, userId);
    if (!task) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }

    const subtask = await subtaskRepository.findById(subtaskId);
    if (!subtask || subtask.taskId !== taskId) {
      throw new AppError('Subtask not found.', 404, 'NOT_FOUND');
    }

    const updateData: Record<string, unknown> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.isCompleted !== undefined) {
      updateData.isCompleted = data.isCompleted;
      updateData.completedAt = data.isCompleted ? new Date() : null;
    }

    return subtaskRepository.update(subtaskId, updateData);
  },

  async remove(taskId: string, subtaskId: string, userId: string) {
    const task = await taskRepository.findById(taskId, userId);
    if (!task) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }

    const subtask = await subtaskRepository.findById(subtaskId);
    if (!subtask || subtask.taskId !== taskId) {
      throw new AppError('Subtask not found.', 404, 'NOT_FOUND');
    }

    await subtaskRepository.delete(subtaskId);
  },

  async reorder(taskId: string, userId: string, items: { id: string; sortOrder: number }[]) {
    const task = await taskRepository.findById(taskId, userId);
    if (!task) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }

    return subtaskRepository.reorder(items);
  },

  async toggleComplete(taskId: string, subtaskId: string, userId: string) {
    const task = await taskRepository.findById(taskId, userId);
    if (!task) {
      throw new AppError('Task not found.', 404, 'NOT_FOUND');
    }

    const subtask = await subtaskRepository.findById(subtaskId);
    if (!subtask || subtask.taskId !== taskId) {
      throw new AppError('Subtask not found.', 404, 'NOT_FOUND');
    }

    const isCompleted = !subtask.isCompleted;
    return subtaskRepository.update(subtaskId, {
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
    });
  },
};
