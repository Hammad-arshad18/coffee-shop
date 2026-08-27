import { createContext, useContext, useMemo, type ReactNode } from "react";
import {
  products as seedProducts,
  type Order,
  type OrderStatus,
  type Product,
  type Reservation,
  type ReservationStatus,
  type Table,
} from "../data/products";
import { useLocalStorage } from "./hooks";

export const uid = () => Math.random().toString(36).slice(2, 10);

/* ================= auth · roles · permissions ================= */

export type Role = "admin" | "manager" | "staff" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // demo MVP — stored in plain text, browser-only
  role: Role;
  createdAt: string;
  /** customer shipping profile */
  address?: string;
  city?: string;
  zip?: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Owner · Admin",
  manager: "Manager",
  staff: "Staff",
  customer: "Customer",
};

export type Perm =
  | "orders.advance"
  | "orders.cancel"
  | "menu.create"
  | "menu.edit"
  | "menu.stock"
  | "menu.delete"
  | "tables.manage"
  | "reservations.decide"
  | "team.manage";

export const ROLE_PERMS: Record<Perm, Role[]> = {
  "orders.advance": ["admin", "manager", "staff"],
  "orders.cancel": ["admin", "manager"],
  "menu.create": ["admin", "manager"],
  "menu.edit": ["admin", "manager"],
  "menu.stock": ["admin", "manager"],
  "menu.delete": ["admin"],
  "tables.manage": ["admin", "manager"],
  "reservations.decide": ["admin", "manager", "staff"],
  "team.manage": ["admin"],
};

export const can = (user: User | null, perm: Perm): boolean =>
  !!user && ROLE_PERMS[perm].includes(user.role);

export const PERM_LABEL: Record<Perm, string> = {
  "orders.advance": "Advance orders through the pipeline",
  "orders.cancel": "Cancel orders",
  "menu.create": "Add new roasts",
  "menu.edit": "Edit roasts & pricing",
  "menu.stock": "Mark sold out / restock",
  "menu.delete": "Delete roasts",
  "tables.manage": "Add, edit & close tables",
  "reservations.decide": "Confirm & decline reservations",
  "team.manage": "Manage team accounts & roles",
};

const SEED_USERS: User[] = [
  {
    id: "u-etta",
    name: "Etta Kline",
    email: "admin@cinder.roast",
    password: "ember-214",
    role: "admin",
    createdAt: "2024-03-02T09:00:00.000Z",
  },
  {
    id: "u-marcus",
    name: "Marcus Webb",
    email: "manager@cinder.roast",
    password: "first-crack",
    role: "manager",
    createdAt: "2024-08-19T09:00:00.000Z",
  },
  {
    id: "u-sofia",
    name: "Sofia Reyes",
    email: "staff@cinder.roast",
    password: "slow-pour",
    role: "staff",
    createdAt: "2025-05-30T09:00:00.000Z",
  },
  {
    id: "u-june",
    name: "June Kettle",
    email: "june@kettle.coffee",
    password: "drip-drip",
    role: "customer",
    createdAt: "2025-11-08T09:00:00.000Z",
    address: "1140 SE Ankeny St",
    city: "Portland",
    zip: "97214",
  },
];

/* ================= seeds ================= */

const SEED_TABLES: Table[] = [
  { id: "t-w1", name: "W1", seats: 2, zone: "Window", status: "available" },
  { id: "t-w2", name: "W2", seats: 2, zone: "Window", status: "available" },
  { id: "t-b1", name: "B1", seats: 3, zone: "Bar", status: "available" },
  { id: "t-f1", name: "F1", seats: 4, zone: "Floor", status: "available" },
  { id: "t-f2", name: "F2", seats: 6, zone: "Floor", status: "available" },
  { id: "t-p1", name: "P1", seats: 4, zone: "Patio", status: "available" },
];

interface NewOrder {
  customer: Order["customer"];
  items: Order["items"];
  subtotal: number;
  shipping: number;
  total: number;
  userId: string | null;
}

interface NewReservation {
  name: string;
  email: string;
  tableId: string;
  date: string;
  time: string;
  party: number;
  notes?: string;
  userId?: string | null;
}

interface AuthResult {
  user?: User;
  error?: string;
}

interface DataCtx {
  products: Product[];
  orders: Order[];
  tables: Table[];
  reservations: Reservation[];
  users: User[];
  currentUser: User | null;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  placeOrder: (input: NewOrder) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  upsertTable: (t: Table) => void;
  deleteTable: (id: string) => void;
  addReservation: (input: NewReservation) => Reservation;
  setReservationStatus: (id: string, status: ReservationStatus) => void;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  register: (input: { name: string; email: string; password: string }) => AuthResult;
  updateUser: (id: string, patch: Partial<User>) => void;
  addStaffUser: (input: { name: string; email: string; password: string; role: Role }) => AuthResult;
  setRole: (id: string, role: Role) => void;
  removeUser: (id: string) => void;
}

const Ctx = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useLocalStorage<Product[]>("cinder-menu-v1", seedProducts);
  const [orders, setOrders] = useLocalStorage<Order[]>("cinder-orders-v1", []);
  const [tables, setTables] = useLocalStorage<Table[]>("cinder-tables-v1", SEED_TABLES);
  const [reservations, setReservations] = useLocalStorage<Reservation[]>(
    "cinder-reservations-v1",
    []
  );
  const [users, setUsers] = useLocalStorage<User[]>("cinder-users-v1", SEED_USERS);
  const [sessionId, setSessionId] = useLocalStorage<string | null>("cinder-session-v1", null);

  const currentUser = useMemo(
    () => users.find((u) => u.id === sessionId) ?? null,
    [users, sessionId]
  );

  const value = useMemo<DataCtx>(
    () => ({
      products,
      orders,
      tables,
      reservations,
      users,
      currentUser,
      upsertProduct: (p) =>
        setProducts((list) =>
          list.some((x) => x.id === p.id)
            ? list.map((x) => (x.id === p.id ? p : x))
            : [...list, p]
        ),
      deleteProduct: (id) => setProducts((list) => list.filter((p) => p.id !== id)),
      placeOrder: (input) => {
        const order: Order = {
          id: uid(),
          number: `CDR-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          status: "pending",
          ...input,
        };
        setOrders((list) => [order, ...list]);
        return order;
      },
      setOrderStatus: (id, status) =>
        setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o))),
      upsertTable: (t) =>
        setTables((list) =>
          list.some((x) => x.id === t.id)
            ? list.map((x) => (x.id === t.id ? t : x))
            : [...list, t]
        ),
      deleteTable: (id) => setTables((list) => list.filter((t) => t.id !== id)),
      addReservation: (input) => {
        const table = tables.find((t) => t.id === input.tableId);
        const r: Reservation = {
          id: uid(),
          code: `TBL-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          status: "pending",
          tableName: table?.name ?? "—",
          seats: table?.seats ?? input.party,
          ...input,
        };
        setReservations((list) => [r, ...list]);
        return r;
      },
      setReservationStatus: (id, status) =>
        setReservations((list) => list.map((r) => (r.id === id ? { ...r, status } : r))),

      /* ---- auth ---- */
      login: (email, password) => {
        const u = users.find(
          (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password
        );
        if (!u) return null;
        setSessionId(u.id);
        return u;
      },
      logout: () => setSessionId(null),
      register: ({ name, email, password }) => {
        if (users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase()))
          return { error: "An account with that email already exists." };
        const u: User = {
          id: uid(),
          name: name.trim(),
          email: email.trim(),
          password,
          role: "customer",
          createdAt: new Date().toISOString(),
        };
        setUsers((list) => [...list, u]);
        setSessionId(u.id);
        return { user: u };
      },
      updateUser: (id, patch) =>
        setUsers((list) => list.map((u) => (u.id === id ? { ...u, ...patch } : u))),
      addStaffUser: ({ name, email, password, role }) => {
        if (users.some((x) => x.email.toLowerCase() === email.trim().toLowerCase()))
          return { error: "That email is already on the roster." };
        const u: User = {
          id: uid(),
          name: name.trim(),
          email: email.trim(),
          password,
          role: role === "customer" ? "staff" : role,
          createdAt: new Date().toISOString(),
        };
        setUsers((list) => [...list, u]);
        return { user: u };
      },
      setRole: (id, role) => {
        const target = users.find((u) => u.id === id);
        if (!target) return;
        const adminCount = users.filter((u) => u.role === "admin").length;
        if (target.role === "admin" && role !== "admin" && adminCount <= 1) return; // never drop the last admin
        setUsers((list) => list.map((u) => (u.id === id ? { ...u, role } : u)));
      },
      removeUser: (id) => {
        const target = users.find((u) => u.id === id);
        if (!target) return;
        if (target.role === "admin" && users.filter((u) => u.role === "admin").length <= 1) return;
        setUsers((list) => list.filter((u) => u.id !== id));
        if (sessionId === id) setSessionId(null);
      },
    }),
    [
      products,
      orders,
      tables,
      reservations,
      users,
      currentUser,
      sessionId,
      setProducts,
      setOrders,
      setTables,
      setReservations,
      setUsers,
      setSessionId,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useData(): DataCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}

/* ---- formatting helpers shared by shop + admin ---- */

export const fmtDate = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return d;
  return new Date(y, m - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const todayISO = () => {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};
