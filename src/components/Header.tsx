import { useState, useRef, forwardRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { cn } from "../libs/utils";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../components/Sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../components/NavigationMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/DropdownMenu";
import {
  LogIn,
  LogOut,
  User as UserIcon,
  Settings,
  Menu,
  FileText,
  Inbox,
  Wrench,
  Shield,
  Search,
  ChevronRight,
  LayoutGrid,
  UserCircle,
  Users,
  Key,
  Lock,
} from "lucide-react";
import Logo from "../assets/logo.svg";
import LogoText from "../assets/logo-text.svg";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  description?: string;
  requireAuth?: boolean;
  requirePermission?: { action: string; resource: string };
  showWhenGuest?: boolean;
}

const navGroups = {
  services: {
    label: "Services",
    items: [
      {
        label: "Submit Incident",
        path: "/",
        icon: FileText,
        description: "Report a new incident or issue",
        showWhenGuest: true,
      },
      {
        label: "My Tickets",
        path: "/self-service",
        icon: Inbox,
        description: "View and track your submitted tickets",
        requireAuth: true,
      },
    ] as NavItem[],
  },
  workspace: {
    label: "Workspace",
    items: [
      {
        label: "Agent Workspace",
        path: "/workspace",
        icon: Wrench,
        description: "Manage and resolve assigned tickets",
        requirePermission: { action: "read", resource: "ticket" },
      },
    ] as NavItem[],
  },
  admin: {
    label: "Administration",
    items: [
      {
        label: "Admin Panel",
        path: "/admin",
        icon: Shield,
        description: "System configuration and management",
        requirePermission: { action: "create", resource: "user" },
      },
    ] as NavItem[],
  },
  profile: {
    label: "Account",
    items: [
      {
        label: "Profile",
        path: "/profile",
        icon: UserCircle,
        description: "Your account settings and preferences",
        requireAuth: true,
      },
    ] as NavItem[],
  },
};

const searchTargets = [
  {
    label: "My Incidents",
    path: "/self-service",
    icon: FileText,
    category: "Tickets",
  },
  {
    label: "My Requests",
    path: "/self-service",
    icon: Inbox,
    category: "Tickets",
  },
  {
    label: "Agent Workspace",
    path: "/workspace",
    icon: Wrench,
    category: "Workspace",
  },
  { label: "Users", path: "/admin", icon: Users, category: "Admin" },
  { label: "Groups", path: "/admin", icon: LayoutGrid, category: "Admin" },
  { label: "Roles", path: "/admin", icon: Key, category: "Admin" },
  { label: "Permissions", path: "/admin", icon: Lock, category: "Admin" },
  { label: "Profile", path: "/profile", icon: UserCircle, category: "Account" },
];

const ListItem = forwardRef<
  HTMLAnchorElement,
  {
    title: string;
    icon: React.ElementType;
    description?: string;
    to: string;
    onClick?: () => void;
  }
>(({ title, icon: Icon, description, to, onClick }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          to={to}
          onClick={onClick}
          className="flex items-start gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <Icon className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
          <div className="space-y-1">
            <div className="text-sm font-medium leading-none">{title}</div>
            {description && (
              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export function Header() {
  const { user, isAuthenticated, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const canSee = (item: NavItem) => {
    if (item.requirePermission) {
      return (
        isAuthenticated &&
        hasPermission(
          item.requirePermission.action,
          item.requirePermission.resource,
        )
      );
    }
    if (item.requireAuth) return isAuthenticated;
    if (item.showWhenGuest) return true;
    return isAuthenticated;
  };

  const filteredSearchTargets = searchTargets.filter((t) => {
    if (!searchQuery) return true;
    return (
      t.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const groupedResults = filteredSearchTargets.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof searchTargets>,
  );

  const handleSearchNavigate = (path: string) => {
    setSearchQuery("");
    setSearchOpen(false);
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  // Mobile nav
  const allVisibleItems = Object.values(navGroups)
    .flatMap((g) => g.items)
    .filter(canSee);

  return (
    <header className="bg-card border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        {/* Mobile NavMenu button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        {/* Mobile NavMenu sheet */}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent
              side="left"
              className="w-full p-0 transition-transform duration-300 ease-in-out"
            >
              <SheetHeader className="p-4 border-b ">
                <Link to="/">
                  <SheetTitle className="cursor-pointer flex items-center gap-2 text-left">
                    <img src={Logo} className="h-5 w-5 text-primary" />
                    ServicePulse
                  </SheetTitle>
                </Link>
              </SheetHeader>
              <div className="p-3">
                {/* Mobile search */}
                <div className="relative mb-3">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="h-9 pl-8 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <nav className="space-y-4">
                  {Object.entries(navGroups).map(([key, group]) => {
                    const visible = group.items.filter(canSee);
                    if (visible.length === 0) return null;
                    return (
                      <div key={key}>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
                          {group.label}
                        </p>
                        <div className="space-y-0.5">
                          {visible.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                isActive(item.path)
                                  ? "bg-primary/10 text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        )}
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={LogoText} className="h-25 w-25" />
        </Link>
        {/* Spacer */}
        <div className="flex-1" />

        {/* Desktop NavMenu */}
        {!isMobile && (
          <NavigationMenu className="ml-4 [&_div[data-state]]:pointer-events-auto">
            <NavigationMenuList>
              {/* All Navigation dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm">
                  Navigate
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-120 p-4">
                    {/* Search inside dropdown */}
                    <div className="relative mb-3">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        ref={searchRef}
                        placeholder="Search pages, categories..."
                        className="h-8 pl-8 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {searchQuery ? (
                      /* Search Results */
                      <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
                        {Object.entries(groupedResults).length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">
                            No results found
                          </p>
                        ) : (
                          Object.entries(groupedResults).map(
                            ([category, items]) => (
                              <div key={category}>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">
                                  {category}
                                </p>
                                <ul className="space-y-0.5">
                                  {items.map((item) => (
                                    <li key={item.label}>
                                      <button
                                        onClick={() =>
                                          handleSearchNavigate(item.path)
                                        }
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors text-left"
                                      >
                                        <item.icon className="h-4 w-4 text-primary shrink-0" />
                                        <span>{item.label}</span>
                                        <ChevronRight className="h-3 w-3 ml-auto text-muted-foreground" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ),
                          )
                        )}
                      </div>
                    ) : (
                      /* Default grouped nav */
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(navGroups).map(([key, group]) => {
                          const visible = group.items.filter(canSee);
                          if (visible.length === 0) return null;
                          return (
                            <div key={key}>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1.5">
                                {group.label}
                              </p>
                              <ul className="space-y-0.5">
                                {visible.map((item) => (
                                  <ListItem
                                    key={item.path}
                                    title={item.label}
                                    icon={item.icon}
                                    description={item.description}
                                    to={item.path}
                                  />
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        )}

        {/* User menu */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 h-8">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {user.name[0].toUpperCase()}
                </div>
                {!isMobile && <span className="text-sm">{user.name}</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              {hasPermission("create", "user") && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Admin Panel
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/login">
            <Button variant="default" size="default">
              <LogIn className="h-4 w-4 mr-1" /> Login
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
