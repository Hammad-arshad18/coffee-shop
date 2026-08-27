import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -36px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export function Reveal({
  children,
  delay = 0,
  className = "",
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </div>
  );
}

/** Line-mask reveal: each line slides up from behind a clipping mask. */
export function MaskLines({
  lines,
  className = "",
  lineClassName = "",
  step = 110,
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  step?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
          <span
            className={`block transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
              inView ? "translate-y-0" : "translate-y-[112%]"
            } ${lineClassName}`}
            style={{ transitionDelay: `${i * step}ms` }}
          >
            {line}
          </span>
        </span>
      ))}
    </div>
  );
}
