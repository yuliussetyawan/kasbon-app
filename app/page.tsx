"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Navbar } from "@/components/navbar/navbar-container";
import { useDebts } from "@/hooks/use-debts";
import { SummaryCards } from "@/components/debts/summary-cards";
import { DebtChart } from "@/components/debts/debt-chart";
import { DebtList } from "@/components/debts/debt-list";
import { CreateEditDebtDialog } from "@/components/debts/create-edit-debt-dialog";
import type { Debt } from "@/utils/database.types";

export default function Dashboard() {
  const {
    debts,
    loading,
    error,
    filters,
    setFilters,
    createDebt,
    updateDebt,
    deleteDebt,
    toggleSettled,
  } = useDebts();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search });
  };

  const handleCreate = () => {
    setEditingDebt(null);
    setDialogOpen(true);
  };

  const handleEdit = (debt: Debt) => {
    setEditingDebt(debt);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin mau hapus?")) {
      await deleteDebt(id);
    }
  };

  const handleSubmit = async (data: Parameters<typeof createDebt>[0]) => {
    if (editingDebt) {
      return updateDebt(editingDebt.id, data);
    }
    return createDebt(data);
  };

  return (
    <>
      <Navbar
        searchValue={filters.search}
        onSearchChange={handleSearchChange}
      />
      <main className="container mx-auto p-4 max-w-2xl">
        <SummaryCards debts={debts} />

        {/* Chart */}
        <div className="mt-4">
          <DebtChart debts={debts} />
        </div>

        {/* Error state */}
        {error && (
          <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Action bar */}
        <div className="flex items-center justify-between mt-6 mb-4">
          <h2 className="text-lg font-semibold">Daftar Utang Piutang</h2>
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Catat baru
          </Button>
        </div>

        <DebtList
          debts={debts}
          loading={loading}
          filters={filters}
          onFiltersChange={setFilters}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSettle={toggleSettled}
        />

        <CreateEditDebtDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={handleSubmit}
          debt={editingDebt}
        />
      </main>
    </>
  );
}
