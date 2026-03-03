"use client";

import * as React from "react";

type SchoolLite = {
  id: string;
  name: string;
  area: string;
};

const WHATSAPP_NUMBER = "62111111";

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

export default function ParentNoteFormClient({ school }: { school: SchoolLite }) {
  const [relationship, setRelationship] = React.useState("Parent");
  const [childContext, setChildContext] = React.useState("");
  const [note, setNote] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const message = React.useMemo(() => {
    return cleanLines([
      `Parent note submission — ${school.name} (${school.area})`,
      "",
      `Relationship: ${relationship}`,
      childContext ? `Child age/grade (broad): ${childContext}` : null,
      "",
      "Quote (anonymous):",
      note ? note : "(write 1–3 short sentences)",
      "",
      consent ? "Consent: Yes — ok to publish anonymously" : "Consent: Not confirmed yet",
      "",
      "Please remove any personal identifiers before publishing (names, phone numbers, private details).",
    ]);
  }, [school.name, school.area, relationship, childContext, note, consent]);

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

  const disabled = !safeTrim(note) || !consent;

  return (
    <div>
      <div className="small" style={{ marginTop: 0 }}>
        Share a short note that helps other families. Please keep it anonymous (no full names, no identifying details).
      </div>

      <div className="formGrid" style={{ marginTop: 14 }}>
        <div>
          <label className="small">Relationship</label>
          <select className="select" value={relationship} onChange={(e) => setRelationship(e.target.value)}>
            <option>Parent</option>
            <option>Guardian</option>
            <option>Former parent</option>
            <option>Alumni family</option>
          </select>
        </div>
        <div>
          <label className="small">Child age / grade (broad)</label>
          <input
            className="input"
            value={childContext}
            onChange={(e) => setChildContext(e.target.value)}
            placeholder="e.g., Early Years, Grade 2, Year 8"
          />
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label className="small">Your note (1–3 short sentences)</label>
          <textarea
            className="textarea"
            rows={5}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Example: The teachers were warm and communication was consistent. Our child settled in quickly and loved the outdoor learning time."
          />
          <div className="small muted" style={{ marginTop: 8 }}>
            Tip: Specific notes are most helpful (communication, learning approach, community, transitions, support).
          </div>
        </div>

        <div style={{ gridColumn: "1 / -1" }}>
          <label className="checkboxRow">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span className="small">
              I confirm this note is truthful and I’m happy for it to be published anonymously.
            </span>
          </label>
        </div>
      </div>

      <div className="formActions">
        <button type="button" className="btn btnPrimary" onClick={openWhatsApp} disabled={disabled}>
          Send via WhatsApp <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="btn" onClick={copyMessage}>
          {copied ? "Copied" : "Copy message"}
        </button>
      </div>

      <p className="small formNote">
        This form does not submit to a server. It opens a WhatsApp message so you can review it before sending.
      </p>
    </div>
  );
}
