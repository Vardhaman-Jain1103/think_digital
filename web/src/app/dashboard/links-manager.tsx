"use client";

import { useState } from "react";
import { LinkForm } from "./link-form";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  isPublic: boolean;
  sortOrder: number;
  clickCount: number;
}

interface LinksManagerProps {
  links: Link[];
}

export function LinksManager({ links }: LinksManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-100 sm:text-base">
          Links &amp; analytics
        </h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full border border-emerald-500/50 px-3 py-1 text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
        >
          {showAddForm ? "Cancel" : "+ Add link"}
        </button>
      </div>

      {showAddForm && (
        <LinkForm onClose={() => setShowAddForm(false)} />
      )}

      {links.length === 0 && !showAddForm ? (
        <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-400 sm:text-sm">
          You have no links yet. Click "Add link" above to create your first one.
        </div>
      ) : (
        <div className="space-y-2">
          {links.map((link) =>
            editingId === link.id ? (
              <LinkForm
                key={link.id}
                existingLink={link}
                onClose={() => setEditingId(null)}
              />
            ) : (
              <div
                key={link.id}
                className="flex items-center justify-between rounded-xl bg-zinc-950/80 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {link.icon && (
                    <span className="text-lg">{link.icon}</span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-zinc-100">
                      {link.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">
                      {link.url}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "rounded-full px-2 py-0.5 text-[10px] " +
                      (link.isPublic
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                        : "bg-zinc-900 text-zinc-400 border border-zinc-700")
                    }
                  >
                    {link.isPublic ? "public" : "private"}
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {link.clickCount} clicks
                  </span>
                  <button
                    onClick={() => setEditingId(link.id)}
                    className="text-xs text-zinc-500 hover:text-zinc-300"
                  >
                    Edit
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
