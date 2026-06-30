'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '@/services/tag.service';
import { CreateTagInput, UpdateTagInput } from '@/types/tag';

export function useTags(search?: string) {
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading, error } = useQuery({
    queryKey: ['tags', search],
    queryFn: () => tagService.list(search),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTagInput) => tagService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagInput }) => tagService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tagService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  return {
    tags,
    isLoading,
    error,
    createTag: createMutation.mutateAsync,
    updateTag: updateMutation.mutateAsync,
    deleteTag: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}
