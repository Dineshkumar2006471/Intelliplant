import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-primary flex flex-col items-center w-full">
      {/* Navigation Shell for Landing */}
      <nav className="w-full h-16 border-b border-border-subtle flex items-center justify-between px-8 bg-background-primary">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="IntelliPlant Logo" width={160} height={40} className="object-contain" priority />
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary font-medium">
          <Link href="#features" className="hover:text-interactive-primary transition-colors">Features</Link>
          <Link href="#how-it-works" className="hover:text-interactive-primary transition-colors">How it Works</Link>
          <Link href="#about" className="hover:text-interactive-primary transition-colors">About</Link>
        </div>
        <div>
          <Link href="/copilot" className="h-10 px-4 bg-interactive-primary text-white flex items-center justify-center rounded-sm hover:bg-interactive-hover transition-colors text-sm font-medium">
            Go to Copilot
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="w-full max-w-7xl px-8 py-24 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-background-secondary border border-border-subtle rounded-sm text-xs font-mono text-text-secondary mb-2">
            <span className="w-2 h-2 rounded-full bg-support-success"></span>
            System Online
          </div>
          <h1 className="text-5xl font-light leading-tight text-text-primary">
            Empowering Your Plant with <br />
            <span className="font-medium text-interactive-primary">Industrial Intelligence</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-xl leading-relaxed">
            Turn every scattered industrial document, P&amp;ID drawing, and maintenance record into one connected, queryable brain. Don&apos;t lose your retiring experts&apos; knowledge.
          </p>
          <div className="flex gap-4 pt-4">
            <Link href="/copilot" className="h-12 px-6 bg-interactive-primary text-white flex items-center justify-center rounded-sm hover:bg-interactive-hover transition-colors font-medium">
              Explore Platform
            </Link>
            <Link href="#features" className="h-12 px-6 bg-background-primary border border-interactive-primary text-interactive-primary flex items-center justify-center rounded-sm hover:bg-background-secondary transition-colors font-medium">
              View Capabilities
            </Link>
          </div>
        </div>
        
        {/* Hero Visual Area with Real Image Narrative */}
        <div className="flex-1 w-full relative">
          <div className="w-full aspect-[4/3] rounded-md border border-border-subtle relative overflow-hidden group">
             {/* Realistic Control Room Image Backdrop */}
             <Image 
               src="/control_room_photo.png"
               alt="Industrial Plant Control Room"
               fill
               className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
             />
             
             {/* Subtle vignette/overlay for text readability without violating "no gradient" too much, 
                 we use a flat translucent color layer according to IBM Carbon opacity rules */}
             <div className="absolute inset-0 bg-background-primary opacity-20"></div>
             
             {/* Floating badge reflecting the narrative of AI extracting intelligence */}
             <div className="absolute top-8 -left-4 bg-background-primary border border-border-subtle shadow-sm rounded-sm p-3 flex items-center gap-3 z-10">
               <div className="w-8 h-8 bg-support-success flex items-center justify-center text-white text-lg font-bold rounded-sm">✓</div>
               <div>
                 <div className="text-sm font-semibold text-text-primary">Knowledge Graph Active</div>
                 <div className="text-xs text-text-secondary">10,432 Nodes Indexed</div>
               </div>
             </div>

             {/* UI Overlay Element demonstrating the app context over the real world */}
             <div className="absolute bottom-6 right-6 bg-background-primary border border-border-subtle p-4 rounded-sm shadow-sm w-64 backdrop-blur-sm bg-opacity-95">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-interactive-primary"></div>
                 <span className="text-xs font-bold uppercase tracking-wide text-text-secondary">Live Insights</span>
               </div>
               <div className="text-sm text-text-primary">
                 &quot;Compressor C-104 requires maintenance based on recent P&amp;ID updates.&quot;
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* NEW: Innovation Section */}
      <section id="innovation" className="w-full bg-background-primary py-24 border-t border-border-subtle relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none">
           <div className="w-full h-full bg-interactive-primary blur-[150px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 w-full relative">
            <div className="w-full aspect-square md:aspect-[4/3] rounded-md overflow-hidden relative shadow-md">
              <Image 
                src="/innovation_photo.png"
                alt="IntelliPlant Innovation Knowledge Graph overlay on physical plant"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Floating UI metric */}
            <div className="absolute -bottom-6 -right-6 bg-background-primary border border-border-subtle p-5 rounded-sm shadow-md hidden md:block w-72">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-10 h-10 rounded-sm bg-background-secondary flex items-center justify-center text-interactive-primary font-mono font-bold">AI</div>
                 <div>
                   <h4 className="font-semibold text-text-primary text-sm">Semantic Understanding</h4>
                   <p className="text-xs text-text-secondary">Beyond keyword search</p>
                 </div>
               </div>
               <div className="w-full bg-background-tertiary h-1.5 rounded-full overflow-hidden mt-3">
                 <div className="w-full bg-interactive-primary h-full"></div>
               </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <h2 className="text-sm font-bold tracking-widest uppercase text-interactive-primary">The Innovation</h2>
            <h3 className="text-3xl md:text-4xl font-medium text-text-primary leading-tight">
              We Don&apos;t Just Read Manuals.<br />We Understand Your Plant.
            </h3>
            <p className="text-text-secondary text-lg leading-relaxed">
              Most industrial AI tools just do standard keyword search across PDF manuals (Basic RAG). They don&apos;t understand how equipment is physically connected.
            </p>
            <p className="text-text-secondary text-lg leading-relaxed">
              IntelliPlant is different. By automatically decoding your P&amp;ID blueprints into a <strong className="text-text-primary font-medium">Knowledge Graph</strong>, our AI understands that Valve V-301 connects to Pump P-102. When a pressure drop happens, it knows exactly which downstream components are affected.
            </p>
            <ul className="space-y-4 mt-6">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 flex shrink-0 items-center justify-center bg-support-success text-white rounded-full text-xs font-bold mt-1">✓</span>
                <span className="text-text-primary">Translates messy, flat P&amp;IDs into structured digital nodes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 flex shrink-0 items-center justify-center bg-support-success text-white rounded-full text-xs font-bold mt-1">✓</span>
                <span className="text-text-primary">Cross-references physical layout with regulatory compliance.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* NEW: How it Works Section */}
      <section id="how-it-works" className="w-full bg-background-secondary py-24 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-medium mb-4 text-text-primary">How IntelliPlant Works</h2>
            <p className="text-text-secondary text-lg">A simple three-step process to digitize your plant&apos;s intelligence and protect tribal knowledge.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-12 w-full">
              
              {/* Step 1 */}
              <div className="flex gap-6 relative group">
                <div className="w-12 h-12 shrink-0 rounded-sm bg-interactive-primary text-white flex items-center justify-center text-xl font-medium z-10 group-hover:scale-110 transition-transform">1</div>
                <div className="absolute top-12 left-6 w-px h-full bg-border-subtle -z-10 group-last:hidden"></div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Upload P&amp;IDs &amp; Manuals</h3>
                  <p className="text-text-secondary">Drag and drop your engineering drawings. Our Vision AI scans the blueprint, detects tags, and builds the foundational structure of your plant in our graph database.</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex gap-6 relative group">
                <div className="w-12 h-12 shrink-0 rounded-sm bg-interactive-primary text-white flex items-center justify-center text-xl font-medium z-10 group-hover:scale-110 transition-transform">2</div>
                <div className="absolute top-12 left-6 w-px h-full bg-border-subtle -z-10 group-last:hidden"></div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Capture Tribal Knowledge</h3>
                  <p className="text-text-secondary">When senior engineers fix a complex issue, they enter it into IntelliPlant. We extract the exact equipment tag and attach their wisdom directly to the node on the blueprint.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 relative group">
                <div className="w-12 h-12 shrink-0 rounded-sm bg-interactive-primary text-white flex items-center justify-center text-xl font-medium z-10 group-hover:scale-110 transition-transform">3</div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">Query the Unified Brain</h3>
                  <p className="text-text-secondary">Ask the Copilot any question. It combines the physical structure (from P&amp;IDs), official protocols (from manuals), and human experience (from tribal capture) into one perfect answer.</p>
                </div>
              </div>

            </div>
            
            <div className="flex-1 w-full">
              <div className="w-full aspect-[4/5] rounded-md overflow-hidden relative shadow-lg">
                <Image 
                  src="/how_it_works_photo.png"
                  alt="Engineer using IntelliPlant tablet on factory floor"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Features Section with Storytelling Images */}
      <section id="features" className="w-full max-w-7xl px-8 py-24 border-t border-border-subtle bg-background-primary">
        <div className="text-left mb-16 max-w-3xl">
          <h2 className="text-3xl font-medium mb-4 text-text-primary">Everything Your Plant Needs to Run Smarter</h2>
          <p className="text-text-secondary text-lg leading-relaxed">
            From P&ID vision parsing to compliance gap detection, IntelliPlant connects the dots between your scattered systems. True AI intelligence built for heavy industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: P&ID Parsing */}
          <div className="bg-background-secondary border border-border-subtle rounded-md flex flex-col h-full hover:border-interactive-primary transition-colors cursor-pointer group overflow-hidden">
            <div className="w-full h-48 relative border-b border-border-subtle overflow-hidden">
               <Image 
                 src="/pid_blueprint_photo.png"
                 alt="P&ID Engineering Blueprint"
                 fill
                 className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
               />
               <div className="absolute inset-0 bg-interactive-primary mix-blend-color opacity-10 group-hover:opacity-0 transition-opacity"></div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">P&ID Vision Parsing</h3>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                Upload scanned P&IDs or engineering drawings. Our multimodal agent extracts equipment symbols, tags, and connections into a structured knowledge graph.
              </p>
            </div>
          </div>

          {/* Card 2: Tribal Knowledge Capture */}
          <div className="bg-background-secondary border border-border-subtle rounded-md flex flex-col h-full hover:border-interactive-primary transition-colors cursor-pointer group overflow-hidden">
             <div className="w-full h-48 relative border-b border-border-subtle overflow-hidden">
               <Image 
                 src="/engineer_inspection_photo.png"
                 alt="Engineer inspecting plant equipment"
                 fill
                 className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
               />
               <div className="absolute inset-0 bg-interactive-primary mix-blend-color opacity-10 group-hover:opacity-0 transition-opacity"></div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Tribal Knowledge Capture</h3>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                Don&apos;t lose expertise when engineers retire. Use our guided voice/text interview flow to convert spoken tribal knowledge into tagged, searchable entries.
              </p>
            </div>
          </div>

          {/* Card 3: Expert Copilot (UI centric) */}
          <div className="bg-background-secondary border border-border-subtle rounded-md flex flex-col h-full hover:border-interactive-primary transition-colors cursor-pointer group overflow-hidden">
             <div className="w-full h-48 relative border-b border-border-subtle overflow-hidden">
               <Image 
                 src="/copilot_chat_photo.png"
                 alt="Engineer using Copilot on Tablet"
                 fill
                 className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
               />
               <div className="absolute inset-0 bg-interactive-primary mix-blend-color opacity-10 group-hover:opacity-0 transition-opacity"></div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">Expert Copilot</h3>
              <p className="text-text-secondary text-sm leading-relaxed flex-1">
                Ask questions and get answers grounded in your plant&apos;s data. See the reasoning trail live as the agent cross-checks work orders and manuals.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Massive 400px Footer with Blurred Background */}
      <footer className="w-full relative min-h-[400px] border-t border-border-subtle flex flex-col justify-between overflow-hidden">
        {/* Background Image & Blur Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/footer_bg.png"
            alt="Industrial Background"
            fill
            className="object-cover"
          />
          {/* Extremely heavy dark blur so white text is perfectly readable */}
          <div className="absolute inset-0 bg-[#000000] opacity-80 backdrop-blur-2xl"></div>
        </div>

        {/* Footer Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row gap-16 justify-between flex-1 text-white">
          
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="IntelliPlant Logo" width={160} height={40} className="object-contain brightness-0 invert" />
            </div>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              IntelliPlant is the world&apos;s first Knowledge Graph and AI Copilot designed specifically for heavy industry. Built to decode P&amp;IDs, unify documentation, and preserve tribal knowledge before it retires.
            </p>
            <div className="pt-4">
              <Link href="/copilot" className="h-12 inline-flex px-8 bg-interactive-primary text-white items-center justify-center rounded-sm hover:bg-interactive-hover transition-colors font-medium">
                Get Started
              </Link>
            </div>
          </div>

          <div className="flex gap-16 lg:justify-end">
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-gray-200">Platform</h4>
              <Link href="/pid-explorer" className="text-sm text-gray-400 hover:text-white transition-colors">P&amp;ID Decoder</Link>
              <Link href="/capture-knowledge" className="text-sm text-gray-400 hover:text-white transition-colors">Expert Capture</Link>
              <Link href="/knowledge-graph" className="text-sm text-gray-400 hover:text-white transition-colors">Knowledge Graph</Link>
              <Link href="/copilot" className="text-sm text-gray-400 hover:text-white transition-colors">Agentic Copilot</Link>
            </div>
            
            <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-gray-200">Resources</h4>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">API Reference</Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Case Studies</Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Security</Link>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom Bar */}
        <div className="relative z-10 w-full border-t border-gray-800 py-6 px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div>© 2026 IntelliPlant. All rights reserved. Built for ET AI Hackathon 2.0.</div>
          <div className="flex gap-6 font-medium mt-4 md:mt-0">
            <Link href="#" className="hover:text-gray-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-300">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
