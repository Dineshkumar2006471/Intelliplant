'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Copilot', href: '/copilot' },
    { name: 'Document Library', href: '/library' },
    { name: 'P&ID Explorer', href: '/pid-explorer' },
    { name: 'Knowledge Graph', href: '/knowledge-graph' },
    { name: 'Compliance', href: '/compliance' },
    { name: 'Capture Knowledge', href: '/capture-knowledge' },
  ];

  return (
    <aside className="w-64 shrink-0 bg-background-secondary flex flex-col shadow-sm z-20">
      {/* Header Logo Area */}
      <Link href="/" className="h-16 flex items-center px-6 shrink-0 hover:opacity-80 transition-opacity">
        <Image src="/logo.png" alt="IntelliPlant Logo" width={160} height={40} className="object-contain" priority />
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`h-12 flex items-center px-4 rounded-sm transition-colors font-medium ${
                isActive
                  ? 'border-l-4 border-interactive-primary bg-background-primary shadow-sm text-text-primary'
                  : 'text-text-secondary hover:bg-background-tertiary'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Settings / Profile */}
      <div className="p-4 shrink-0">
        <div className="flex items-center gap-3 hover:bg-background-tertiary p-2 rounded-sm transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-interactive-primary text-white flex items-center justify-center font-semibold text-sm">
            BD
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-text-primary">Bingi Dinesh</span>
            <span className="text-xs text-text-secondary">Admin Org</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
