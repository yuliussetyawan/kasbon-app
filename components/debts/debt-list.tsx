"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  Undo2,
  Pencil,
  Trash2,
  Loader2,
  Inbox,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { formatRupiah, formatRelativeDate } from "@/utils/format";
import { groupDebtsByName } from "@/utils/group-debts";
import type { Debt } from "@/utils/database.types";
import type { DebtFilterInput } from "@/utils/schema";

interface DebtListProps {
  debts: Debt[];
  loading: boolean;
  filters: DebtFilterInput;
  onFiltersChange: (filters: DebtFilterInput) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onSettle: (id: string) => void;
}

export function DebtList({
  debts,
  loading,
  filters,
  onFiltersChange,
  onEdit,
  onDelete,
  onSettle,
}: DebtListProps) {
  const groups = groupDebtsByName(debts);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.status}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              status: v as DebtFilterInput["status"],
            })
          }
        >
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="belum">Belum lunas</SelectItem>
            <SelectItem value="lunas">Lunas</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type}
          onValueChange={(v) =>
            onFiltersChange({ ...filters, type: v as DebtFilterInput["type"] })
          }
        >
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="owed_to_me">Dihutang ke saya</SelectItem>
            <SelectItem value="i_owe">Saya hutang</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Empty state */}
      {!loading && debts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Inbox className="h-12 w-12 mb-3" />
          <p className="text-lg font-medium">Belum ada data</p>
          <p className="text-sm">Mulai catat utang piutang kamu</p>
        </div>
      )}

      {/* Debt list - auto-grouped */}
      {!loading && groups.length > 0 && (
        <div className="space-y-2">
          {groups.map((group) =>
            group.count === 1 ? (
              <DebtCard
                key={group.debts[0].id}
                debt={group.debts[0]}
                onEdit={() => onEdit(group.debts[0])}
                onDelete={() => onDelete(group.debts[0].id)}
                onSettle={() => onSettle(group.debts[0].id)}
              />
            ) : (
              <GroupedCard
                key={group.name}
                group={group}
                onEdit={onEdit}
                onDelete={onDelete}
                onSettle={onSettle}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}

function GroupedCard({
  group,
  onEdit,
  onDelete,
  onSettle,
}: {
  group: ReturnType<typeof groupDebtsByName>[number];
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
  onSettle: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const unsettledCount = group.debts.filter((d) => !d.settled_at).length;

  return (
    <Card>
      <CardContent className="py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full text-left"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground cursor-pointer" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground cursor-pointer" />
          )}
          <span className="font-medium">{group.name}</span>
          <Badge variant="outline" className="shrink-0">
            {group.count} entry
          </Badge>
          {unsettledCount > 0 && (
            <Badge variant="secondary" className="shrink-0">
              {unsettledCount} belum lunas
            </Badge>
          )}
          <span className="ml-auto font-semibold">
            {formatRupiah(group.totalAmount)}
          </span>
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pl-6 space-y-2 border-l-2 border-muted">
            {group.debts.map((debt) => (
              <DebtRow
                key={debt.id}
                debt={debt}
                onEdit={() => onEdit(debt)}
                onDelete={() => onDelete(debt.id)}
                onSettle={() => onSettle(debt.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DebtRow({
  debt,
  onEdit,
  onDelete,
  onSettle,
}: {
  debt: Debt;
  onEdit: () => void;
  onDelete: () => void;
  onSettle: () => void;
}) {
  const isSettled = !!debt.settled_at;
  const isOwedToMe = debt.type === "owed_to_me";

  return (
    <div className="flex items-center gap-2 py-1">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={isOwedToMe ? "default" : "secondary"}
            className="shrink-0 text-xs"
          >
            {isOwedToMe ? "Dihutang" : "Hutang"}
          </Badge>
          <span className="text-sm">{formatRupiah(debt.amount)}</span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeDate(debt.created_at)}
          </span>
          {isSettled && (
            <Badge
              variant="outline"
              className="shrink-0 text-green-600 border-green-600 text-xs"
            >
              Lunas
            </Badge>
          )}
        </div>
        {debt.note && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {debt.note}
          </p>
        )}
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        {isSettled ? (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onSettle}
            title="Batalkan lunas"
          >
            <Undo2 className="h-3.5 w-3.5 text-orange-500" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onSettle}
            title="Tandai lunas"
          >
            <Check className="h-3.5 w-3.5 text-green-600" />
          </Button>
        )}
        <Button variant="ghost" size="icon-xs" onClick={onEdit} title="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" onClick={onDelete} title="Hapus">
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

function DebtCard({
  debt,
  onEdit,
  onDelete,
  onSettle,
}: {
  debt: Debt;
  onEdit: () => void;
  onDelete: () => void;
  onSettle: () => void;
}) {
  const isSettled = !!debt.settled_at;
  const isOwedToMe = debt.type === "owed_to_me";

  return (
    <Card className={isSettled ? "opacity-60" : ""}>
      <CardContent className="flex items-center gap-3 py-3">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium truncate">
              {debt.counterpart_name}
            </span>
            <Badge
              variant={isOwedToMe ? "default" : "secondary"}
              className="shrink-0"
            >
              {isOwedToMe ? "Dihutang" : "Hutang"}
            </Badge>
            {isSettled && (
              <Badge
                variant="outline"
                className="shrink-0 text-green-600 border-green-600"
              >
                Lunas
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatRupiah(debt.amount)}</span>
            <span>·</span>
            <span>{formatRelativeDate(debt.created_at)}</span>
          </div>
          {debt.note && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {debt.note}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isSettled ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onSettle}
              title="Batalkan lunas"
            >
              <Undo2 className="h-4 w-4 text-orange-500" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onSettle}
              title="Tandai lunas"
            >
              <Check className="h-4 w-4 text-green-600" />
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={onEdit} title="Edit">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            title="Hapus"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
