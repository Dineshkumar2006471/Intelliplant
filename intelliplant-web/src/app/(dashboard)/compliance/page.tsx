export default function CompliancePage() {
  return (
    <div className="flex flex-col h-full w-full bg-background-primary p-8 overflow-y-auto">
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-medium text-text-primary mb-2">Compliance & Gaps Dashboard</h1>
            <p className="text-text-secondary text-lg">AI-detected discrepancies between P&IDs, manuals, and maintenance records.</p>
          </div>
          <button className="h-10 px-4 bg-background-primary border border-interactive-primary text-interactive-primary rounded-sm text-sm font-medium hover:bg-background-secondary transition-colors">
            Run Full Audit
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-background-secondary border border-border-subtle p-5 rounded-md">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Total Equipment</h3>
            <div className="text-3xl font-light text-text-primary">1,204</div>
          </div>
          <div className="bg-background-secondary border border-border-subtle p-5 rounded-md border-l-4 border-l-support-error">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Critical Gaps</h3>
            <div className="text-3xl font-light text-support-error">12</div>
          </div>
          <div className="bg-background-secondary border border-border-subtle p-5 rounded-md border-l-4 border-l-support-warning">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Missing Records</h3>
            <div className="text-3xl font-light text-support-warning">45</div>
          </div>
          <div className="bg-background-secondary border border-border-subtle p-5 rounded-md border-l-4 border-l-support-success">
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Compliance Score</h3>
            <div className="text-3xl font-light text-support-success">92%</div>
          </div>
        </div>

        {/* Table of Discrepancies */}
        <div className="bg-background-secondary border border-border-subtle rounded-md overflow-hidden">
          <div className="p-4 border-b border-border-subtle flex items-center justify-between">
             <h2 className="font-semibold text-text-primary">Detected Discrepancies (High Priority)</h2>
             <input type="text" placeholder="Filter by equipment tag..." className="bg-background-primary border border-border-subtle rounded-sm px-3 py-1.5 text-sm focus:border-interactive-primary focus:outline-none w-64" />
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-background-primary border-b border-border-subtle text-text-secondary">
              <tr>
                <th className="px-4 py-3 font-semibold">Equipment Tag</th>
                <th className="px-4 py-3 font-semibold">Issue Type</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              
              <tr className="border-b border-border-subtle hover:bg-background-primary transition-colors">
                <td className="px-4 py-4 font-medium text-interactive-primary cursor-pointer hover:underline">V-301 (Pressure Vessel)</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-[#FFF1F1] text-support-error border border-support-error rounded-sm text-xs font-medium">Missing Record</span>
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  Annual hydrostatic test record not found for 2025. P&ID indicates mandatory compliance.
                </td>
                <td className="px-4 py-4">
                  <span className="text-support-error text-xs font-bold uppercase">Open</span>
                </td>
                <td className="px-4 py-4">
                  <button className="text-interactive-primary hover:underline font-medium text-xs">Create Ticket</button>
                </td>
              </tr>

              <tr className="border-b border-border-subtle hover:bg-background-primary transition-colors">
                <td className="px-4 py-4 font-medium text-interactive-primary cursor-pointer hover:underline">C-104 (Compressor)</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-[#FEF5D9] text-[#755100] border border-support-warning rounded-sm text-xs font-medium">Contradiction</span>
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  SOP manual states inspection every 90 days, OEM manual requires full replacement.
                </td>
                <td className="px-4 py-4">
                  <span className="text-support-warning text-xs font-bold uppercase">Investigating</span>
                </td>
                <td className="px-4 py-4">
                  <button className="text-interactive-primary hover:underline font-medium text-xs">View Graph</button>
                </td>
              </tr>

              <tr className="hover:bg-background-primary transition-colors">
                <td className="px-4 py-4 font-medium text-interactive-primary cursor-pointer hover:underline">HX-205 (Heat Exchanger)</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-1 bg-[#FFF1F1] text-support-error border border-support-error rounded-sm text-xs font-medium">Missing Record</span>
                </td>
                <td className="px-4 py-4 text-text-secondary">
                  Tube cleaning work order missing for H2 2025.
                </td>
                <td className="px-4 py-4">
                  <span className="text-support-error text-xs font-bold uppercase">Open</span>
                </td>
                <td className="px-4 py-4">
                  <button className="text-interactive-primary hover:underline font-medium text-xs">Create Ticket</button>
                </td>
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
