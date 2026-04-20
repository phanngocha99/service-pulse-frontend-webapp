import { Link, useLocation, useParams } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/Breadcrumb";
import { mockTickets } from "../mock-data/incident";
import { useAuth } from "../contexts/AuthContext";

interface Crumb {
  label: string;
  to?: string;
}

const STATIC_LABELS: Record<string, string> = {
  "": "Home",
  login: "Login",
  profile: "Profile",
  admin: "Administration",
  workspace: "Incident Module",
  "self-service": "My Tickets",
  group: "Groups",
  role: "Roles",
  permission: "Permissions",
};

export function AppBreadcrumbs() {
  const location = useLocation();
  const params = useParams();
  const { allGroups, allRoles, allPermissions } = useAuth();

  const segments = location.pathname.split("/").filter(Boolean);

  // Don't show breadcrumb on the public landing page
  if (segments.length === 0) return null;

  const crumbs: Crumb[] = [{ label: "Home", to: "/" }];

  let acc = "";
  segments.forEach((seg, idx) => {
    acc += `/${seg}`;
    const isLast = idx === segments.length - 1;
    let label = STATIC_LABELS[seg] ?? decodeURIComponent(seg);

    // Resolve dynamic IDs
    if (idx > 0) {
      const parent = segments[idx - 1];
      if (parent === "workspace" || parent === "self-service") {
        const t = mockTickets.find((x) => x.id === seg);
        label = t ? `${t.id} — ${t.title}` : seg;
      } else if (parent === "group") {
        const g = allGroups?.find((x) => x.id === Number(seg));
        label = g ? g.name : `Group #${seg}`;
      } else if (parent === "role") {
        const r = allRoles?.find((x) => x.id === Number(seg));
        label = r ? r.name : `Role #${seg}`;
      } else if (parent === "permission") {
        const p = allPermissions?.find((x) => x.id === Number(seg));
        label = p ? `${p.action}:${p.resource}` : `Permission #${seg}`;
      }
    }

    crumbs.push({ label, to: isLast ? undefined : acc });
  });

  return (
    <div className="border-b bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <Breadcrumb>
          <BreadcrumbList className="text-xs">
            {crumbs.map((c, i) => {
              const isLast = i === crumbs.length - 1;
              return (
                <div
                  key={`${c.label}-${i}`}
                  className="flex items-center gap-1.5"
                >
                  <BreadcrumbItem>
                    {isLast || !c.to ? (
                      <BreadcrumbPage className="font-medium truncate max-w-65">
                        {i === 0 ? (
                          <span className="flex items-center gap-1">
                            <Home className="h-3 w-3" /> {c.label}
                          </span>
                        ) : (
                          c.label
                        )}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          to={c.to}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          {i === 0 && <Home className="h-3 w-3" />}
                          {c.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-3 w-3" />
                    </BreadcrumbSeparator>
                  )}
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
