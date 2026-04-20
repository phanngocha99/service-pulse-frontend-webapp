import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/useToast";
import { z } from "zod";
import type { Permission } from "../types/auth";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import { Tabs, TabsContent } from "../components/Tab";
import { Shield, Users, Key, Check, X, Calendar, Search } from "lucide-react";

const emailSchema = z
  .string()
  .trim()
  .email({ message: "Invalid email address" })
  .max(255, { message: "Email must be less than 255 characters" });

const Profile = () => {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editingEmail, setEditingEmail] = useState(false);
  const [emailDraft, setEmailDraft] = useState(user?.email ?? "");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "groups" | "roles" | "permissions"
  >("groups");
  const [groupQuery, setGroupQuery] = useState("");
  const [roleQuery, setRoleQuery] = useState("");
  const [permQuery, setPermQuery] = useState("");

  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const canEditEmail = true;

  const userRoles = Array.from(
    new Map(
      (user.groups || []).flatMap((g) => g.roles || []).map((r) => [r.id, r]),
    ).values(),
  );

  const userPermissions = Array.from(
    new Map(
      userRoles.flatMap((r) => r.permissions || []).map((p) => [p.id, p]),
    ).values(),
  );

  const gq = groupQuery.trim().toLowerCase();
  const rq = roleQuery.trim().toLowerCase();
  const pq = permQuery.trim().toLowerCase();

  const filteredGroups = (user.groups || []).filter(
    (g) =>
      !gq ||
      g.name.toLowerCase().includes(gq) ||
      (g.description || "").toLowerCase().includes(gq) ||
      (g.roles || []).some((r) => r.name.toLowerCase().includes(gq)),
  );

  const filteredRoles = userRoles.filter(
    (r) =>
      !rq ||
      r.name.toLowerCase().includes(rq) ||
      (r.description || "").toLowerCase().includes(rq) ||
      (r.permissions || []).some((p) =>
        `${p.action}:${p.resource}`.toLowerCase().includes(rq),
      ),
  );

  const filteredPermissions = userPermissions.filter(
    (p) =>
      !pq ||
      p.action.toLowerCase().includes(pq) ||
      p.resource.toLowerCase().includes(pq) ||
      (p.scope || "").toLowerCase().includes(pq) ||
      (p.description || "").toLowerCase().includes(pq),
  );

  const startEditEmail = () => {
    setEmailDraft(user.email ?? "");
    setEmailError(null);
    setEditingEmail(true);
  };

  const cancelEditEmail = () => {
    setEditingEmail(false);
    setEmailError(null);
  };

  const saveEmail = () => {
    const result = emailSchema.safeParse(emailDraft);
    if (!result.success) {
      setEmailError(result.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    if (result.data === user.email) {
      setEditingEmail(false);
      return;
    }
    updateProfile({ email: result.data });
    setEditingEmail(false);
    toast({
      title: "Email updated",
      description: "Your email address has been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* HERO — Industrial Command Console */}
        <div className="bg-primary text-primary-foreground rounded-sm shadow-xl border border-primary overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8 p-6 md:p-8">
            {/* Avatar block */}
            <div className="flex justify-center">
              <div className="relative shrink-0 size-24 md:size-28 rounded-none border-2 border-primary-foreground/20 p-1 bg-primary-foreground/5 flex items-center justify-center">
                <span className="text-4xl md:text-5xl tracking-tight uppercase">
                  {user.name[0]}
                </span>
                <div className="p-1 flex items-center absolute -bottom-2.5 -right-2 border border-primary-foreground/20 bg-primary ">
                  <span className=" text-[10px]  tracking-widest uppercase">
                    {user.active ? "Active" : "Inactive"}
                  </span>
                  <span
                    className={` size-5 border-4 border-primary ${
                      user.active ? "bg-success" : "bg-destructive"
                    }`}
                    aria-hidden
                  ></span>
                </div>
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
                <h1 className="text-2xl md:text-3xl tracking-tight uppercase truncate">
                  {user.name}
                </h1>
              </div>

              {/* UserId chips */}
              <div className="flex flex-wrap justify-center gap-2 mb-5">
                <span className="px-3 py-1 bg-primary-foreground/30 border border-primary-foreground/20 text-[11px] font-medium uppercase tracking-wide">
                  ID: #{String(user.id).padStart(6, "0")}
                </span>
              </div>

              {/* Editable data row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 max-w-2xl">
                <div className="border-b border-primary-foreground/15 pb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-primary-foreground/50 mb-1">
                    Contact Vector
                  </label>
                  {editingEmail ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Input
                          value={emailDraft}
                          onChange={(e) => setEmailDraft(e.target.value)}
                          placeholder="you@company.com"
                          className="h-7 text-sm  bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/40 rounded-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEmail();
                            if (e.key === "Escape") cancelEditEmail();
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-[10px] opacity-100 transition-opacity px-2 py-0.5 uppercase tracking-wider hover:bg-primary-foreground/10"
                          onClick={saveEmail}
                          aria-label="Save email"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-[10px] opacity-100 transition-opacity px-2 py-0.5 uppercase tracking-wider hover:bg-primary-foreground/10"
                          onClick={cancelEditEmail}
                          aria-label="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      {emailError && (
                        <p className="text-[11px] text-destructive-foreground bg-destructive/80 px-2 py-0.5 inline-block">
                          {emailError}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="group flex items-center justify-between gap-2">
                      <span className="text-sm  truncate">
                        {user.email || "—"}
                      </span>
                      {canEditEmail && (
                        <Button
                          size="sm"
                          onClick={startEditEmail}
                          className="text-[10px] opacity-100 transition-opacity border border-primary-foreground/30 px-2 py-0.5 uppercase tracking-wider hover:bg-primary-foreground/10"
                        >
                          Edit
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-b border-primary-foreground/15 pb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-primary-foreground/50 mb-1">
                    Enlistment Date
                  </label>
                  <span className="text-sm ">{user.createdAt}</span>
                </div>

                <div className="border-b border-primary-foreground/15 pb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-primary-foreground/50 mb-1">
                    User ID
                  </label>
                  <span className="text-sm ">
                    #{String(user.id).padStart(6, "0")}
                  </span>
                </div>

                <div className="border-b border-primary-foreground/15 pb-2">
                  <label className="block text-[10px] uppercase tracking-widest text-primary-foreground/50 mb-1">
                    Credential Status
                  </label>
                  <span className="text-sm ">
                    {user.needToResetPassword
                      ? "RESET REQUIRED"
                      : "OPERATIONAL"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Quick stats — Aluminum Surface, clickable */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {[
            {
              key: "groups" as const,
              label: "Groups",
              value: user.groups?.length || 0,
              icon: Users,
            },
            {
              key: "roles" as const,
              label: "Roles",
              value: userRoles.length,
              icon: Shield,
            },
            {
              key: "permissions" as const,
              label: "Permissions",
              value: userPermissions.length,
              icon: Key,
            },
          ].map((s) => {
            const isActive = activeTab === s.key;
            const Icon = s.icon;
            return (
              <Button
                variant={"outline"}
                key={s.key}
                onClick={() => setActiveTab(s.key)}
                className={`group flex flex-col text-left p-4 h-full sm:p-5 rounded-sm border bg-linear-to-b from-card to-muted/40 shadow-[inset_0_1px_0_0_hsl(var(--background))] transition-all hover:border-primary/50 hover:shadow-md ${
                  isActive
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <span className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-widest">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">
                      {s.label.split(" ").pop()}
                    </span>
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl  tabular-nums text-primary mb-2">
                  {String(s.value).padStart(2, "0")}
                </div>
              </Button>
            );
          })}
        </div>
        {/* Tabbed Groups / Roles / Permissions — controlled */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          {/* Groups Tab */}
          <TabsContent value="groups" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-primary" />
                  My Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={groupQuery}
                    onChange={(e) => setGroupQuery(e.target.value)}
                    placeholder="Search groups by name, description, or role..."
                    className="pl-9 h-9 text-sm rounded-sm"
                  />
                </div>
                {!user.groups || user.groups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Không thuộc group nào.
                  </p>
                ) : filteredGroups.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No groups match "{groupQuery}".
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredGroups.map((g) => {
                      const permCount = (g.roles || []).reduce(
                        (sum, r) => sum + (r.permissions?.length || 0),
                        0,
                      );
                      return (
                        <div
                          key={g.id}
                          onClick={() => navigate(`/group/${g.id}`)}
                          className="p-4 rounded-lg border bg-card cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground">
                                {g.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {g.description}
                              </p>
                            </div>
                            <Badge
                              variant={g.active ? "success" : "secondary"}
                              className="shrink-0"
                            >
                              {g.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
                            <span className="flex items-center gap-1">
                              <Shield className="h-3 w-3" />
                              {g.roles?.length || 0} role(s)
                            </span>
                            <span className="flex items-center gap-1">
                              <Key className="h-3 w-3" />
                              {permCount} permission(s)
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Joined {g.createdAt}
                            </span>
                          </div>
                          {g.roles && g.roles.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {g.roles.map((r) => (
                                <Badge
                                  key={r.id}
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {r.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Tab */}
          <TabsContent value="roles" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-5 w-5 text-primary" />
                  My Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={roleQuery}
                    onChange={(e) => setRoleQuery(e.target.value)}
                    placeholder="Search roles by name, description, or permission..."
                    className="pl-9 h-9 text-sm rounded-sm"
                  />
                </div>
                {userRoles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Không có role nào.
                  </p>
                ) : filteredRoles.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No roles match "{roleQuery}".
                  </p>
                ) : (
                  <div className="space-y-3">
                    {filteredRoles.map((r) => {
                      const sourceGroups = (user.groups || []).filter((g) =>
                        g.roles?.some((rr) => rr.id === r.id),
                      );
                      return (
                        <div
                          key={r.id}
                          onClick={() => navigate(`/role/${r.id}`)}
                          className="p-4 rounded-lg border bg-card cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-foreground">
                                {r.name}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {r.description}
                              </p>
                            </div>
                            <Badge
                              variant={r.active ? "info" : "secondary"}
                              className="shrink-0"
                            >
                              {r.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t">
                            <span className="flex items-center gap-1">
                              <Key className="h-3 w-3" />
                              {r.permissions?.length || 0} permission(s)
                            </span>
                            {sourceGroups.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                via {sourceGroups.map((g) => g.name).join(", ")}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {(r.permissions || []).slice(0, 8).map((p) => (
                              <Badge
                                key={p.id}
                                variant="outline"
                                className="text-[10px]"
                              >
                                {p.action}:{p.resource}
                              </Badge>
                            ))}
                            {(r.permissions?.length || 0) > 8 && (
                              <Badge variant="outline" className="text-[10px]">
                                +{(r.permissions?.length || 0) - 8} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Key className="h-5 w-5 text-primary" />
                  Effective Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={permQuery}
                    onChange={(e) => setPermQuery(e.target.value)}
                    placeholder="Search permissions by action, resource, or scope..."
                    className="pl-9 h-9 text-sm rounded-sm"
                  />
                </div>
                {userPermissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Không có permission nào.
                  </p>
                ) : filteredPermissions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No permissions match "{permQuery}".
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredPermissions.map((p: Permission) => {
                      const sourceRoles = userRoles.filter((r) =>
                        r.permissions?.some((pp) => pp.id === p.id),
                      );
                      return (
                        <div
                          key={p.id}
                          onClick={() => navigate(`/permission/${p.id}`)}
                          className="p-3 rounded-lg border bg-card cursor-pointer hover:border-primary/40 hover:shadow-sm transition-all"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                                {p.action}
                              </span>
                              <span className="text-sm font-medium text-foreground truncate">
                                {p.resource}
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-[10px] shrink-0"
                            >
                              {p.scope}
                            </Badge>
                          </div>
                          {p.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {p.description}
                            </p>
                          )}
                          {sourceRoles.length > 0 && (
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                              <Shield className="h-2.5 w-2.5" />
                              {sourceRoles.map((r) => r.name).join(", ")}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export { Profile };
