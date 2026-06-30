'use client';

import { useState, useRef, useEffect } from 'react';
import { Tag } from '@/types/tag';
import { useTags } from '@/hooks/useTags';

interface TagSelectorProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
}

export function TagSelector({ selectedTagIds, onChange }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const { tags, createTag, isCreating } = useTags();

  const filteredTags = tags.filter((t: Tag) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleToggleTag(tagId: string) {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    onChange(next);
  }

  async function handleCreateTag(tagName: string) {
    if (!tagName.trim()) return;
    const colors = ['#6366f1', '#f43f5e', '#34d399', '#fbbf24', '#a78bfa', '#60a5fa', '#f97316', '#ec4899'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const tag = await createTag({ name: tagName.trim(), color });
    onChange([...selectedTagIds, tag.id]);
    setNewTagName('');
    setSearch('');
  }

  const selectedTags = tags.filter((t: Tag) => selectedTagIds.includes(t.id));

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-wrap items-center gap-1 min-h-[36px] px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-transparent cursor-pointer hover:border-[rgba(255,255,255,0.12)] transition-colors"
      >
        {selectedTags.length > 0 ? (
          selectedTags.map((tag: Tag) => (
            <span
              key={tag.id}
              className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] rounded-md font-medium"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              {tag.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleTag(tag.id);
                }}
                className="hover:opacity-70"
              >
                ×
              </button>
            </span>
          ))
        ) : (
          <span className="text-sm text-[#5a5a66]">Select tags...</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0c0c0f] shadow-xl overflow-hidden">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags..."
              className="w-full bg-[#14141a] rounded-md px-3 py-1.5 text-sm text-[#eeeef0] placeholder-[#5a5a66] focus:outline-none"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredTags.map((tag: Tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <button
                  type="button"
                  key={tag.id}
                  onClick={() => handleToggleTag(tag.id)}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[#14141a] ${
                    isSelected ? 'text-[#eeeef0]' : 'text-[#94949e]'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1">{tag.name}</span>
                  {isSelected && (
                    <svg className="w-4 h-4 text-[#6366f1]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                </button>
              );
            })}
            {filteredTags.length === 0 && search && (
              <div className="px-3 py-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewTagName(search);
                    handleCreateTag(search);
                  }}
                  disabled={isCreating}
                  className="text-sm text-[#818cf8] hover:text-[#6366f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  + Create &quot;{search}&quot;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
