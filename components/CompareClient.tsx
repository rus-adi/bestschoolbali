'use client';

import React from 'react';
import type { School } from '../lib/schools';
import { slugify } from '../lib/slug';

const STORAGE_KEY = 'bsb_compare_ids_v1';

function uniq(ids: string[]) {
  const out: string[] = [];
  for (const id of ids) {
    const v = String(id || '').trim();
    if (!v) continue;
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

function parseIdsFromQuery(): string[] {
  if (typeof window === 'undefined') return [];
  const params = new URLSearchParams(window.location.search);
  const raw = params.get('ids');
  if (!raw) return [];
  return uniq(
    raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

function readStoredIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return uniq(parsed.map(String));
    if (typeof raw === 'string') return uniq(raw.split(',').map((s) => s.trim()));
    return [];
  } catch {
    return [];
  }
}

function writeStoredIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

function buildCompareUrl(ids: string[]) {
  const clean = uniq(ids).slice(0, 4);
  if (!clean.length) return '/compare';
  return `/compare?ids=${encodeURIComponent(clean.join(','))}`;
}

export default function CompareClient({ schools }: { schools: Array<Pick<School, 'id' | 'name' | 'area' | 'type' | 'fees' | 'budget_category' | 'age_min' | 'age_max' | 'curriculum_tags' | 'website' | 'map_query' | 'summary'>> }) {
  const byId = React.useMemo(() => new Map(schools.map((s) => [s.id, s] as const)), [schools]);

  const [ids, setIds] = React.useState<string[]>([]);
  const [q, setQ] = React.useState('');

  // Initialize from query first, then localStorage.
  React.useEffect(() => {
    const fromQuery = parseIdsFromQuery();
    if (fromQuery.length) {
      setIds(fromQuery.slice(0, 4));
      writeStoredIds(fromQuery.slice(0, 4));
      return;
    }

    const stored = readStoredIds();
    if (stored.length) setIds(stored.slice(0, 4));
  }, []);

  // Keep localStorage in sync.
  React.useEffect(() => {
    writeStoredIds(ids);
  }, [ids]);

  const selected = React.useMemo(() => ids.map((id) => byId.get(id)).filter(Boolean) as School[], [ids, byId]);

  const suggestions = React.useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    const exclude = new Set(ids);
    return schools
      .filter((s) => !exclude.has(s.id))
      .filter((s) => {
        const blob = `${s.name} ${s.area} ${s.type ?? ''} ${(s.curriculum_tags ?? []).join(' ')}`.toLowerCase();
        return blob.includes(query);
      })
      .slice(0, 8);
  }, [q, ids, schools]);

  function add(id: string) {
    setIds((prev) => uniq(prev.concat(id)).slice(0, 4));
    setQ('');
  }

  function remove(id: string) {
    setIds((prev) => prev.filter((x) => x !== id));
  }

  function clear() {
    setIds([]);
    setQ('');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('ids');
      window.history.replaceState({}, '', url.toString());
    }
  }

  async function copyLink() {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${buildCompareUrl(ids)}` : '';
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      alert('Compare link copied.');
    } catch {
      // Fallback
      try {
        const el = document.createElement('textarea');
        el.value = url;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert('Compare link copied.');
      } catch {
        alert('Could not copy link.');
      }
    }
  }

  const compareUrl = buildCompareUrl(ids);

  return (
    <div>
      <div className="compareBar">
        <div className="small">
          <strong>{ids.length}</strong> selected (up to 4)
          {ids.length < 2 ? <span className="muted"> · add at least 2 to compare</span> : null}
        </div>
        <div className="inlineLinks" style={{ marginTop: 0 }}>
          <a className="btn" href="/schools">
            Browse schools
          </a>
          <button className="btn" type="button" onClick={copyLink} disabled={!ids.length}>
            Copy link
          </button>
          <button className="btn" type="button" onClick={clear} disabled={!ids.length}>
            Clear
          </button>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Add schools</h2>
        <p className="small" style={{ marginTop: 0 }}>
          Search by name, area, or curriculum tag. This is a quick comparison tool — always confirm the latest fee sheet and
          availability with admissions.
        </p>

        <div className="compareAdd">
          <input
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Type a school name (e.g., Green School, Canggu, Montessori)"
            aria-label="Search schools to add"
          />

          {suggestions.length ? (
            <div className="compareSuggest" role="listbox" aria-label="Suggestions">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  className="compareSuggestItem"
                  type="button"
                  onClick={() => add(s.id)}
                >
                  <span className="compareSuggestTitle">{s.name}</span>
                  <span className="small compareSuggestMeta">
                    {s.area}
                    {s.type ? ` · ${s.type}` : ''}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {selected.length ? (
          <div className="compareSelected" style={{ marginTop: 12 }}>
            {selected.map((s) => (
              <div key={s.id} className="compareChip">
                <img src={`/img/schools/${s.id}.webp`} alt="" aria-hidden="true" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 800, lineHeight: 1.2 }}>
                    <a href={`/schools/${s.id}`}>{s.name}</a>
                  </div>
                  <div className="small">
                    <a href={`/areas/${slugify(s.area)}`}>{s.area}</a>
                  </div>
                </div>
                <button className="btn btnTiny" type="button" onClick={() => remove(s.id)} aria-label={`Remove ${s.name}`}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="small" style={{ marginTop: 12 }}>
            Tip: you can also add schools from the directory using the “Compare” toggle.
          </p>
        )}
      </div>

      {selected.length >= 2 ? (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="sectionHead">
            <h2 style={{ margin: 0 }}>Side‑by‑side comparison</h2>
            <a className="sectionLink" href={compareUrl} aria-label="Shareable compare link">
              Share this view
            </a>
          </div>

          <div className="compareTableWrap" style={{ marginTop: 14 }}>
            <table className="compareTable">
              <thead>
                <tr>
                  <th scope="col">Field</th>
                  {selected.map((s) => (
                    <th key={s.id} scope="col">
                      <a href={`/schools/${s.id}`}>{s.name}</a>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Area</th>
                  {selected.map((s) => (
                    <td key={s.id}>
                      <a href={`/areas/${slugify(s.area)}`}>{s.area}</a>
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Type</th>
                  {selected.map((s) => (
                    <td key={s.id}>{s.type ?? '—'}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Ages</th>
                  {selected.map((s) => (
                    <td key={s.id}>
                      {typeof s.age_min === 'number' && typeof s.age_max === 'number' ? `${s.age_min}–${s.age_max}` : 'Not listed'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Curriculum</th>
                  {selected.map((s) => (
                    <td key={s.id}>
                      {(s.curriculum_tags ?? []).length ? (s.curriculum_tags ?? []).slice(0, 8).join(', ') : 'Not listed'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Budget</th>
                  {selected.map((s) => (
                    <td key={s.id}>{s.budget_category ?? '—'}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Fees</th>
                  {selected.map((s) => (
                    <td key={s.id}>
                      {s.fees?.display ?? 'Contact school'}
                      {s.fees?.status === 'estimate' ? <span className="pill">Estimate</span> : null}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row">Website</th>
                  {selected.map((s) => (
                    <td key={s.id}>
                      {s.website ? (
                        <a href={s.website} target="_blank" rel="noreferrer">
                          Open
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="inlineLinks" style={{ marginTop: 14 }}>
            <a className="btn" href="/fees">
              Fees guide
            </a>
            <a className="btn" href="/schools">
              Keep browsing
            </a>
            <a className="btn btnPrimary" href="/contact">
              Get free guidance
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
