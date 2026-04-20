import { useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { Plus, Play, Save, X, ArrowUpDown, Trash2 } from "lucide-react";
import type { TicketData } from "../mock-data/incident";

export type FieldKey =
  | "id"
  | "title"
  | "priority"
  | "status"
  | "category"
  | "requester"
  | "assignee"
  | "group"
  | "slaDeadline";
export type Operator =
  | "is"
  | "is not"
  | "contains"
  | "does not contain"
  | "starts with"
  | "is empty"
  | "is not empty"
  | ">"
  | "<"
  | ">="
  | "<=";
export type Logic = "AND" | "OR";

export interface Condition {
  id: string;
  logic: Logic; // logic joining this row to the previous row (ignored on first row)
  field: FieldKey;
  operator: Operator;
  value: string;
}

export interface SortRule {
  field: FieldKey;
  direction: "asc" | "desc";
}

export const FIELD_OPTIONS: {
  key: FieldKey;
  label: string;
  type: "text" | "number" | "enum";
  options?: string[];
}[] = [
  { key: "id", label: "ID", type: "text" },
  { key: "title", label: "Title", type: "text" },
  {
    key: "priority",
    label: "Priority",
    type: "enum",
    options: ["P1", "P2", "P3", "P4"],
  },
  {
    key: "status",
    label: "Status",
    type: "enum",
    options: ["New", "In Progress", "On Hold", "Resolved", "Closed"],
  },
  { key: "category", label: "Category", type: "text" },
  { key: "requester", label: "Requester", type: "text" },
  { key: "assignee", label: "Assignee", type: "text" },
  { key: "group", label: "Group", type: "text" },
  { key: "slaDeadline", label: "SLA (minutes)", type: "number" },
];

const TEXT_OPS: Operator[] = [
  "is",
  "is not",
  "contains",
  "does not contain",
  "starts with",
  "is empty",
  "is not empty",
];
const NUM_OPS: Operator[] = [
  "is",
  "is not",
  ">",
  "<",
  ">=",
  "<=",
  "is empty",
  "is not empty",
];
const ENUM_OPS: Operator[] = ["is", "is not", "is empty", "is not empty"];

function operatorsFor(field: FieldKey): Operator[] {
  const f = FIELD_OPTIONS.find((o) => o.key === field)!;
  if (f.type === "number") return NUM_OPS;
  if (f.type === "enum") return ENUM_OPS;
  return TEXT_OPS;
}

function needsValue(op: Operator) {
  return op !== "is empty" && op !== "is not empty";
}

export function evaluateConditions(
  tickets: TicketData[],
  conditions: Condition[],
  sort: SortRule | null,
): TicketData[] {
  let result = tickets.filter((t) => {
    if (conditions.length === 0) return true;
    let acc = matchOne(t, conditions[0]);
    for (let i = 1; i < conditions.length; i++) {
      const c = conditions[i];
      const r = matchOne(t, c);
      acc = c.logic === "OR" ? acc || r : acc && r;
    }
    return acc;
  });
  if (sort) {
    const dir = sort.direction === "asc" ? 1 : -1;
    result = [...result].sort((a, b) => {
      const av = a[sort.field] as unknown as string | number;
      const bv = b[sort.field] as unknown as string | number;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number")
        return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
  }
  return result;
}

function matchOne(t: TicketData, c: Condition): boolean {
  const raw = t[c.field] as unknown;
  const val = raw == null ? "" : String(raw);
  const cmp = c.value;
  switch (c.operator) {
    case "is":
      return val.toLowerCase() === cmp.toLowerCase();
    case "is not":
      return val.toLowerCase() !== cmp.toLowerCase();
    case "contains":
      return val.toLowerCase().includes(cmp.toLowerCase());
    case "does not contain":
      return !val.toLowerCase().includes(cmp.toLowerCase());
    case "starts with":
      return val.toLowerCase().startsWith(cmp.toLowerCase());
    case "is empty":
      return val === "";
    case "is not empty":
      return val !== "";
    case ">":
      return Number(raw) > Number(cmp);
    case "<":
      return Number(raw) < Number(cmp);
    case ">=":
      return Number(raw) >= Number(cmp);
    case "<=":
      return Number(raw) <= Number(cmp);
    default:
      return true;
  }
}

interface Props {
  initialConditions?: Condition[];
  initialSort?: SortRule | null;
  onApply: (conditions: Condition[], sort: SortRule | null) => void;
  onSave?: (conditions: Condition[], sort: SortRule | null) => void;
  onClose: () => void;
}

let uid = 0;
const newId = () => `c${++uid}`;

export function FilterBuilder({
  initialConditions = [],
  initialSort = null,
  onApply,
  onSave,
  onClose,
}: Props) {
  const [conditions, setConditions] = useState<Condition[]>(
    initialConditions.length
      ? initialConditions
      : [
          {
            id: newId(),
            logic: "AND",
            field: "priority",
            operator: "is",
            value: "P1",
          },
        ],
  );
  const [sort, setSort] = useState<SortRule | null>(initialSort);

  const update = (id: string, patch: Partial<Condition>) => {
    setConditions((cs) =>
      cs.map((c) => {
        if (c.id !== id) return c;
        const next = { ...c, ...patch };
        if (patch.field) {
          const ops = operatorsFor(patch.field);
          if (!ops.includes(next.operator)) next.operator = ops[0];
          next.value = "";
        }
        return next;
      }),
    );
  };

  const add = (logic: Logic) => {
    setConditions((cs) => [
      ...cs,
      { id: newId(), logic, field: "status", operator: "is", value: "New" },
    ]);
  };
  const remove = (id: string) =>
    setConditions((cs) => cs.filter((c) => c.id !== id));

  return (
    <div className="border border-border rounded-sm bg-card">
      <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-muted/40">
        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-muted-foreground">
          Condition Builder
        </p>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 space-y-2">
        {conditions.map((c, idx) => {
          const fieldDef = FIELD_OPTIONS.find((o) => o.key === c.field)!;
          const ops = operatorsFor(c.field);
          return (
            <div key={c.id} className="flex flex-wrap items-center gap-2">
              {idx === 0 ? (
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground w-12 text-center">
                  Where
                </span>
              ) : (
                <Select
                  value={c.logic}
                  onValueChange={(v) => update(c.id, { logic: v as Logic })}
                >
                  <SelectTrigger className="w-18 h-8 text-xs font-mono uppercase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">AND</SelectItem>
                    <SelectItem value="OR">OR</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select
                value={c.field}
                onValueChange={(v) => update(c.id, { field: v as FieldKey })}
              >
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map((f) => (
                    <SelectItem key={f.key} value={f.key}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={c.operator}
                onValueChange={(v) => update(c.id, { operator: v as Operator })}
              >
                <SelectTrigger className="w-37.5 h-8 text-xs font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ops.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {needsValue(c.operator) &&
                (fieldDef.type === "enum" ? (
                  <Select
                    value={c.value}
                    onValueChange={(v) => update(c.id, { value: v })}
                  >
                    <SelectTrigger className="w-35 h-8 text-xs">
                      <SelectValue placeholder="Select value" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldDef.options!.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={fieldDef.type === "number" ? "number" : "text"}
                    value={c.value}
                    onChange={(e) => update(c.id, { value: e.target.value })}
                    placeholder="Value"
                    className="h-8 w-45 text-xs font-mono"
                  />
                ))}

              <button
                onClick={() => remove(c.id)}
                className="ml-auto text-muted-foreground hover:text-destructive p-1"
                aria-label="Remove condition"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}

        <div className="flex flex-wrap gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => add("AND")}
          >
            <Plus className="h-3 w-3 mr-1" /> AND
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs"
            onClick={() => add("OR")}
          >
            <Plus className="h-3 w-3 mr-1" /> OR
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border mt-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
            Sort by
          </span>
          <Select
            value={sort?.field ?? "__none"}
            onValueChange={(v) =>
              v === "__none"
                ? setSort(null)
                : setSort({
                    field: v as FieldKey,
                    direction: sort?.direction ?? "asc",
                  })
            }
          >
            <SelectTrigger className="w-40 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none">— None —</SelectItem>
              {FIELD_OPTIONS.map((f) => (
                <SelectItem key={f.key} value={f.key}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {sort && (
            <Select
              value={sort.direction}
              onValueChange={(v) =>
                setSort({ ...sort, direction: v as "asc" | "desc" })
              }
            >
              <SelectTrigger className="w-27.5 h-8 text-xs font-mono uppercase">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Asc</SelectItem>
                <SelectItem value="desc">Desc</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2 bg-muted/30">
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs"
          onClick={() => {
            setConditions([]);
            setSort(null);
            onApply([], null);
          }}
        >
          <Trash2 className="h-3 w-3 mr-1" /> Clear
        </Button>
        {onSave && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            onClick={() => onSave(conditions, sort)}
          >
            <Save className="h-3 w-3 mr-1" /> Save
          </Button>
        )}
        <Button
          size="sm"
          className="h-8 text-xs"
          onClick={() => onApply(conditions, sort)}
        >
          <Play className="h-3 w-3 mr-1" /> Run
        </Button>
      </div>
    </div>
  );
}
