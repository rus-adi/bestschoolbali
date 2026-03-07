"use client";

import * as React from "react";

type SchoolLite = {
  id: string;
  name: string;
  area: string;
};

const WHATSAPP_NUMBER = "6285285408220";

function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function safeTrim(v: string) {
  return String(v ?? "").trim();
}

function cleanLines(lines: Array<string | null | undefined>) {
  return lines
    .map((l) => safeTrim(String(l ?? "")))
    .filter(Boolean)
    .join("\n");
}

export default function GuidanceFormClient({
  areas,
  curriculums,
  budgets,
  schools,
}: {
  areas: string[];
  curriculums: string[];
  budgets: string[];
  schools: SchoolLite[];
}) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [whatsApp, setWhatsApp] = React.useState("");

  const [childAge, setChildAge] = React.useState("");
  const [childGrade, setChildGrade] = React.useState("");

  const [area, setArea] = React.useState("All");
  const [curriculum, setCurriculum] = React.useState("All");
  const [budget, setBudget] = React.useState("All");
  const [timeline, setTimeline] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const [mode, setMode] = React.useState<"parents" | "schools">("parents");
  const [claimId, setClaimId] = React.useState<string | null>(null);

  const [copied, setCopied] = React.useState(false);

  const claimSchool = React.useMemo(() => {
    if (!claimId) return null;
    return schools.find((s) => s.id === claimId) ?? null;
  }, [claimId, schools]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);

    const claim = params.get("claim");
    const school = params.get("school");

    if (claim) {
      setMode("schools");
      setClaimId(claim);
    } else if (school) {
      // Parent flow but prefilled with a school of interest.
      setClaimId(null);
    }

    const areaParam = params.get("area");
    const tagParam = params.get("tag");
    const budgetParam = params.get("budget");

    if (areaParam && (areaParam === "All" || areas.includes(areaParam))) setArea(areaParam);
    if (tagParam && (tagParam === "All" || curriculums.includes(tagParam))) setCurriculum(tagParam);
    if (budgetParam && (budgetParam === "All" || budgets.includes(budgetParam))) setBudget(budgetParam);

    const q = params.get("q");
    if (q) setNotes((prev) => (prev ? prev : `Schools I’m considering: ${q}`));
  }, [areas, curriculums, budgets]);

  const message = React.useMemo(() => {
    if (mode === "schools") {
      const target = claimSchool ? `${claimSchool.name} (${claimSchool.area})` : "a school profile";
      return cleanLines([
        `Hi Best School Bali — I’d like to claim and update ${target}.`,
        "",
        "School representative details:",
        name ? `- Name: ${name}` : null,
        email ? `- Official email: ${email}` : null,
        whatsApp ? `- WhatsApp: ${whatsApp}` : null,
        "",
        notes ? `Requested updates / notes:\n${notes}` : "Requested updates / notes: (please add)",
      ]);
    }

    return cleanLines([
      "Hi Best School Bali — can you help me shortlist schools in Bali?",
      "",
      "Family details:",
      childAge ? `- Child age: ${childAge}` : null,
      childGrade ? `- Current grade / year: ${childGrade}` : null,
      area && area !== "All" ? `- Preferred area(s): ${area}` : null,
      curriculum && curriculum !== "All" ? `- Curriculum preference: ${curriculum}` : null,
      budget && budget !== "All" ? `- Budget band: ${budget}` : null,
      timeline ? `- Timeline: ${timeline}` : null,
      "",
      notes ? `Notes:\n${notes}` : null,
      "",
      "Contact:",
      name ? `- Name: ${name}` : null,
      email ? `- Email: ${email}` : null,
      whatsApp ? `- WhatsApp: ${whatsApp}` : null,
    ]);
  }, [
    mode,
    claimSchool,
    name,
    email,
    whatsApp,
    childAge,
    childGrade,
    area,
    curriculum,
    budget,
    timeline,
    notes,
  ]);

  function openWhatsApp() {
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore
    }
  }

  return (
    <div>
      <div className="toggleRow" role="tablist" aria-label="Contact type">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "parents"}
          className={mode === "parents" ? "toggleBtn isOn" : "toggleBtn"}
          onClick={() => {
            setMode("parents");
            setClaimId(null);
          }}
        >
          Parents
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "schools"}
          className={mode === "schools" ? "toggleBtn isOn" : "toggleBtn"}
          onClick={() => setMode("schools")}
        >
          Schools
        </button>
      </div>

      {mode === "schools" ? (
        <div className="small" style={{ marginTop: 10 }}>
          If you’re a school operator, use this form to request updates, add photos, or ask about verified/featured options.
        </div>
      ) : (
        <div className="small" style={{ marginTop: 10 }}>
          Tell us your area, child age, curriculum preference, and budget. We’ll help you shortlist and draft questions for admissions.
        </div>
      )}

      <div className="formGrid" style={{ marginTop: 14 }}>
        <div>
          <label className="small">Name (optional)</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label className="small">Email (optional)</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            inputMode="email"
          />
        </div>
        <div>
          <label className="small">WhatsApp number (optional)</label>
          <input
            className="input"
            value={whatsApp}
            onChange={(e) => setWhatsApp(e.target.value)}
            placeholder="+62… or +1…"
          />
        </div>

        {mode === "parents" ? (
          <>
            <div>
              <label className="small">Child age (optional)</label>
              <input className="input" value={childAge} onChange={(e) => setChildAge(e.target.value)} placeholder="e.g., 6" />
            </div>
            <div>
              <label className="small">Current grade / year (optional)</label>
              <input
                className="input"
                value={childGrade}
                onChange={(e) => setChildGrade(e.target.value)}
                placeholder="e.g., Year 1"
              />
            </div>
            <div>
              <label className="small">Preferred area</label>
              <select className="select" value={area} onChange={(e) => setArea(e.target.value)}>
                {["All", ...areas].map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="small">Curriculum preference</label>
              <select className="select" value={curriculum} onChange={(e) => setCurriculum(e.target.value)}>
                {["All", ...curriculums].map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="small">Budget band</label>
              <select className="select" value={budget} onChange={(e) => setBudget(e.target.value)}>
                {["All", ...budgets].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="small">Timeline (optional)</label>
              <input
                className="input"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g., starting August"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="small">School to claim (optional)</label>
              <select
                className="select"
                value={claimId ?? ""}
                onChange={(e) => setClaimId(e.target.value || null)}
              >
                <option value="">Select a school…</option>
                {schools
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.area})
                    </option>
                  ))}
              </select>
            </div>
            <div />
          </>
        )}

        <div style={{ gridColumn: "1 / -1" }}>
          <label className="small">
            {mode === "schools" ? "Requested updates / notes" : "Notes (optional)"}
          </label>
          <textarea
            className="textarea"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              mode === "schools"
                ? "Examples: updated fee sheet, admissions dates, photo gallery, verified badge request…"
                : "Anything that matters (language support, commute limits, learning support, start date)…"
            }
          />
        </div>
      </div>

      <div className="formActions">
        <button type="button" className="btn btnPrimary" onClick={openWhatsApp}>
          Message on WhatsApp <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="btn" onClick={copyMessage}>
          {copied ? "Copied" : "Copy message"}
        </button>
      </div>

      <p className="small formNote">
        We don’t store submissions on this website yet. The message opens in WhatsApp so you can review it before sending.
      </p>
    </div>
  );
}
