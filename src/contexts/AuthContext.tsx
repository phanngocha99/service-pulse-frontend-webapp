import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { User, AuthState, LoginCredentials } from "../types/auth";
import type { Permission, Role, Group } from "../types/auth";

// Mock data matching the Prisma schema
const mockPermissions: Permission[] = [
  {
    id: 1,
    action: "create",
    resource: "user",
    scope: "global",
    active: true,
    description: "Create users",
    createdAt: "2026-03-26",
  },
  {
    id: 2,
    action: "read",
    resource: "user",
    scope: "global",
    active: true,
    description: "Read users",
    createdAt: "2026-03-26",
  },
  {
    id: 3,
    action: "update",
    resource: "user",
    scope: "global",
    active: true,
    description: "Update users",
    createdAt: "2026-03-26",
  },
  {
    id: 4,
    action: "delete",
    resource: "user",
    scope: "global",
    active: true,
    description: "Delete users",
    createdAt: "2026-03-26",
  },
  {
    id: 5,
    action: "create",
    resource: "group",
    scope: "global",
    active: true,
    description: "Create groups",
    createdAt: "2026-03-26",
  },
  {
    id: 6,
    action: "read",
    resource: "group",
    scope: "global",
    active: true,
    description: "Read groups",
    createdAt: "2026-03-26",
  },
  {
    id: 7,
    action: "update",
    resource: "group",
    scope: "global",
    active: true,
    description: "Update groups",
    createdAt: "2026-03-26",
  },
  {
    id: 8,
    action: "delete",
    resource: "group",
    scope: "global",
    active: true,
    description: "Delete groups",
    createdAt: "2026-03-26",
  },
  {
    id: 9,
    action: "create",
    resource: "role",
    scope: "global",
    active: true,
    description: "Create roles",
    createdAt: "2026-03-26",
  },
  {
    id: 10,
    action: "read",
    resource: "role",
    scope: "global",
    active: true,
    description: "Read roles",
    createdAt: "2026-03-26",
  },
  {
    id: 11,
    action: "update",
    resource: "role",
    scope: "global",
    active: true,
    description: "Update roles",
    createdAt: "2026-03-26",
  },
  {
    id: 12,
    action: "delete",
    resource: "role",
    scope: "global",
    active: true,
    description: "Delete roles",
    createdAt: "2026-03-26",
  },
  {
    id: 13,
    action: "create",
    resource: "ticket",
    scope: "global",
    active: true,
    description: "Create tickets",
    createdAt: "2026-03-26",
  },
  {
    id: 14,
    action: "read",
    resource: "ticket",
    scope: "global",
    active: true,
    description: "Read tickets",
    createdAt: "2026-03-26",
  },
  {
    id: 15,
    action: "update",
    resource: "ticket",
    scope: "global",
    active: true,
    description: "Update tickets",
    createdAt: "2026-03-26",
  },
  {
    id: 16,
    action: "read",
    resource: "ticket",
    scope: "own",
    active: true,
    description: "Read own tickets",
    createdAt: "2026-03-26",
  },
];

const mockRoles: Role[] = [
  {
    id: 1,
    name: "Admin",
    description: "Full system access",
    active: true,
    createdAt: "2026-03-26",
    updatedAt: "2026-03-26",
    createdById: 1,
    updatedById: 1,
    permissions: mockPermissions,
  },
  {
    id: 2,
    name: "Agent",
    description: "IT Support agent",
    active: true,
    createdAt: "2026-03-26",
    updatedAt: "2026-03-26",
    createdById: 1,
    updatedById: 1,
    permissions: mockPermissions.filter(
      (p) => p.resource === "ticket" || p.action === "read",
    ),
  },
  {
    id: 3,
    name: "Requester",
    description: "End user / ticket requester",
    active: true,
    createdAt: "2026-03-26",
    updatedAt: "2026-03-26",
    createdById: 1,
    updatedById: 1,
    permissions: mockPermissions.filter((p) => p.scope === "own"),
  },
];

const mockGroups: Group[] = [
  {
    id: 1,
    name: "IT Administration",
    description: "System administrators",
    active: true,
    createdAt: "2026-03-26",
    updatedAt: "2026-03-26",
    createdById: 1,
    updatedById: 1,
    roles: [mockRoles[0]],
  },
  {
    id: 2,
    name: "Network Team",
    description: "Network infrastructure support",
    active: true,
    createdAt: "2026-03-26",
    updatedAt: "2026-03-26",
    createdById: 1,
    updatedById: 1,
    roles: [mockRoles[1]],
  },
  {
    id: 3,
    name: "Application Team",
    description: "Application support",
    active: true,
    createdAt: "2026-03-26",
    updatedAt: "2026-03-26",
    createdById: 1,
    updatedById: 1,
    roles: [mockRoles[1]],
  },
  {
    id: 4,
    name: "Desktop Team",
    description: "Desktop/Hardware support",
    active: true,
    createdAt: "2026-03-26",
    updatedAt: "2026-03-26",
    createdById: 1,
    updatedById: 1,
    roles: [mockRoles[1]],
  },
  {
    id: 5,
    name: "End Users",
    description: "Standard end users",
    active: true,
    createdAt: "2026-03-26",
    updatedAt: "2026-03-26",
    createdById: 1,
    updatedById: 1,
    roles: [mockRoles[2]],
  },
];

const mockUsers: User[] = [
  {
    id: 1,
    name: "admin",
    email: "admin@company.com",
    active: true,
    needToResetPassword: false,
    createdAt: "2026-03-26",
    groups: [mockGroups[0]],
  },
  {
    id: 2,
    name: "agent01",
    email: "agent01@company.com",
    active: true,
    needToResetPassword: false,
    createdAt: "2026-03-26",
    groups: [mockGroups[1], mockGroups[2]],
  },
  {
    id: 3,
    name: "user01",
    email: "user01@company.com",
    active: true,
    needToResetPassword: false,
    createdAt: "2026-03-26",
    groups: [mockGroups[4]],
  },
  {
    id: 4,
    name: "agent02",
    email: "agent02@company.com",
    active: true,
    needToResetPassword: true,
    createdAt: "2026-03-26",
    groups: [mockGroups[3]],
  },
];

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  allUsers: User[];
  allGroups: Group[];
  allRoles: Role[];
  allPermissions: Permission[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setAllGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  setAllRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  setAllPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
  hasPermission: (action: string, resource: string) => boolean;
  updateProfile: (updates: Partial<Pick<User, "email">>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem("itsm_auth");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { user: null, token: null, isAuthenticated: false };
      }
    }
    return { user: null, token: null, isAuthenticated: false };
  });

  const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
  const [allGroups, setAllGroups] = useState<Group[]>(mockGroups);
  const [allRoles, setAllRoles] = useState<Role[]>(mockRoles);
  const [allPermissions, setAllPermissions] =
    useState<Permission[]>(mockPermissions);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      // Mock login - matches NestJS POST /auth/login with LocalStrategy
      const found = allUsers.find(
        (u) => u.name === credentials.name && u.active,
      );
      if (!found) return false;

      // In real app, password is validated by backend with bcrypt
      // Mock: accept "password" for all users
      if (credentials.password !== "password") return false;

      const state: AuthState = {
        user: found,
        token: `mock-jwt-${found.id}-${Date.now()}`,
        isAuthenticated: true,
      };
      setAuthState(state);
      localStorage.setItem("itsm_auth", JSON.stringify(state));
      return true;
    },
    [allUsers],
  );

  const logout = useCallback(() => {
    setAuthState({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("itsm_auth");
  }, []);

  const hasPermission = useCallback(
    (action: string, resource: string): boolean => {
      if (!authState.user?.groups) return false;
      return authState.user.groups.some((g) =>
        g.roles?.some((r) =>
          r.permissions?.some(
            (p) => p.action === action && p.resource === resource && p.active,
          ),
        ),
      );
    },
    [authState.user],
  );

  const updateProfile = useCallback(
    (updates: Partial<Pick<User, "email">>) => {
      if (!authState.user) return;
      const updatedUser: User = { ...authState.user, ...updates };
      const newState: AuthState = { ...authState, user: updatedUser };
      setAuthState(newState);
      localStorage.setItem("itsm_auth", JSON.stringify(newState));
      setAllUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updates } : u)),
      );
    },
    [authState],
  );

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        allUsers,
        allGroups,
        allRoles,
        allPermissions,
        setAllUsers,
        setAllGroups,
        setAllRoles,
        setAllPermissions,
        hasPermission,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
