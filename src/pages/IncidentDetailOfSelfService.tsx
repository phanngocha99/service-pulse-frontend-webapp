import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Card, CardContent } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Textarea } from "../components/Textarea";
import {
  ArrowLeft,
  Send,
  RotateCcw,
  CheckCircle2,
  Paperclip,
} from "lucide-react";
import { mockTickets, statusSteps, type Status } from "../mock-data/incident";

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

const IncidentDetailOfSelfService = () => {
  const { id } = useParams<{ id: string }>();
  const ticket = mockTickets.find((t) => t.id === id);
  const [reply, setReply] = useState("");

  if (!ticket) return <Navigate to="/self-service" replace />;

  // Requester only sees public messages (no internal worknotes)
  const visibleThread = ticket.thread.filter((m) => !m.isWorknote);
  const stepIndex = statusSteps.indexOf(ticket.status);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Breadcrumb / back */}
        <Link
          to="/self-service"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Tickets
        </Link>

        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">
              {ticket.id}
            </span>
            <Badge variant={statusVariant[ticket.status]}>
              {ticket.status}
            </Badge>
            <Badge variant="outline" className="font-normal">
              {ticket.category}
            </Badge>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {ticket.title}
          </h1>
        </div>

        {/* Progress tracker */}
        <Card>
          <CardContent className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
              Progress
            </p>
            <div className="flex items-center gap-1">
              {statusSteps.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold ${
                        i <= stepIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {i < stepIndex ? "✓" : i + 1}
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] mt-1 text-center ${i <= stepIndex ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 -mt-4 ${i < stepIndex ? "bg-primary" : "bg-muted"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ticket details — fields visible to requester */}
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
              Ticket Details
            </p>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <Field label="Short Summary" value={ticket.title} />
              <Field label="Category" value={ticket.category} />
              <Field label="Urgency" value={ticket.urgency} />
              <Field label="Impact" value={ticket.impact} />
              <Field label="Requester" value={ticket.requester} />
              <Field label="Email" value={ticket.requesterEmail} />
              <Field label="Assigned Group" value={ticket.group || "—"} />
              <Field
                label="Assigned To"
                value={ticket.assignee || "Pending assignment"}
              />
            </dl>

            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">
                Description
              </p>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conversation (public only) */}
        <Card>
          <CardContent className="p-4 sm:p-5">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
              Conversation
            </p>
            <div className="space-y-3">
              {visibleThread.map((m, i) => {
                const fromMe =
                  m.author === ticket.requester || m.author === "You";
                return (
                  <div
                    key={i}
                    className={`flex ${fromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3 ${
                        fromMe
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-xs font-semibold ${fromMe ? "text-primary-foreground/90" : "text-foreground"}`}
                        >
                          {fromMe ? "You" : m.author}
                        </span>
                        <span
                          className={`text-[10px] ${fromMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                        >
                          {m.time}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{m.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply box */}
            {ticket.status !== "Closed" && (
              <div className="mt-5 space-y-3">
                <Textarea
                  placeholder="Write a reply to support..."
                  rows={3}
                  className="resize-none"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <Paperclip className="h-3.5 w-3.5" /> Attach file
                  </Button>
                  <div className="flex gap-2">
                    {ticket.status === "Resolved" && (
                      <>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <RotateCcw className="h-3.5 w-3.5" /> Reopen
                        </Button>
                        <Button size="sm" className="gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Close ticket
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={!reply.trim()}
                    >
                      <Send className="h-3.5 w-3.5" /> Send
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-[10px] uppercase tracking-wider text-muted-foreground mb-0.5">
      {label}
    </dt>
    <dd className="text-sm text-foreground">{value}</dd>
  </div>
);

export { IncidentDetailOfSelfService };
