import UploadButton from '@/components/UploadButton';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background-primary overflow-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-background-primary">
        {/* Topbar (64px height) */}
        <header className="h-16 shrink-0 bg-background-primary flex items-center justify-between px-8 w-full z-10 shadow-sm">
          <h1 className="text-xl font-semibold text-text-primary">Dashboard</h1>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
              Search
            </button>
            <div className="w-px h-6 bg-border-subtle mx-2"></div>
            <UploadButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
