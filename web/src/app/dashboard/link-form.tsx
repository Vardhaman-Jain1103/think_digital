"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

interface LinkFormProps {
  existingLink?: {
    id: string;
    title: string;
    url: string;
    icon: string | null;
    isPublic: boolean;
    sortOrder: number;
  };
  onClose?: () => void;
}

export function LinkForm({ existingLink, onClose }: LinkFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(existingLink?.title ?? "");
  const [url, setUrl] = useState(existingLink?.url ?? "");
  const [icon, setIcon] = useState(existingLink?.icon ?? "");
  const [isPublic, setIsPublic] = useState(existingLink?.isPublic ?? true);
  const [sortOrder, setSortOrder] = useState(existingLink?.sortOrder ?? 0);

  const isEditing = Boolean(existingLink);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = {
      title,
      url,
      icon: icon || undefined,
      isPublic,
      sortOrder,
    };

    startTransition(async () => {
      try {
        const res = await fetch(
          isEditing ? `/api/links/${existingLink!.id}` : "/api/links",
          {
            method: isEditing ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!res.ok) {
          const data = await res.json();
          setError(data.error ?? "Something went wrong");
          return;
        }

        router.refresh();
        if (onClose) onClose();
        if (!isEditing) {
          setTitle("");
          setUrl("");
          setIcon("");
          setIsPublic(true);
          setSortOrder(0);
        }
      } catch {
        setError("Network error");
      }
    });
  }

  async function handleDelete() {
    if (!existingLink) return;
    if (!confirm("Delete this link?")) return;

    startTransition(async () => {
      const res = await fetch(`/api/links/${existingLink.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
        if (onClose) onClose();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/80 p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-100">
          {isEditing ? "Edit link" : "Add new link"}
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-zinc-500 hover:text-zinc-300"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <p className="rounded bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-[11px] text-zinc-500">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={100}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
            placeholder="Portfolio"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-zinc-500">URL *</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
            placeholder="https://example.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-zinc-500">
            Icon (emoji)
          </label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            maxLength={10}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
            placeholder="🔗"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] text-zinc-500">
            Sort order
          </label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            min={0}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-emerald-500 focus:ring-emerald-500"
        />
        <label htmlFor="isPublic" className="text-xs text-zinc-400">
          Public (visible on your profile)
        </label>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {isPending ? "Saving…" : isEditing ? "Update" : "Add link"}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-full border border-red-500/50 px-4 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-60"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
