import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import {
  Home,
  Package,
  ClipboardCheck,
  Users,
  Building2,
  Truck,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  label: string;
  icon: ReactNode;
  href: string;
  badge?: number;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: 'donor' | 'pharmacist' | 'recipient' | 'admin';
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navItems: Record<string, NavItem[]> = {
    donor: [
      { label: 'Dashboard', icon: <Home size={20} />, href: '/donor' },
      { label: 'Donate Medicine', icon: <Package size={20} />, href: '/donor/donate' },
      { label: 'My Donations', icon: <FileText size={20} />, href: '/donor/donations' },
      { label: 'Pickups', icon: <Truck size={20} />, href: '/donor/pickups' },
      { label: 'Settings', icon: <Settings size={20} />, href: '/donor/settings' },
    ],
    pharmacist: [
      { label: 'Dashboard', icon: <Home size={20} />, href: '/pharmacist' },
      { label: 'Verification Queue', icon: <ClipboardCheck size={20} />, href: '/pharmacist/queue', badge: 5 },
      { label: 'Verified Items', icon: <ShieldCheck size={20} />, href: '/pharmacist/verified' },
      { label: 'Rejected Items', icon: <AlertTriangle size={20} />, href: '/pharmacist/rejected' },
      { label: 'Settings', icon: <Settings size={20} />, href: '/pharmacist/settings' },
    ],
    recipient: [
      { label: 'Dashboard', icon: <Home size={20} />, href: '/recipient' },
      { label: 'Available Medicines', icon: <Package size={20} />, href: '/recipient/available' },
      { label: 'My Claims', icon: <FileText size={20} />, href: '/recipient/claims' },
      { label: 'Organization', icon: <Building2 size={20} />, href: '/recipient/organization' },
      { label: 'Settings', icon: <Settings size={20} />, href: '/recipient/settings' },
    ],
    admin: [
      { label: 'Dashboard', icon: <Home size={20} />, href: '/admin' },
      { label: 'Users', icon: <Users size={20} />, href: '/admin/users' },
      { label: 'Recipients', icon: <Building2 size={20} />, href: '/admin/recipients', badge: 3 },
      { label: 'Medicines', icon: <Package size={20} />, href: '/admin/medicines' },
      { label: 'Pickups', icon: <Truck size={20} />, href: '/admin/pickups' },
      { label: 'Reports', icon: <FileText size={20} />, href: '/admin/reports' },
      { label: 'Settings', icon: <Settings size={20} />, href: '/admin/settings' },
    ],
  };

  const roleLabels = {
    donor: 'Donor',
    pharmacist: 'Pharmacist',
    recipient: 'Recipient',
    admin: 'Administrator',
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center justify-between">
              <Logo size="sm" />
              <button
                className="md:hidden text-sidebar-foreground"
                onClick={() => setSidebarOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems[role].map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                  location.pathname === item.href
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
              >
                {item.icon}
                <span className="flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="bg-accent text-accent-foreground">
                    {item.badge}
                  </Badge>
                )}
                <ChevronRight 
                  size={16} 
                  className={cn(
                    'opacity-0 group-hover:opacity-100 transition-opacity',
                    location.pathname === item.href && 'opacity-100'
                  )} 
                />
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {roleLabels[role]}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={handleSignOut}
            >
              <LogOut size={20} className="mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden p-2 -ml-2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 md:hidden flex justify-center">
              <Logo size="sm" showText={false} />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}