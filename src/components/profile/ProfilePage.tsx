"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, User, Globe, Layers, Folder, Grid, Filter } from 'lucide-react';
import {
  fetchPublicUserByUsername,
  fetchPublicPrompts,
  fetchPublicTools,
  fetchPublicCategories,
  countPublicPrompts,
  countPublicTools,
  type PromptRow,
  type ToolRow,
  type CategoryRow,
} from '../../lib/data';
import PromptCard from '../generated/PromptCard';
import ToolCard from '../generated/ToolCard';

const PAGE_SIZE = 24;
type TabKey = 'all' | 'prompts' | 'tools' | 'projects' | 'stacks';

export default function ProfilePage() {
  const { username } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [promptCats, setPromptCats] = useState<CategoryRow[]>([]);
  const [toolCats, setToolCats] = useState<CategoryRow[]>([]);
  const [promptCount, setPromptCount] = useState(0);
  const [toolCount, setToolCount] = useState(0);
  const [promptPage, setPromptPage] = useState(0);
  const [toolPage, setToolPage] = useState(0);
  const tab = (searchParams.get('tab') as TabKey) || 'all';
  const sort = (searchParams.get('sort') as 'created_desc' | 'title_asc') || 'created_desc';
  const q = searchParams.get('q') || '';

  const setTab = (t: TabKey) => setSearchParams((p) => { p.set('tab', t); return p; });
  const setSort = (s: 'created_desc' | 'title_asc') => setSearchParams((p) => { p.set('sort', s); return p; });
  const setQ = (val: string) => setSearchParams((p) => { if (val) p.set('q', val); else p.delete('q'); return p; });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (!username) throw new Error('Missing username');
        const p = await fetchPublicUserByUsername(username);
        if (!mounted) return;
        if (!p) {
          setError('not_found');
          setLoading(false);
          return;
        }
        setProfile(p);
        // counts
        const [pc, tc, pcats, tcats] = await Promise.all([
          countPublicPrompts(p.id),
          countPublicTools(p.id),
          fetchPublicCategories(p.id, 'prompt'),
          fetchPublicCategories(p.id, 'tool'),
        ]);
        if (!mounted) return;
        setPromptCount(pc);
        setToolCount(tc);
        setPromptCats(pcats);
        setToolCats(tcats);
        // initial pages
        const [firstPrompts, firstTools] = await Promise.all([
          fetchPublicPrompts(p.id, { from: 0, to: PAGE_SIZE - 1, sort }),
          fetchPublicTools(p.id, { from: 0, to: PAGE_SIZE - 1, sort }),
        ]);
        if (!mounted) return;
        setPrompts(firstPrompts);
        setTools(firstTools);
        setPromptPage(0);
        setToolPage(0);
      } catch (e: any) {
        console.error('Profile load failed', e);
        if (!mounted) return;
        setError('load_error');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, sort]);

  const filteredPrompts = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return prompts;
    return prompts.filter((p) =>
      p.title?.toLowerCase().includes(qq) || (p.tags || []).some((t) => t.toLowerCase().includes(qq))
    );
  }, [prompts, q]);
  const filteredTools = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return tools;
    return tools.filter((t) =>
      (t.name || '').toLowerCase().includes(qq) || (t.description || '').toLowerCase().includes(qq)
    );
  }, [tools, q]);

  const groupedPrompts = useMemo(() => {
    const map = new Map<string, { cat?: CategoryRow; items: PromptRow[] }>();
    filteredPrompts.forEach((p) => {
      const key = p.category || 'uncategorized';
      const entry = map.get(key) || { cat: promptCats.find((c) => c.id === key), items: [] };
      entry.items.push(p);
      map.set(key, entry);
    });
    return Array.from(map.entries());
  }, [filteredPrompts, promptCats]);
  const groupedTools = useMemo(() => {
    const map = new Map<string, { cat?: CategoryRow; items: ToolRow[] }>();
    filteredTools.forEach((t) => {
      const key = t.category || 'uncategorized';
      const entry = map.get(key) || { cat: toolCats.find((c) => c.id === key), items: [] };
      entry.items.push(t);
      map.set(key, entry);
    });
    return Array.from(map.entries());
  }, [filteredTools, toolCats]);

  const loadMorePrompts = async () => {
    if (!profile) return;
    const next = promptPage + 1;
    const from = next * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const more = await fetchPublicPrompts(profile.id, { from, to, sort });
    setPrompts((prev) => [...prev, ...more]);
    setPromptPage(next);
  };
  const loadMoreTools = async () => {
    if (!profile) return;
    const next = toolPage + 1;
    const from = next * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const more = await fetchPublicTools(profile.id, { from, to, sort });
    setTools((prev) => [...prev, ...more]);
    setToolPage(next);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto p-6">
          <div className="h-40 rounded-2xl bg-slate-200/50 dark:bg-slate-800 animate-pulse" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-slate-200/50 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error === 'not_found') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center text-slate-600 dark:text-slate-300">Profile not found or not public.</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center text-slate-600 dark:text-slate-300">Failed to load profile.</div>
      </div>
    );
  }

  const display = profile?.display_name || profile?.username || 'User';
  const avatarUrl = profile?.avatar_url || '';

  const statProjects = promptCats.length; // project categories with public prompts
  const statStacks = toolCats.length; // stack categories with public tools

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <User className="w-6 h-6 text-slate-500" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-900 dark:text-white font-semibold truncate">{display}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400 truncate">@{profile?.username}</div>
          </div>
          <a href={`/profile/${profile?.username}`} target="_blank" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm">
            <ExternalLink className="w-4 h-4" />
            Open
          </a>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
            <div className="px-2 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">{promptCount} Prompts</div>
            <div className="px-2 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">{toolCount} Tools</div>
            <div className="px-2 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">{statProjects} Projects</div>
            <div className="px-2 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">{statStacks} Stacks</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            {([
              ['all', 'All'],
              ['prompts', 'Prompts'],
              ['tools', 'Tools'],
              ['projects', 'Projects'],
              ['stacks', 'Stacks'],
            ] as [TabKey, string][]).map(([k, label]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 rounded-full text-sm border ${tab === k ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'}`}>{label}</button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="pl-9 pr-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200" />
            </div>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="px-3 py-2 rounded-lg text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
              <option value="created_desc">Newest</option>
              <option value="title_asc">Title A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-10">
        {tab === 'all' && (
          <div className="space-y-8">
            <section>
              <h3 className="text-slate-700 dark:text-slate-200 font-semibold mb-3">Prompts</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrompts.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">No prompts yet.</div>
                ) : (
                  filteredPrompts.map((p) => (
                    <PromptCard key={p.id} title={p.title} description={p.content} tags={p.tags || []} model={p.model} coverImage={p.cover_image || undefined} readOnly />
                  ))
                )}
              </div>
              {(prompts.length < promptCount) && (
                <div className="mt-4"><button onClick={loadMorePrompts} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Load more prompts</button></div>
              )}
            </section>
            <section>
              <h3 className="text-slate-700 dark:text-slate-200 font-semibold mb-3">Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTools.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400">No tools yet.</div>
                ) : (
                  filteredTools.map((t) => (
                    <ToolCard key={t.id} name={t.name} description={t.description || ''} url={t.url} favicon={t.favicon || undefined} readOnly />
                  ))
                )}
              </div>
              {(tools.length < toolCount) && (
                <div className="mt-4"><button onClick={loadMoreTools} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Load more tools</button></div>
              )}
            </section>
          </div>
        )}

        {tab === 'prompts' && (
          <div>
            {groupedPrompts.map(([catId, group]) => (
              <div key={catId} className="mb-6">
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{group.cat?.name || 'Uncategorized'}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((p) => (
                    <PromptCard key={p.id} title={p.title} description={p.content} tags={p.tags || []} model={p.model} coverImage={p.cover_image || undefined} readOnly />
                  ))}
                </div>
              </div>
            ))}
            {(prompts.length < promptCount) && (
              <div className="mt-4"><button onClick={loadMorePrompts} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Load more</button></div>
            )}
          </div>
        )}

        {tab === 'tools' && (
          <div>
            {groupedTools.map(([catId, group]) => (
              <div key={catId} className="mb-6">
                <div className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">{group.cat?.name || 'Uncategorized'}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((t) => (
                    <ToolCard key={t.id} name={t.name} description={t.description || ''} url={t.url} favicon={t.favicon || undefined} readOnly />
                  ))}
                </div>
              </div>
            ))}
            {(tools.length < toolCount) && (
              <div className="mt-4"><button onClick={loadMoreTools} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Load more</button></div>
            )}
          </div>
        )}

        {tab === 'projects' && (
          <div className="space-y-6">
            {promptCats.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">No public projects yet.</div>
            ) : (
              promptCats.map((c) => (
                <div key={c.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">{c.name}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPrompts.filter((p) => p.category === c.id).map((p) => (
                      <PromptCard key={p.id} title={p.title} description={p.content} tags={p.tags || []} model={p.model} coverImage={p.cover_image || undefined} readOnly />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'stacks' && (
          <div className="space-y-6">
            {toolCats.length === 0 ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">No public stacks yet.</div>
            ) : (
              toolCats.map((c) => (
                <div key={c.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">{c.name}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTools.filter((t) => t.category === c.id).map((t) => (
                      <ToolCard key={t.id} name={t.name} description={t.description || ''} url={t.url} favicon={t.favicon || undefined} readOnly />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

