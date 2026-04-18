import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { cn } from "../libs/utils";
import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Textarea } from "../components/Textarea";
import { Card, CardContent } from "../components/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/Select";
import {
  CloudUpload,
  Cloud,
  Lock,
  Laptop,
  ShieldCheck,
  Zap,
  LogIn,
  AlertTriangle,
  Info,
  Asterisk,
} from "lucide-react";
import { MandatoryGuide } from "../components/MandatoryGuide";
import { Tag } from "../components/Tag";

const categories: Record<
  string,
  { items: string[]; icon: React.ElementType; description: string }
> = {
  Hardware: {
    items: ["Laptop", "Desktop", "Printer", "Monitor"],
    icon: Laptop,
    description:
      "Physical device failures, peripheral requests, or workstation repairs.",
  },
  Software: {
    items: ["Email", "ERP", "VPN", "Office Suite"],
    icon: Cloud,
    description:
      "Application bugs, license issues, or software installation requests.",
  },
  Network: {
    items: ["Wi-Fi", "VPN Access", "Internet", "Firewall"],
    icon: Zap,
    description:
      "Connectivity problems, VPN access, or firewall configuration.",
  },
  Access: {
    items: ["Account Unlock", "Permission Request", "New Account"],
    icon: Lock,
    description:
      "SSO failures, MFA resets, or permission elevations for tools.",
  },
};

const mandatoryFieldsInit = [
  {
    label: "Short Description",
    id: "short-description",
    stateKey: "shortDescription",
  },
  { label: "Project", id: "project", stateKey: "project" },
  { label: "Subcategory", id: "subcategory", stateKey: "subcategory" },
  { label: "Description", id: "description", stateKey: "description" },
];

const IncidentCreation = () => {
  const { isAuthenticated } = useAuth();

  // Consolidate form state into a single object
  const [formData, setFormData] = useState({
    shortDescription: "",
    project: "",
    subcategory: "",
    description: "",
  });

  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Derived state
  const subcategories = formData.project
    ? categories[formData.project]?.items || []
    : [];

  // Automatically calculate missing fields based on current formData
  const missingFields = useMemo(() => {
    return mandatoryFieldsInit.filter((field) => {
      const value = formData[field.stateKey as keyof typeof formData];
      return !value || value.trim() === "";
    });
  }, [formData]);

  const isFieldCompleted = useCallback(
    (id: string) => !missingFields.some((f) => f.id === id),
    [missingFields],
  );

  // Unified change handler
  const handleFieldChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
        // Automatically clear subcategory if the main project category changes
        ...(field === "project" && { subcategory: "" }),
      }));
    },
    [],
  );

  // Reset form completely when submitting another incident
  const handleReset = useCallback(() => {
    setFormData({
      shortDescription: "",
      project: "",
      subcategory: "",
      description: "",
    });
    setSubmitted(false);
  }, []);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-24 px-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-10 pb-10 space-y-5">
              <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-success" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Incident Submitted
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your report has been received. A support engineer will review
                  it shortly.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">
                  Reference Number
                </p>
                <p className="text-lg font-semibold text-primary font-mono">
                  INC00{Math.floor(Math.random() * 900 + 100)}
                </p>
              </div>

              {isAuthenticated ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-left space-y-2 scroll-mt-20">
                  <p className="text-sm font-medium text-foreground">
                    ✓ Logged in — Ticket linked to your account
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You can track this ticket's progress, receive updates, and
                    communicate with the support team from{" "}
                    <Link
                      to="/self-service"
                      className="text-primary font-medium hover:underline"
                    >
                      My Tickets
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-left space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        Submitted as Guest
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This ticket is publicly visible and not linked to an
                        account. You won't be able to track its progress or
                        receive personal updates.
                      </p>
                    </div>
                  </div>
                  <Link to="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 mt-1"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      Log in to track your tickets
                    </Button>
                  </Link>
                </div>
              )}

              <Button onClick={handleReset} className="w-full">
                Submit Another Incident
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <header className="py-12 sm:py-16 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight leading-[1.15] text-foreground mb-4">
            Tell us what's happening.
            <span className="block text-muted-foreground mt-1">
              We'll take it from here.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Choose a project to begin your report.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 lg:gap-12">
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
              Incident Details
            </h2>

            <Card>
              <CardContent className="pt-6 space-y-6">
                {!isAuthenticated ? (
                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-foreground">
                        You're submitting as a guest
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Guest tickets are publicly visible and cannot be tracked
                        privately.{" "}
                        <Link
                          to="/login"
                          className="text-primary font-medium hover:underline"
                        >
                          Log in
                        </Link>{" "}
                        to link this ticket to your account and track progress
                        from "My Tickets".
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Logged in — this ticket will be linked to your account for
                      private tracking.
                    </p>
                  </div>
                )}

                <MandatoryGuide fields={missingFields} />

                <div className="space-y-2 scroll-mt-20">
                  <div className="flex">
                    <Label htmlFor="short-description">Short Description</Label>
                    <Asterisk
                      className={cn(
                        "shrink-0 inline transition-colors duration-300",
                        isFieldCompleted("short-description")
                          ? "text-success"
                          : "text-destructive",
                      )}
                      size={14}
                      strokeWidth={3}
                    />
                  </div>

                  <Input
                    id="short-description"
                    value={formData.shortDescription}
                    placeholder="What is the primary issue?"
                    className="h-12 text-base"
                    onChange={(e) =>
                      handleFieldChange("shortDescription", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 scroll-mt-20">
                  <div className="flex">
                    <Label htmlFor="project">Project</Label>
                    <Asterisk
                      className={cn(
                        "shrink-0 inline transition-colors duration-300",
                        isFieldCompleted("project")
                          ? "text-success"
                          : "text-destructive",
                      )}
                      size={14}
                      strokeWidth={3}
                    />
                  </div>
                  <div id="project" className="relative">
                    <Select
                      value={formData.project}
                      onValueChange={(v) => handleFieldChange("project", v)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select project..." />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        {Object.keys(categories).map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 scroll-mt-20">
                  <div className="flex">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Asterisk
                      className={cn(
                        "shrink-0 inline transition-colors duration-300",
                        isFieldCompleted("subcategory")
                          ? "text-success"
                          : "text-destructive",
                      )}
                      size={14}
                      strokeWidth={3}
                    />
                  </div>
                  {!formData.project && (
                    <div className="rounded-lg border border-primary/20 p-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Please select a{" "}
                        <Tag
                          field={{ label: "Project", id: "project" }}
                          className="inline"
                        />{" "}
                        first to enable the{" "}
                        <Tag
                          field={{ label: "Subcategory", id: "subcategory" }}
                          className="inline"
                        />{" "}
                        options.
                      </p>
                    </div>
                  )}

                  <div id="subcategory" className="relative">
                    <Select
                      value={formData.subcategory}
                      disabled={!formData.project}
                      onValueChange={(v) => handleFieldChange("subcategory", v)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select subcategory..." />
                      </SelectTrigger>
                      <SelectContent side="bottom">
                        {subcategories.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div id="description" className="space-y-2 scroll-mt-20">
                  <div className="flex">
                    <Label htmlFor="description">Description</Label>
                    <Asterisk
                      className={cn(
                        "shrink-0 inline transition-colors duration-300",
                        isFieldCompleted("description")
                          ? "text-success"
                          : "text-destructive",
                      )}
                      size={14}
                      strokeWidth={3}
                    />
                  </div>
                  <Textarea
                    value={formData.description}
                    placeholder="What happened? Include any error codes or steps to reproduce..."
                    rows={5}
                    className="resize-none text-base"
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2 scroll-mt-20">
                  <Label>Attachments</Label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors ${
                      dragOver
                        ? "border-primary bg-primary/5"
                        : "border-border bg-muted/20"
                    }`}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragOver(false);
                      // TODO: Handle file drop logic here
                    }}
                  >
                    <CloudUpload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop files here, or{" "}
                      <span className="text-primary font-medium cursor-pointer hover:underline">
                        browse
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>

                <Button
                  size="lg"
                  className={cn(
                    "w-full h-12 text-base font-semibold rounded-lg",
                    missingFields.length > 0
                      ? "cursor-not-allowed"
                      : "cursor-pointer",
                  )}
                  disabled={missingFields.length > 0}
                  onClick={() => setSubmitted(true)}
                >
                  Submit Incident Report
                </Button>
              </CardContent>
            </Card>
          </section>

          <aside className="space-y-4 hidden lg:block">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
              Quick Categories
            </h4>
            {Object.entries(categories).map(
              ([key, { icon: Icon, description }]) => (
                <button
                  key={key}
                  onClick={() => handleFieldChange("project", key)}
                  className={`w-full group cursor-pointer p-4 rounded-xl border text-left transition-all duration-200 ${
                    formData.project === key
                      ? "bg-primary/5 border-primary/30 shadow-sm"
                      : "bg-card border-border hover:bg-accent hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                        formData.project === key
                          ? "bg-primary/10 border-primary/20"
                          : "bg-muted/50 border-border/50"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          formData.project === key
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-medium text-foreground">
                        {key}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-snug line-clamp-2 mt-0.5">
                        {description}
                      </p>
                    </div>
                  </div>
                </button>
              ),
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export { IncidentCreation };
