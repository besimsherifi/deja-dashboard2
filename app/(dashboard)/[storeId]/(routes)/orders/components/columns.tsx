"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Produkten",
  },
  {
    accessorKey: "phone",
    header: "Mobil",
  },
  {
    accessorKey: "address",
    header: "Adresse",
  },
  {
    accessorKey: "totalPrice",
    header: "Gesamtpreis",
  },
  {
    accessorKey: "isPaid",
    header: "Bezahlt",
  },
];