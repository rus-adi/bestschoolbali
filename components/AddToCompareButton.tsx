'use client';

import React from 'react';

const COMPARE_STORAGE_KEY = 'bsb_compare_ids_v1';

function uniq(ids: string[]) {
  const out: string[] = [];
  for (const id of ids) {
    const v = String(id || '').trim();
    if (!v) continue;
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

function readIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(COMPARE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return uniq(parsed.map(String));
    return uniq(String(raw).split(',').map((s) => s.trim()));
  } catch {
    return [];
  }
}

function writeIds(ids: string[]) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

export default function AddToCompareButton({ schoolId }: { schoolId: string }) {
  const [ids, setIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    setIds(readIds());
  }, []);

  const selected = ids.includes(schoolId);

  function toggle() {
    setIds((prev) => {
      const next = selected ? prev.filter((x) => x !== schoolId) : uniq(prev.concat(schoolId));
      const trimmed = next.slice(0, 4);
      writeIds(trimmed);
      return trimmed;
    });
  }

  return (
    <>
      <button type="button" className={selected ? 'btn btnPrimary' : 'btn'} onClick={toggle} aria-pressed={selected}>
        {selected ? 'Added to compare' : 'Add to compare'}
      </button>
      <a className="btn" href="/compare">
        Compare
      </a>
    </>
  );
}
