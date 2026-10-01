"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GraduationCap,
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  BarChart3,
  ShieldAlert,
  LogOut,
  LogIn,
  User,
  Menu,
  X,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "GUEST";
  image?: string | null;
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tasks", label: "Tasks", icon: CheckSquare },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/analytics", label: "Telemetry", icon: BarChart3 },
    ...(currentUser?.role === "ADMIN"
      ? [{ href: "/admin", label: "Admin Console", icon: ShieldAlert }]
      : []),
  ];

  const getRoleBadgeVariant = (role?: string) => {
    if (role === "ADMIN") return "destructive";
    if (role === "MEMBER") return "default";
    return "secondary";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight group">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="bg-gradient-to-r from-primary to-indigo-500 bg-clip-text text-transparent">
              StudyFlow
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Theme Toggle & User Auth */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          {loading ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-2 ring-primary/20">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={currentUser.image || undefined} alt={currentUser.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {currentUser.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{currentUser.email}</p>
                    <div className="pt-1.5">
                      <Badge variant={getRoleBadgeVariant(currentUser.role)} className="text-[10px] uppercase font-bold tracking-wider">
                        {currentUser.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Student Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/tasks" className="cursor-pointer">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Manage Tasks
                  </Link>
                </DropdownMenuItem>
                {currentUser.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer text-destructive font-semibold">
                      <ShieldAlert className="h-4 w-4 mr-2 text-destructive" />
                      Admin Security Center
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="gap-2">
              <Link href="/login">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
          {!currentUser && (
            <div className="pt-2">
              <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
