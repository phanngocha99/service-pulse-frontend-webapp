import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import {
  mockTickets,
  priorityColors,
  incidentQueues,
} from "../mock-data/incident";
import {
  AlertTriangle,
  Clock,
  Filter,
  Inbox,
  Search,
  Users,
  ExternalLink,
} from "lucide-react";
import { toast } from "../hooks/useToast";
import {
  FilterBuilder,
  evaluateConditions,
  type Condition,
  type SortRule,
} from "../components/FilterBuilder";

const queueIcons: Record<string, React.ElementType> = {
  "my-group": Users,
  unassigned: Inbox,
  breaching: AlertTriangle,
  all: Clock,
};

function filterByQueue(queue: string) {
  switch (queue) {
    case "unassigned":
      return mockTickets.filter((t) => !t.assignee);
    case "breaching":
      return mockTickets.filter((t) => t.slaDeadline < 60);
    case "my-group":
      return mockTickets.filter((t) => t.group === "Network Team");
    default:
      return mockTickets;
  }
}

const IncidentListOfServiceDesk = () => {
  const [params, setParams] = useSearchParams();
  const queue = params.get("queue") || "all";
  const [query, setQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [sort, setSort] = useState<SortRule | null>(null);

  const tickets = useMemo(() => {
    let base = filterByQueue(queue);
    if (query) {
      const q = query.toLowerCase();
      base = base.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.requester.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      );
    }
    return evaluateConditions(base, conditions, sort);
  }, [queue, query, conditions, sort]);

  const activeQueue =
    incidentQueues.find((q) => q.slug === queue) ?? incidentQueues[3];
  const activeFilterCount = conditions.length + (sort ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Hero */}
        <div className="bg-primary text-primary-foreground rounded-sm px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mt-1">
              {activeQueue.label}
            </h1>
            <p className="text-xs opacity-80 mt-0.5">
              {activeQueue.description}
            </p>
          </div>
          <span className="font-mono tabular-nums text-sm font-black opacity-90">
            {String(tickets.length)} incidents
          </span>
        </div>

        {/* Queue chips */}
        <div className="flex flex-wrap gap-2">
          {incidentQueues.map((q) => {
            const Icon = queueIcons[q.slug];
            const active = q.slug === queue;
            return (
              <button
                key={q.slug}
                onClick={() =>
                  setParams(q.slug === "all" ? {} : { queue: q.slug })
                }
                className={`cursor-pointer inline-flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {q.label}
              </button>
            );
          })}
        </div>

        {/* Search + Filter toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, title, requester, category..."
              className="pl-9 font-mono text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button
            variant={showFilter ? "default" : "outline"}
            size="sm"
            className="h-10 text-xs"
            onClick={() => setShowFilter((s) => !s)}
          >
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Filter
            {activeFilterCount > 0 && (
              <span className="ml-1.5 rounded-sm bg-primary-foreground/20 px-1.5 py-0.5 font-mono tabular-nums text-[10px]">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {showFilter && (
          <FilterBuilder
            initialConditions={conditions}
            initialSort={sort}
            onClose={() => setShowFilter(false)}
            onApply={(c, s) => {
              setConditions(c);
              setSort(s);
              toast({
                title: "Filter applied",
                description: `${c.length} condition(s)${s ? `, sorted by ${s.field} ${s.direction}` : ""}`,
              });
            }}
            onSave={(c, s) => {
              setConditions(c);
              setSort(s);
              toast({
                title: "Filter saved",
                description: "Saved to this view (mock).",
              });
            }}
          />
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-4 py-2 font-semibold">ID</th>
                    <th className="text-left px-4 py-2 font-semibold">Title</th>
                    <th className="text-left px-4 py-2 font-semibold">
                      Priority
                    </th>
                    <th className="text-left px-4 py-2 font-semibold">
                      Status
                    </th>
                    <th className="text-left px-4 py-2 font-semibold">
                      Requester
                    </th>
                    <th className="text-left px-4 py-2 font-semibold">Group</th>
                    <th className="text-left px-4 py-2 font-semibold">SLA</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center text-muted-foreground py-10 text-sm"
                      >
                        No incidents match your filter.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((t) => (
                      <tr
                        key={t.id}
                        className="border-t hover:bg-muted/40 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-mono text-xs">
                          <Link
                            to={`/service-desk/incidents/${t.id}`}
                            className="text-primary hover:underline"
                          >
                            {t.id}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 max-w-xs truncate">
                          {t.title}
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge
                            className={`${priorityColors[t.priority]} text-[10px] font-bold`}
                          >
                            {t.priority}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-xs">{t.status}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {t.requester}
                        </td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">
                          {t.group}
                        </td>
                        <td className="px-4 py-2.5 text-xs font-mono tabular-nums">
                          <span
                            className={
                              t.slaDeadline < 30
                                ? "text-sla-breached font-semibold"
                                : t.slaDeadline < 120
                                  ? "text-sla-near"
                                  : "text-foreground"
                            }
                          >
                            {t.slaDeadline}m
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                          >
                            <Link to={`/service-desk/incidents/${t.id}`}>
                              Details <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { IncidentListOfServiceDesk };
