"use client";

import type { ChangeEvent } from "react";
import type { Language } from "@/data/languages";

interface LanguageDropdownProps {
  languages: Language[];
  /** Currently selected language code, or "" when nothing is selected */
  value: string;
  /** "Choose a language" in the current UI language (shown when nothing is selected) */
  placeholder: string;
  onChange: (code: string) => void;
}

export default function LanguageDropdown({
  languages,
  value,
  placeholder,
  onChange,
}: LanguageDropdownProps) {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const code = event.target.value;
    console.log(`[LanguageDropdown] selection changed — code="${code}"`);
    onChange(code);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-4 text-lg outline-none transition focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeLabel} — {lang.nativeName}
        </option>
      ))}
    </select>
  );
}
