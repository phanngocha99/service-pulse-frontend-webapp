// Types matching the NestJS/Prisma backend schema

export interface Permission {
  id: number;
  action: string;
  resource: string;
  scope: string;
  active: boolean;
  description: string;
  createdAt: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  updatedById: number;
  permissions?: Permission[];
}

export interface Group {
  id: number;
  name: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  updatedById: number;
  roles?: Role[];
}

export interface User {
  id: number;
  name: string;
  email: string | null;
  active: boolean;
  needToResetPassword: boolean;
  createdAt: string;
  groups?: Group[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  name: string;
  password: string;
}

// DTOs matching backend
export interface CreateUserDto {
  name: string;
  email?: string;
  password: string;
}

export interface UpdateUserDto {
  id: number;
  name?: string;
  email?: string;
  active?: boolean;
}

export interface DeleteUserDto {
  id: number;
}

export interface CreateGroupDto {
  name: string;
  description: string;
}

export interface UpdateGroupDto {
  id: number;
  name?: string;
  description?: string;
  active?: boolean;
}

export interface DeleteGroupDto {
  id: number;
}

export interface CreateRoleDto {
  name: string;
  description: string;
}

export interface UpdateRoleDto {
  id: number;
  name?: string;
  description?: string;
  active?: boolean;
}

export interface DeleteRoleDto {
  id: number;
}
