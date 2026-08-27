import { useState } from "react";
import { CheckIcon, CloseIcon, MinusIcon, PlusIcon, ShieldIcon } from "../components/Icons";
import {
  fmtDate,
  PERM_LABEL,
  ROLE_LABEL,
  ROLE_PERMS,
  useData,
  type Perm,
  type Role,
} from "../lib/store";

const STAFF_ROLES: Role[] = ["staff", "manager", "admin"];
const MATRIX_ROLES: Role[] = ["staff", "manager", "admin"];

const inputCls =
  "w-full rounded-lg border border-cream/15 bg-espresso-850 px-3.5 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-mocha/60 hover:border-cream/25 focus:border-caramel/70";

const avatarTone: Record<Role, string> = {
  admin: "bg-caramel text-espresso-950",
  manager: "bg-honey/80 text-espresso-950",
  staff: "bg-espresso-700 text-cream",
  customer: "bg-espresso-800 text-latte",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function TeamAdmin() {
  const { users, currentUser, addStaffUser, setRole, removeUser } = useData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRoleChoice] = useState<Role>("staff");
  const [error, setError] = useState("");
  const [added, setAdded] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const team = users.filter((u) => u.role !== "customer");
  const customers = users.filter((u) => u.role === "customer").length;
  const adminCount = team.filter((u) => u.role === "admin").length;

  const submit = () => {
    if (name.trim().length < 2) return setError("Name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Add a valid email.");
    if (password.length < 6) return setError("Password needs at least 6 characters.");
    const res = addStaffUser({ name, email, password, role });
    if (res.error) return setError(res.error);
    setError("");
    setAdded(`${res.user!.name} joined as ${ROLE_LABEL[res.user!.role]}.`);
    setName("");
    setEmail("");
    setPassword("");
    setRoleChoice("staff");
    window.setTimeout(() => setAdded(""), 3000);
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-medium">Team & roles</h2>
          <p className="mt-1 text-sm text-mocha">
            {team.length} on the roster · {customers} customer account{customers === 1 ? "" : "s"} ·
            only you can manage this page.
          </p>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-caramel/40 bg-caramel/10 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-caramel">
          <ShieldIcon /> Admin only
        </span>
      </div>

      {/* add member */}
      <div className="mt-6 rounded-xl border border-cream/10 bg-espresso-900 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-caramel">Add to the roster</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_0.9fr_auto]">
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Temp password" />
          <select className={`${inputCls} cursor-pointer`} value={role} onChange={(e) => setRoleChoice(e.target.value as Role)}>
            {STAFF_ROLES.map((r) => (
              <option key={r} value={r}>{ROLE_LABEL[r]}</option>
            ))}
          </select>
          <button
            onClick={submit}
            className="flex items-center justify-center gap-2 rounded-lg bg-caramel px-5 py-2.5 text-xs font-extrabold uppercase tracking-[0.1em] text-espresso-950 transition-colors hover:bg-honey"
          >
            <PlusIcon /> Add
          </button>
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-[#e58a63]">{error}</p>}
        {added && <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-sage"><CheckIcon /> {added}</p>}
      </div>

      {/* roster */}
      <ul className="mt-6 space-y-2.5">
        {team.map((u) => {
          const isSelf = u.id === currentUser?.id;
          const lastAdmin = u.role === "admin" && adminCount <= 1;
          return (
            <li
              key={u.id}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-cream/10 bg-espresso-900 px-4 py-4 transition-colors hover:border-cream/20 sm:flex-nowrap"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full font-display text-base font-bold ${avatarTone[u.role]}`}>
                {initials(u.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-bold text-cream">
                  {u.name}
                  {isSelf && (
                    <span className="rounded-full border border-cream/20 px-2 py-0.5 text-[9.5px] font-extrabold uppercase tracking-[0.14em] text-mocha">
                      you
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[12.5px] text-mocha">
                  {u.email} · joined {fmtDate(u.createdAt.slice(0, 10))}
                </p>
              </div>

              <select
                value={u.role}
                disabled={isSelf || lastAdmin}
                onChange={(e) => setRole(u.id, e.target.value as Role)}
                aria-label={`Role for ${u.name}`}
                className="cursor-pointer rounded-lg border border-cream/15 bg-espresso-850 px-3 py-2 text-xs font-bold text-cream outline-none transition-colors hover:border-caramel/50 focus:border-caramel/70 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                ))}
              </select>

              {isSelf || lastAdmin ? (
                <span className="w-[74px] text-center text-[10px] font-bold uppercase tracking-[0.1em] text-mocha/70">
                  {isSelf ? "—" : "last admin"}
                </span>
              ) : confirmRemove === u.id ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      removeUser(u.id);
                      setConfirmRemove(null);
                    }}
                    className="rounded-lg bg-clay px-3 py-2 text-[11px] font-extrabold uppercase text-cream hover:bg-[#a84425]"
                  >
                    Sure?
                  </button>
                  <button onClick={() => setConfirmRemove(null)} className="rounded-lg border border-cream/15 px-2.5 py-2 text-[11px] font-bold text-latte hover:text-cream">
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmRemove(u.id)}
                  className="rounded-lg border border-cream/15 px-3 py-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-mocha transition-colors hover:border-clay/60 hover:text-[#e58a63]"
                >
                  Remove
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {/* permissions matrix */}
      <div className="mt-10 overflow-hidden rounded-xl border border-cream/10 bg-espresso-900">
        <div className="border-b border-cream/10 px-5 py-4">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.26em] text-caramel">Permissions matrix</h3>
          <p className="mt-1 text-[12.5px] text-mocha">What each role can do across the console — enforced everywhere, not just hidden.</p>
        </div>
        <div className="warm-scroll overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-cream/10 text-[10px] font-extrabold uppercase tracking-[0.2em] text-mocha">
                <th className="px-5 py-3 font-extrabold">Capability</th>
                {MATRIX_ROLES.map((r) => (
                  <th key={r} className="px-4 py-3 text-center font-extrabold">{ROLE_LABEL[r].split(" · ")[0]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(Object.keys(PERM_LABEL) as Perm[]).map((perm, i) => (
                <tr key={perm} className={i % 2 ? "bg-espresso-850/40" : ""}>
                  <td className="px-5 py-3 text-[13px] text-latte">{PERM_LABEL[perm]}</td>
                  {MATRIX_ROLES.map((r) => {
                    const allowed = ROLE_PERMS[perm].includes(r);
                    return (
                      <td key={r} className="px-4 py-3 text-center">
                        {allowed ? (
                          <CheckIcon className="inline text-base text-sage" />
                        ) : (
                          <MinusIcon className="inline text-base text-cream/20" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="flex items-center gap-2 border-t border-cream/10 px-5 py-3.5 text-[11.5px] text-mocha">
          <CloseIcon className="text-xs" />
          The last admin can't be demoted or removed — someone always holds the keys.
        </p>
      </div>
    </div>
  );
}
