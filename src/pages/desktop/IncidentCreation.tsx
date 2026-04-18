import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
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
import { CloudUpload, Cloud, Lock, Laptop, ShieldCheck, Zap, LogIn, AlertTriangle,Info  } from "lucide-react";


const categories: Record<string, { items: string[]; icon: React.ElementType; description: string }> = {
  Hardware: {
    items: ["Laptop", "Desktop", "Printer", "Monitor"],
    icon: Laptop,
    description: "Physical device failures, peripheral requests, or workstation repairs.",
  },
  Software: {
    items: ["Email", "ERP", "VPN", "Office Suite"],
    icon: Cloud,
    description: "Application bugs, license issues, or software installation requests.",
  },
  Network: {
    items: ["Wi-Fi", "VPN Access", "Internet", "Firewall"],
    icon: Zap,
    description: "Connectivity problems, VPN access, or firewall configuration.",
  },
  Access: {
    items: ["Account Unlock", "Permission Request", "New Account"],
    icon: Lock,
    description: "SSO failures, MFA resets, or permission elevations for tools.",
  },
};

const IncidentCreation = () => {
  const { isAuthenticated } = useAuth();
  const [category, setCategory] = useState("");
    const [selectedQuickCategory, setSelectedQuickCategory] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const subcategories = category ? categories[category]?.items || [] : [];

  const handleQuickCategory = (cat: string) => {
    setSelectedQuickCategory(cat);
    setCategory(cat);
    setSubcategory("");
  };

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
                <h2 className="text-xl font-semibold text-foreground mb-2">Incident Submitted</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your report has been received. A support engineer will review it shortly.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Reference Number</p>
                <p className="text-lg font-semibold text-primary font-mono">INC00{Math.floor(Math.random() * 900 + 100)}</p>
              </div>

              {/* Auth notice */}
              {isAuthenticated ? (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-left space-y-2">
                  <p className="text-sm font-medium text-foreground">✓ Logged in — Ticket linked to your account</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You can track this ticket's progress, receive updates, and communicate with the support team from{" "}
                    <Link to="/self-service" className="text-primary font-medium hover:underline">My Tickets</Link>.
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 text-left space-y-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">Submitted as Guest</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        This ticket is publicly visible and not linked to an account. You won't be able to track its progress or receive personal updates.
                      </p>
                    </div>
                  </div>
                  <Link to="/login">
                    <Button variant="outline" size="sm" className="w-full gap-2 mt-1">
                      <LogIn className="h-3.5 w-3.5" />
                      Log in to track your tickets
                    </Button>
                  </Link>
                </div>
              )}

              <Button onClick={() => setSubmitted(false)} className="w-full">Submit Another Incident</Button>
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
        {/* Hero Section */}
        <header className="py-12 sm:py-16 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-normal tracking-tight leading-[1.15] text-foreground mb-4">
            Tell us what's happening.
            <span className="block text-muted-foreground mt-1">We'll take it from here.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Choose a project to begin your report.
          </p>
        </header>

        {/* Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 lg:gap-12">
          {/* Form */}
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-6">
              Incident Details
            </h2>

            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Guest/Auth notice before submit */}
                {!isAuthenticated ? (
                  <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 flex items-start gap-3">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-medium text-foreground">You're submitting as a guest</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Guest tickets are publicly visible and cannot be tracked privately.{" "}
                        <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link> to link this ticket to your account and track progress from "My Tickets".
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Logged in — this ticket will be linked to your account for private tracking.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Short Description</Label>
                  <Input
                    id="title"
                    placeholder="What is the primary issue?"
                    className="h-12 text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-visible">
                  <div className="space-y-2">
                    <Label>Project</Label>
                    <div className="relative">
                      <Select value={category} onValueChange={(v) => { setCategory(v); setSubcategory(""); setSelectedQuickCategory(v); }}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select project..." />
                        </SelectTrigger>
                        <SelectContent side="bottom" position="item-aligned" avoidCollisions={false} sideOffset={4}>
                          {Object.keys(categories).map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    {!category && (
                    <div className="rounded-lg border border-primary/20 p-3 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        Please select a Project first to enable the Subcategory options.
                      </p>
                    </div>
                    )}
                    
                    <div className="relative">
                      <Select value={subcategory} onValueChange={setSubcategory} disabled={!category}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select subcategory..." />
                        </SelectTrigger>
                        <SelectContent side="bottom" position="item-aligned" avoidCollisions={false} sideOffset={4}>
                          {subcategories.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="What happened? Include any error codes or steps to reproduce..."
                    rows={5}
                    className="resize-none text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attachments</Label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors ${
                      dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/20"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                  >
                    <CloudUpload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Drag & drop files here, or{" "}
                      <span className="text-primary font-medium cursor-pointer hover:underline">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                  </div>
                </div>

                

                <Button
                  size="lg"
                  className="w-full h-12 text-base font-semibold rounded-lg"
                  onClick={() => setSubmitted(true)}
                >
                  Submit Incident Report
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Sidebar - Categories */}
          <aside className="space-y-4 hidden lg:block">
            <h4 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
              Quick Categories
            </h4>
            {Object.entries(categories).map(([key, { icon: Icon, description }]) => (
              <button
                key={key}
                onClick={() => handleQuickCategory(key)}
                className={`w-full group cursor-pointer p-4 rounded-xl border text-left transition-all duration-200 ${
                  selectedQuickCategory === key
                    ? "bg-primary/5 border-primary/30 shadow-sm"
                    : "bg-card border-border hover:border-primary/20 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                    selectedQuickCategory === key
                      ? "bg-primary/10 border-primary/20"
                      : "bg-muted/50 border-border/50"
                  }`}>
                    <Icon className={`h-4 w-4 ${
                      selectedQuickCategory === key ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-foreground">{key}</h3>
                    <p className="text-xs text-muted-foreground leading-snug line-clamp-2 mt-0.5">{description}</p>
                  </div>
                </div>
              </button>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
};

export {IncidentCreation};
