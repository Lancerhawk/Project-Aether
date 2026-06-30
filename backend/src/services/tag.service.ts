import { tagRepository } from '../repositories/tag.repository';
import { AppError } from '../utils';

export const tagService = {
  async list(userId: string) {
    return tagRepository.findByUserId(userId);
  },

  async search(userId: string, query: string) {
    return tagRepository.search(userId, query);
  },

  async create(userId: string, data: { name: string; color: string }) {
    return tagRepository.create({ userId, name: data.name, color: data.color });
  },

  async update(id: string, userId: string, data: { name?: string; color?: string }) {
    const tag = await tagRepository.findById(id);
    if (!tag || tag.userId !== userId) {
      throw new AppError('Tag not found.', 404, 'NOT_FOUND');
    }
    return tagRepository.update(id, data);
  },

  async remove(id: string, userId: string) {
    const tag = await tagRepository.findById(id);
    if (!tag || tag.userId !== userId) {
      throw new AppError('Tag not found.', 404, 'NOT_FOUND');
    }
    await tagRepository.delete(id);
  },
};
