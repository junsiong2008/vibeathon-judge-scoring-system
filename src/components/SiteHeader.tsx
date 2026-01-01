import Link from 'next/link';
import { UserProfile } from './UserProfile';
import { VibeAThonLogo } from './VibeAThonLogo';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <Link href="/" className="flex items-center space-x-2">
          <VibeAThonLogo className="h-7 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
