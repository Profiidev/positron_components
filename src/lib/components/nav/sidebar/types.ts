import type { Component } from 'svelte';

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  href: string;
  icon?: Component;
  requiredPermission?: string;
}

export interface SidebarUserInfo {
  permissions: string[];
  name: string;
  email: string;
  avatar?: string;
}
