import { BeanIcon } from "./Icons";

export interface Toast {
  id: number;
  msg: string;
}

export default function Toasts({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[80] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-5"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast-in flex items-center gap-2.5 rounded-full border border-caramel/40 bg-espresso-850/95 py-2.5 pl-4 pr-5 text-sm font-bold text-cream shadow-[0_20px_50px_-16px_rgba(0,0,0,0.9)] backdrop-blur"
        >
          <BeanIcon className="shrink-0 text-caramel" />
          <span className="truncate">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
