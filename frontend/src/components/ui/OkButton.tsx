"use client";

interface OkButtonProps {
  /** Localized "OK" text (e.g. "ठीक है") */
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

export default function OkButton({ label, disabled, onClick }: OkButtonProps) {
  const handleClick = () => {
    console.log(`[OkButton] click — label="${label}", disabled=${disabled ?? false}`);
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="rounded-xl bg-zinc-900 px-6 py-3 text-base font-semibold text-white transition enabled:hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-black dark:enabled:hover:bg-zinc-300"
    >
      {label}
    </button>
  );
}
