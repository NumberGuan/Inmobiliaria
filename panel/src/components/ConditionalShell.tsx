'use client';

import { usePathname } from 'next/navigation';
import AppShell from './AppShell';

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname.startsWith('/landing') || pathname.startsWith('/login');

  if (isPublic) {
    return <>{children}</>;
  }

  return <AppShell>{children}</AppShell>;
}
