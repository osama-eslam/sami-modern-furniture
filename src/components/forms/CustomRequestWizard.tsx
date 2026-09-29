"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { cn, isValidEgPhone } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { api } from "@/services/api";
import { Icon } from "../ui/Icon";
import { SelectField, TextField } from "./Field";

const MAX_FILES = 5;
const MAX_SIZE = 8 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

type Data = {
  room: string;
  style: string;
  width: string;
  length: string;
  ceiling: string;
  color: string;
  material: string;
  budget: string;
  notes: string;
  name: string;
  phone: string;
  whatsapp: string;
  sameAsPhone: boolean;
};

const initial: Data = { room: "", style: "", width: "", length: "", ceiling: "", color: "", material: "", budget: "", notes: "", name: "", phone: "", whatsapp: "", sameAsPhone: true };

export function CustomRequestWizard() {
  const { dict, locale } = useI18n();
  const c = dict.custom;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Data, string>>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "fallback">("idle");
  const panel = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    panel.current?.focus({ preventScroll: true });
    const top = panel.current?.getBoundingClientRect().top ?? 0;
    if (top < 80 || top > window.innerHeight * 0.6) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, state]);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (s: number) => {
    const e: Partial<Record<keyof Data, string>> = {};
    if (s === 0 && !data.room) e.room = dict.common.fieldRequired;
    if (s === 1 && !data.style) e.style = dict.common.fieldRequired;
    if (s === 4) {
      if (!data.name.trim()) e.name = dict.common.fieldRequired;
      if (!isValidEgPhone(data.phone)) e.phone = dict.common.invalidPhone;
      if (!data.sameAsPhone && data.whatsapp && !isValidEgPhone(data.whatsapp)) e.whatsapp = dict.common.invalidPhone;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate(step) && setStep((s) => Math.min(s + 1, c.steps.length - 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFileError(null);
    const incoming = Array.from(list);
    const bad = incoming.find((f) => !ACCEPT.includes(f.type) || f.size > MAX_SIZE);
    if (bad) setFileError(c.uploadHint);
    const ok = incoming.filter((f) => ACCEPT.includes(f.type) && f.size <= MAX_SIZE);
    setFiles((prev) => {
      const merged = [...prev, ...ok].slice(0, MAX_FILES);
      if (prev.length + ok.length > MAX_FILES) setFileError(c.uploadHint);
      return merged;
    });
  };

  const whatsappNumber = data.sameAsPhone ? data.phone : data.whatsapp || data.phone;

  const summary: [string, string][] = [
    [c.steps[0], data.room ? c.rooms[data.room as keyof typeof c.rooms] : ""],
    [c.steps[1], data.style ? c.styles[data.style as keyof typeof c.styles] : ""],
    [c.width, data.width],
    [c.length, data.length],
    [c.ceiling, data.ceiling],
    [c.color, data.color],
    [c.material, data.material],
    [c.budget, data.budget],
    [c.notes, data.notes],
    [c.name, data.name],
    [c.phone, data.phone],
    [c.whatsapp, whatsappNumber],
  ];

  const waText = [
    `${dict.meta.siteName} — ${dict.nav.custom}`,
    ...summary.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    files.length ? `(${files.length} ${locale === "ar" ? "ملفات سأرسلها في المحادثة" : "files to attach in chat"})` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const submit = async () => {
    if (!validate(4)) return setStep(4);
    setState("sending");
    const form = new FormData();
    (["room", "style", "width", "length", "ceiling", "color", "material", "budget", "notes", "name", "phone"] as const).forEach((k) => form.append(k, data[k]));
    form.append("whatsapp", whatsappNumber);
    form.append("locale", locale);
    files.forEach((f) => form.append("files", f));
    const res = await api.customRequest(form);
    setState(res.ok ? "done" : "fallback");
  };

  if (state === "done") {
    return (
      <div ref={panel} tabIndex={-1} className="flex min-h-[480px] flex-col items-start justify-center gap-6 outline-none" role="status">
        <span className="grid size-16 place-items-center rounded-full bg-success text-ivory">
          <Icon name="check" size={28} />
        </span>
        <h3 className="font-display text-h2 max-w-xl">{c.successTitle}</h3>
        <p className="lead max-w-lg">{c.successBody}</p>
      </div>
    );
  }

  const questions = [c.roomQ, c.styleQ, c.reqQ, c.photosQ, c.contactQ, c.reviewQ];

  return (
    <div>
      {/* Progress */}
      <ol className="grid grid-cols-6 gap-1.5" aria-label={c.start}>
        {c.steps.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && setStep(i)}
              aria-current={i === step ? "step" : undefined}
              className="group block w-full text-start disabled:cursor-default"
            >
              <span className="block h-0.5 overflow-hidden bg-line">
                <span className={cn("block h-full bg-charcoal transition-transform duration-700 origin-left rtl:origin-right", i <= step ? "scale-x-100" : "scale-x-0")} />
              </span>
              <span className={cn("mt-3 hidden text-xs sm:block", i === step ? "text-charcoal" : "text-mute")}>
                <span className="num me-1.5 text-taupe">{String(i + 1).padStart(2, "0")}</span>
                {s}
              </span>
            </button>
          </li>
        ))}
      </ol>
      <p className="num mt-3 text-xs text-mute sm:hidden">
        {String(step + 1).padStart(2, "0")} / {String(c.steps.length).padStart(2, "0")} — {c.steps[step]}
      </p>

      <div ref={panel} tabIndex={-1} className="scroll-mt-[calc(var(--header-h)+2rem)] pt-12 outline-none" key={step} style={{ animation: "fade-up .7s cubic-bezier(.16,1,.3,1) both" }}>
        <fieldset>
          <legend className="font-display mb-10 text-h2">{questions[step]}</legend>

          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(c.rooms).map(([k, label]) => (
                <Choice key={k} name="room" value={k} label={label} checked={data.room === k} onPick={() => set("room", k)} />
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(c.styles).map(([k, label]) => (
                <Choice key={k} name="style" value={k} label={label} checked={data.style === k} onPick={() => set("style", k)} />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-3">
              <TextField label={c.width} type="number" inputMode="numeric" min={0} value={data.width} onChange={(e) => set("width", e.target.value)} optionalLabel={dict.common.optional} dir="ltr" />
              <TextField label={c.length} type="number" inputMode="numeric" min={0} value={data.length} onChange={(e) => set("length", e.target.value)} optionalLabel={dict.common.optional} dir="ltr" />
              <TextField label={c.ceiling} type="number" inputMode="numeric" min={0} value={data.ceiling} onChange={(e) => set("ceiling", e.target.value)} optionalLabel={dict.common.optional} dir="ltr" />
              <TextField label={c.color} value={data.color} onChange={(e) => set("color", e.target.value)} optionalLabel={dict.common.optional} className="sm:col-span-3 md:col-span-1" />
              <TextField label={c.material} value={data.material} onChange={(e) => set("material", e.target.value)} optionalLabel={dict.common.optional} className="sm:col-span-3 md:col-span-1" />
              <SelectField label={c.budget} value={data.budget} onChange={(e) => set("budget", e.target.value)} className="sm:col-span-3 md:col-span-1">
                <option value="">—</option>
                {c.budgets.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </SelectField>
              <TextField label={c.notes} multiline rows={5} value={data.notes} onChange={(e) => set("notes", e.target.value)} className="sm:col-span-3" maxLength={3000} />
            </div>
          )}

          {step === 3 && (
            <div>
              <label
                className="flex cursor-pointer flex-col items-center justify-center gap-4 border border-dashed border-line-strong bg-paper px-6 py-14 text-center transition-colors hover:border-charcoal focus-within:border-charcoal"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles(e.dataTransfer.files);
                }}
              >
                <span className="grid size-14 place-items-center rounded-full border hairline">
                  <Icon name="upload" size={22} />
                </span>
                <span className="font-medium">{c.upload}</span>
                <span className="text-xs text-mute">{c.uploadHint}</span>
                <input type="file" multiple accept={ACCEPT.join(",")} className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }} />
              </label>
              {fileError && <p className="field-error mt-3" role="alert">{fileError}</p>}
              {files.length > 0 && (
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {files.map((f, i) => (
                    <li key={`${f.name}-${i}`} className="flex items-center gap-4 border hairline p-3">
                      <FileThumb file={f} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm" dir="ltr">{f.name}</span>
                        <span className="num text-xs text-mute">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                      </span>
                      <button type="button" onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))} className="grid size-9 place-items-center text-mute hover:text-charcoal" aria-label={`${c.remove} ${f.name}`}>
                        <Icon name="close" size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
              <TextField label={c.name} autoComplete="name" required value={data.name} onChange={(e) => set("name", e.target.value)} error={errors.name} className="sm:col-span-2" />
              <TextField label={c.phone} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required value={data.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} placeholder="01x xxxx xxxx" />
              <div className="flex flex-col gap-3">
                <label className="flex cursor-pointer items-center gap-3 pt-6 text-sm">
                  <input type="checkbox" checked={data.sameAsPhone} onChange={(e) => set("sameAsPhone", e.target.checked)} className="size-4 accent-charcoal" />
                  {c.sameAsPhone}
                </label>
                {!data.sameAsPhone && (
                  <TextField label={c.whatsapp} type="tel" inputMode="tel" dir="ltr" value={data.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} error={errors.whatsapp} />
                )}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <dl className="divide-y hairline border-y hairline text-sm">
                {summary
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-3 sm:gap-4">
                      <dt className="text-mute">{k}</dt>
                      <dd className="whitespace-pre-line sm:col-span-2">{v}</dd>
                    </div>
                  ))}
                {files.length > 0 && (
                  <div className="grid gap-1 py-3.5 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-mute">{c.steps[3]}</dt>
                    <dd className="num sm:col-span-2">{files.length}</dd>
                  </div>
                )}
              </dl>
              {state === "fallback" && (
                <div className="mt-8 border-s-2 border-bronze bg-paper p-5" role="status">
                  <p className="text-sm leading-relaxed text-ink">{c.whatsappFallback}</p>
                  <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-5">
                    <Icon name="whatsapp" size={18} /> {c.sendWhatsapp}
                  </a>
                </div>
              )}
            </div>
          )}
          {(errors.room || errors.style) && (
            <p className="field-error mt-4" role="alert">
              {errors.room || errors.style}
            </p>
          )}
        </fieldset>

        {/* Controls */}
        <div className="mt-12 flex items-center justify-between gap-4 border-t hairline pt-8">
          {step > 0 ? (
            <button type="button" onClick={back} className="inline-flex items-center gap-2 text-sm text-mute hover:text-charcoal">
              <Icon name="arrow" size={16} className="rotate-180 rtl:rotate-0" /> {dict.common.previous}
            </button>
          ) : (
            <span />
          )}
          {step < c.steps.length - 1 ? (
            <button type="button" onClick={next} className="btn btn-primary">
              {dict.common.next} <Icon name="arrow" size={16} className="flip-rtl" />
            </button>
          ) : state !== "fallback" ? (
            <button type="button" onClick={submit} className="btn btn-primary" disabled={state === "sending"}>
              {state === "sending" ? c.sending : c.submit} <Icon name="arrow" size={16} className="flip-rtl" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Choice({ name, value, label, checked, onPick }: { name: string; value: string; label: string; checked: boolean; onPick: () => void }) {
  return (
    <label className="choice items-center justify-between !py-5">
      <input type="radio" name={name} value={value} checked={checked} onChange={onPick} className="sr-only" />
      <span className="text-[0.95rem]">{label}</span>
      <span className={cn("grid size-5 shrink-0 place-items-center rounded-full border transition-colors", checked ? "border-charcoal bg-charcoal text-ivory" : "border-line-strong")}>
        {checked && <Icon name="check" size={12} strokeWidth={2} />}
      </span>
    </label>
  );
}

function FileThumb({ file }: { file: File }) {
  const url = useMemo(() => (file.type.startsWith("image/") && file.type !== "image/heic" ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);
  return (
    <span className="relative grid size-12 shrink-0 place-items-center overflow-hidden bg-stone text-mute">
      {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
      {url ? <img src={url} alt="" className="size-full object-cover" /> : <Icon name="box" size={18} />}
    </span>
  );
}
