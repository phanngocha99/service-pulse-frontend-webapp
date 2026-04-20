import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Input } from "../components/Input";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Label } from "../components/Label";
import { Textarea } from "../components/Textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tab";
import { Switch } from "../components/Switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import { ArrowLeft, ChevronRight, Clock, Save, Send } from "lucide-react";
import {
  type HistoryEntry,
  type TicketData,
  type ThreadMessage,
  mockTickets,
  priorityColors,
  statusSteps,
} from "../mock-data/incident";

function SLATimer({ minutes }: { minutes: number }) {
  const [remaining, setRemaining] = useState(minutes * 60);

  useEffect(() => {
    setRemaining(minutes * 60);
    const interval = setInterval(
      () => setRemaining((r) => Math.max(0, r - 1)),
      1000,
    );
    return () => clearInterval(interval);
  }, [minutes]);

  const hrs = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;
  const pct = (remaining / (minutes * 60)) * 100;
  const isBreaching = pct < 10;
  const isNear = pct < 30 && !isBreaching;

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Clock
        className={`h-4 w-4 sm:h-5 sm:w-5 ${isBreaching ? "text-sla-breached" : isNear ? "text-sla-near" : "text-sla-ok"}`}
      />
      <div>
        <span
          className={`text-sm sm:text-lg font-mono font-bold tabular-nums ${
            isBreaching
              ? "text-sla-breached animate-pulse-sla"
              : isNear
                ? "text-sla-near"
                : "text-foreground"
          }`}
        >
          {String(hrs).padStart(2, "0")}:{String(mins).padStart(2, "0")}:
          {String(secs).padStart(2, "0")}
        </span>
        <div className="w-20 sm:w-32 h-1.5 rounded-full bg-muted mt-1">
          <div
            className={`h-full rounded-full transition-all ${
              isBreaching
                ? "bg-sla-breached"
                : isNear
                  ? "bg-sla-near"
                  : "bg-sla-ok"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function HistoryTimeline({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="space-y-3">
      {history.map((h, i) => (
        <div
          key={i}
          className="relative pl-4 pb-3 border-l-2 border-border last:border-transparent"
        >
          <div className="absolute -left-1.25 top-1 w-2 h-2 rounded-full bg-primary" />
          <p className="text-[10px] text-muted-foreground font-mono">
            {h.time}
          </p>
          <p className="text-xs text-foreground mt-0.5">
            <span className="font-medium">{h.user}</span> changed{" "}
            <span className="font-medium">{h.field}</span>
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            {h.from} <ChevronRight className="h-3 w-3" /> {h.to}
          </p>
        </div>
      ))}
    </div>
  );
}

function ThreadItem({ msg }: { msg: ThreadMessage }) {
  if (msg.isWorknote) {
    return (
      <div className="bg-worknote rounded-md p-3 border border-warning/30">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {msg.author}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {msg.time}
          </span>
          <Badge variant="warning" className="text-[9px] px-1.5 py-0">
            Internal Worknote
          </Badge>
        </div>
        <p className="text-sm text-foreground">{msg.message}</p>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
        {msg.author[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">
            {msg.author}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">
            {msg.time}
          </span>
          <Badge variant="outline" className="text-[9px] px-1.5 py-0">
            Public
          </Badge>
        </div>
        <p className="text-sm text-foreground mt-0.5">{msg.message}</p>
      </div>
    </div>
  );
}

const IncidentDetailOfServiceDesk = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDirty, setIsDirty] = useState(false);
  const [draft, setDraft] = useState("");
  const [asWorknote, setAsWorknote] = useState(false);
  const [thread, setThread] = useState<ThreadMessage[] | null>(null);

  const ticket: TicketData | undefined = mockTickets.find((t) => t.id === id);

  useEffect(() => {
    setThread(ticket ? ticket.thread : null);
    setDraft("");
    setAsWorknote(false);
  }, [id, ticket]);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto p-10 text-center space-y-3">
          <h1 className="text-xl font-semibold">Incident not found</h1>
          <p className="text-sm text-muted-foreground">
            The incident "{id}" does not exist.
          </p>
          <Button asChild>
            <Link to="/workspace">Back to incident list</Link>
          </Button>
        </div>
      </div>
    );
  }

  const stepIndex = statusSteps.indexOf(ticket.status);
  const currentThread = thread ?? ticket.thread;

  const sendMessage = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const time = now.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    setThread([
      ...currentThread,
      { author: "You", message: draft.trim(), time, isWorknote: asWorknote },
    ]);
    setDraft("");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex-1">
        {/* Header */}
        <div className="bg-accent p-2 flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3 sm:gap-4">
            <span
              className={`text-xl sm:text-3xl font-black ${priorityColors[ticket.priority]} px-2 sm:px-3 py-1 rounded-sm`}
            >
              {ticket.priority}
            </span>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-foreground">
                {ticket.id}: {ticket.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {ticket.category} • {ticket.requester}
              </p>
            </div>
          </div>
          <SLATimer minutes={ticket.slaDeadline} />
        </div>

        {/* Status Stepper */}
        <div className="flex items-center w-full gap-0 mb-5 overflow-hidden rounded-md border border-border bg-muted/30">
          {statusSteps.map((step, i) => {
            const isProcessed = i <= stepIndex;
            const isLast = i === statusSteps.length - 1;
            const isFirst = i === 0;

            return (
              <div
                key={step}
                className={`relative flex-1 h-9 sm:h-11 flex items-center justify-center transition-all duration-300 ${
                  isProcessed
                    ? "bg-primary text-primary-foreground font-bold"
                    : "bg-muted text-muted-foreground"
                }`}
                style={{
                  clipPath: isFirst
                    ? "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%)"
                    : isLast
                      ? "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 5% 50%)"
                      : "polygon(0% 0%, 95% 0%, 100% 50%, 95% 100%, 0% 100%, 5% 50%)",
                }}
              >
                <span className="text-[9px] sm:text-[10px] lg:text-[11px] uppercase tracking-tight text-center px-2 z-10 truncate">
                  {step}
                </span>
                {isProcessed && !isLast && i < stepIndex && (
                  <div
                    className="absolute right-0 w-[1px] h-full bg-primary-foreground/20 z-20"
                    style={{ clipPath: "polygon(100% 0, 100% 100%, 0% 50%)" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Detail Form */}
        <Card className="mb-5">
          <CardContent className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Requester</Label>
              <Input
                value={ticket.requester}
                readOnly
                className="bg-muted/50 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input
                value={ticket.requesterEmail}
                readOnly
                className="bg-muted/50 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Impact</Label>
              <Select
                defaultValue={ticket.impact}
                onValueChange={() => setIsDirty(true)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High"].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Urgency</Label>
              <Select
                defaultValue={ticket.urgency}
                onValueChange={() => setIsDirty(true)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Low", "Medium", "High"].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Assignment Group
              </Label>
              <Select
                defaultValue={ticket.group}
                onValueChange={() => setIsDirty(true)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Network Team",
                    "Application Team",
                    "Desktop Team",
                    "Security Team",
                  ].map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Assignee</Label>
              <Input
                defaultValue={ticket.assignee || "Unassigned"}
                onChange={() => setIsDirty(true)}
                className="text-sm"
              />
            </div>
            <div className="sm:col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">
                Description
              </Label>
              <p className="text-sm text-foreground bg-muted/30 rounded-md p-3">
                {ticket.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs: Conversation + History */}
        <Tabs defaultValue="conversation">
          <TabsList>
            <TabsTrigger value="conversation" className="text-xs sm:text-sm">
              Conversation
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              History Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conversation" className="space-y-3 mt-3">
            {currentThread.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No messages yet.
              </p>
            ) : (
              currentThread.map((m, i) => <ThreadItem key={i} msg={m} />)
            )}

            {/* Composer */}
            <div
              className={`rounded-md border p-3 mt-4 transition-colors ${asWorknote ? "bg-worknote border-warning/40" : "bg-card border-border"}`}
            >
              <Textarea
                placeholder={
                  asWorknote
                    ? "Write an internal worknote (not visible to requester)..."
                    : "Reply to requester..."
                }
                rows={2}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="resize-none text-sm bg-transparent border-0 focus-visible:ring-0 px-0 shadow-none"
              />
              <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-border/60">
                <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer select-none">
                  <Switch
                    checked={asWorknote}
                    onCheckedChange={setAsWorknote}
                  />
                  <span
                    className={
                      asWorknote
                        ? "font-semibold text-warning-foreground"
                        : "text-muted-foreground"
                    }
                  >
                    Mark as internal worknote
                  </span>
                </label>
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  {asWorknote ? "Post Worknote" : "Send Reply"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-3">
            <Card>
              <CardContent className="p-4">
                <HistoryTimeline history={ticket.history} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Save Button */}
      {isDirty && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            onClick={() => setIsDirty(false)}
            className="shadow-lg"
          >
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export { IncidentDetailOfServiceDesk };
