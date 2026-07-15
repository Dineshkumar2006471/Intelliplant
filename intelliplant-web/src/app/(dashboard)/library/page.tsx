export default function DocumentLibraryPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background-primary p-8 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-medium text-text-primary mb-2">Document Library</h1>
            <p className="text-text-secondary text-lg">Manage all indexed manuals, P&IDs, and maintenance records.</p>
          </div>
          <div className="flex gap-4">
            <button className="h-10 px-4 bg-background-primary border border-interactive-primary text-interactive-primary rounded-sm text-sm font-medium hover:bg-background-secondary transition-colors">
              Sync Data Source
            </button>
            <button className="h-10 px-4 bg-interactive-primary text-white rounded-sm text-sm font-medium hover:bg-interactive-hover transition-colors">
              Upload Document
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 border-b border-border-subtle pb-4">
           <select className="bg-background-primary border border-border-subtle rounded-sm px-3 py-2 text-sm focus:border-interactive-primary focus:outline-none w-48">
             <option>All Types</option>
             <option>P&ID Drawings</option>
             <option>OEM Manuals</option>
             <option>Maintenance Logs</option>
           </select>
           <select className="bg-background-primary border border-border-subtle rounded-sm px-3 py-2 text-sm focus:border-interactive-primary focus:outline-none w-48">
             <option>All Statuses</option>
             <option>Indexed</option>
             <option>Processing</option>
             <option>Failed</option>
           </select>
           <div className="flex-1 relative">
             <input type="text" placeholder="Search documents by name, tag, or content..." className="w-full bg-background-primary border border-border-subtle rounded-sm px-3 py-2 text-sm focus:border-interactive-primary focus:outline-none" />
           </div>
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Doc Card 1 */}
          <div className="bg-background-secondary border border-border-subtle rounded-md p-5 flex flex-col hover:border-interactive-primary cursor-pointer transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-[#E0E0E0] text-text-primary flex items-center justify-center font-bold text-xs rounded-sm">
                PDF
              </div>
              <span className="px-2 py-0.5 bg-[#DEFBE6] text-support-success text-[10px] font-bold rounded-sm border border-support-success">Indexed</span>
            </div>
            <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">C-Series Compressor OEM Manual v2</h3>
            <p className="text-xs text-text-secondary mb-4">Added 2 days ago • 14MB</p>
            <div className="mt-auto pt-4 border-t border-border-subtle flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-background-primary border border-border-subtle rounded-sm text-[10px] text-text-secondary">C-104</span>
              <span className="px-2 py-1 bg-background-primary border border-border-subtle rounded-sm text-[10px] text-text-secondary">Manual</span>
            </div>
          </div>

          {/* Doc Card 2 */}
          <div className="bg-background-secondary border border-border-subtle rounded-md p-5 flex flex-col hover:border-interactive-primary cursor-pointer transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-interactive-primary text-white flex items-center justify-center font-bold text-xs rounded-sm">
                DWG
              </div>
              <span className="px-2 py-0.5 bg-[#DEFBE6] text-support-success text-[10px] font-bold rounded-sm border border-support-success">Indexed</span>
            </div>
            <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">P&ID_Unit3_Cooling_Rev2</h3>
            <p className="text-xs text-text-secondary mb-4">Added 1 week ago • 5MB</p>
            <div className="mt-auto pt-4 border-t border-border-subtle flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-background-primary border border-border-subtle rounded-sm text-[10px] text-text-secondary">Cooling</span>
              <span className="px-2 py-1 bg-background-primary border border-border-subtle rounded-sm text-[10px] text-text-secondary">Drawing</span>
            </div>
          </div>

          {/* Doc Card 3 */}
          <div className="bg-background-secondary border border-border-subtle rounded-md p-5 flex flex-col hover:border-interactive-primary cursor-pointer transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-support-warning text-white flex items-center justify-center font-bold text-xs rounded-sm">
                XLSX
              </div>
              <span className="px-2 py-0.5 bg-[#FFF1F1] text-support-error text-[10px] font-bold rounded-sm border border-support-error">Failed</span>
            </div>
            <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">2024 Maintenance Logs Q3-Q4</h3>
            <p className="text-xs text-text-secondary mb-4">Added 3 hours ago • 2MB</p>
            <div className="mt-auto pt-4 border-t border-border-subtle flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-background-primary border border-border-subtle rounded-sm text-[10px] text-text-secondary">Logs</span>
            </div>
          </div>
          
          {/* Doc Card 4 */}
          <div className="bg-background-secondary border border-border-subtle rounded-md p-5 flex flex-col hover:border-interactive-primary cursor-pointer transition-colors opacity-70">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-[#E0E0E0] text-text-primary flex items-center justify-center font-bold text-xs rounded-sm">
                PDF
              </div>
              <span className="px-2 py-0.5 bg-[#FEF5D9] text-[#755100] text-[10px] font-bold rounded-sm border border-support-warning">Processing (45%)</span>
            </div>
            <h3 className="font-semibold text-text-primary text-sm mb-1 line-clamp-2">Standard Operating Procedures 2025</h3>
            <p className="text-xs text-text-secondary mb-4">Added 5 mins ago • 35MB</p>
            <div className="mt-auto pt-4 border-t border-border-subtle flex gap-2 flex-wrap">
              <span className="px-2 py-1 bg-background-primary border border-border-subtle rounded-sm text-[10px] text-text-secondary">SOP</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
