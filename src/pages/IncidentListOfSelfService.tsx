import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { Search, Filter, Plus, ChevronRight, Inbox } from "lucide-react";
import {
  mockTickets,
  type TicketData,
  type Status,
} from "../mock-data/incident";
const CURRENT_USER_EMAIL = "you@company.com";

const statusVariant: Record<
  Status,
  "success" | "info" | "warning" | "secondary"
> = {
  New: "warning",
  "In Progress": "info",
  "On Hold": "warning",
  Resolved: "success",
  Closed: "secondary",
};

type StatusFilter = "all" | "open" | "closed" | Status;

const statusFilters: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "New", label: "New" },
  { value: "In Progress", label: "In Progress" },
  { value: "On Hold", label: "On Hold" },
  { value: "Resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const IncidentListOfSelfService = () => {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Only tickets owned by current requester
  const myTickets = useMemo(
    () => mockTickets.filter((t) => t.requesterEmail === CURRENT_USER_EMAIL),
    [],
  );

  const categories = useMemo(() => {
    const set = new Set(myTickets.map((t) => t.category.split(" > ")[0]));
    return Array.from(set);
  }, [myTickets]);

  const filtered = useMemo(() => {
    return myTickets.filter((t) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q);

      let matchS = true;
      if (statusFilter === "open") matchS = t.status !== "Closed";
      else if (statusFilter === "closed") matchS = t.status === "Closed";
      else if (statusFilter !== "all") matchS = t.status === statusFilter;

      const matchC =
        categoryFilter === "all" || t.category.startsWith(categoryFilter);

      return matchQ && matchS && matchC;
    });
  }, [myTickets, query, statusFilter, categoryFilter]);

  const counts = useMemo(
    () => ({
      all: myTickets.length,
      open: myTickets.filter((t) => t.status !== "Closed").length,
      closed: myTickets.filter((t) => t.status === "Closed").length,
    }),
    [myTickets],
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              My Tickets
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track the status of every incident you've submitted.
            </p>
          </div>
          <Link to="/">
            <Button size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> New Incident
            </Button>
          </Link>
        </div>

        {/* Stat chips */}
        <div className="grid grid-cols-3 gap-3 max-w-lg">
          <button
            onClick={() => setStatusFilter("all")}
            className={`rounded-md border bg-card px-3 py-2 text-left transition-colors ${
              statusFilter === "all"
                ? "border-primary ring-1 ring-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total
            </p>
            <p className="text-lg font-bold text-foreground">{counts.all}</p>
          </button>
          <button
            onClick={() => setStatusFilter("open")}
            className={`rounded-md border bg-card px-3 py-2 text-left transition-colors ${
              statusFilter === "open"
                ? "border-primary ring-1 ring-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Open
            </p>
            <p className="text-lg font-bold text-info">{counts.open}</p>
          </button>
          <button
            onClick={() => setStatusFilter("closed")}
            className={`rounded-md border bg-card px-3 py-2 text-left transition-colors ${
              statusFilter === "closed"
                ? "border-primary ring-1 ring-primary"
                : "border-border hover:border-primary/40"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Closed
            </p>
            <p className="text-lg font-bold text-muted-foreground">
              {counts.closed}
            </p>
          </button>
        </div>

        {/* Filter bar */}
        <Card>
          <CardContent className="p-3 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-55">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, title or category..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Filter className="h-3.5 w-3.5" /> Status
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as StatusFilter)}
            >
              <SelectTrigger className="w-37.5 h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-37.5 h-9 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(query || statusFilter !== "all" || categoryFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-xs"
                onClick={() => {
                  setQuery("");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                }}
              >
                Clear
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Result count */}
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{" "}
          of {myTickets.length} tickets
        </p>

        {/* Ticket list */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center space-y-2">
              <Inbox className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-sm font-medium text-foreground">
                No tickets match your filters
              </p>
              <p className="text-xs text-muted-foreground">
                Try clearing filters or submit a new incident.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filtered.map((t) => (
              <TicketRow key={t.id} ticket={t} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const TicketRow = ({ ticket }: { ticket: TicketData }) => {
  const lastMessage = ticket.thread.filter((m) => !m.isWorknote).slice(-1)[0];

  return (
    <Link to={`/self-service/incidents/${ticket.id}`} className="block group">
      <Card className="transition-all group-hover:border-primary/40 group-hover:shadow-sm">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">
                {ticket.id}
              </span>
              <Badge
                variant={statusVariant[ticket.status]}
                className="text-[10px]"
              >
                {ticket.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-normal">
                {ticket.category}
              </Badge>
            </div>
            <p className="text-sm font-semibold text-foreground truncate">
              {ticket.title}
            </p>
            {lastMessage && (
              <p className="text-xs text-muted-foreground truncate">
                <span className="font-medium">{lastMessage.author}:</span>{" "}
                {lastMessage.message}
              </p>
            )}
          </div>
          <div className="hidden sm:block text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Last update
            </p>
            <p className="text-xs text-foreground">
              {lastMessage?.time ?? "—"}
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
};

export { IncidentListOfSelfService };
