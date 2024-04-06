import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'services', title: 'Services', href: paths.dashboard.customers, icon: 'package-icon' },
  { key: 'automations', title: 'Automations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  { key: 'app', title: 'Get the app', href: paths.errors.notFound, icon: 'device-mobile' },
] satisfies NavItemConfig[];
