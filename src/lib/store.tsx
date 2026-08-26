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
}

interface NewReservation {
  name: string;
  email: string;
  tableId: string;
  date: string;
  time: string;
  party: number;
  notes?: string;
}

interface DataCtx {
  products: Product[];
  orders: Order[];
  tables: Table[];
  reservations: Reservation[];
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  placeOrder: (input: NewOrder) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  upsertTable: (t: Table) => void;
  deleteTable: (id: string) => void;
  addReservation: (input: NewReservation) => Reservation;
  setReservationStatus: (id: string, status: ReservationStatus) => void;
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

  const value = useMemo<DataCtx>(
    () => ({
      products,
      orders,
      tables,
      reservations,
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
    }),
    [products, orders, tables, reservations, setProducts, setOrders, setTables, setReservations]
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
