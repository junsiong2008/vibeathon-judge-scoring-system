import Link from 'next/link';
import { UserProfile } from './UserProfile';
import { ObserveXLogo } from './ObserveXLogo';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 sm:h-28">
        <Link href="/" className="flex shrink-0 items-center">
          <ObserveXLogo className="h-20 w-auto sm:h-24" />
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserProfile />
        </div>
      </div>
    </header>
  );
}
