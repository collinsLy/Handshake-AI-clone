import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BriefcaseBusiness, Building2, CalendarDays, Check, ChevronDown, CircleHelp, Compass, FolderOpen, Inbox, ListFilter, Search, Sparkles, X, ArrowLeft, ArrowRight, Rss, Bot, DollarSign, MapPin, Clock3 } from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type ProjectStatus = 'Available' | 'In Progress' | 'Completed';
type Project = { id: string; name: string; category: string; status: ProjectStatus; description: string; tags: string[]; pay: string; age: string; progress?: string };

const projects: Project[] = [
  { id: 'gaffer', name: 'Project Gaffer', category: 'Content Review', status: 'Available', description: 'Fellows must review videos and edit captions. Ensure accuracy, timing, and accessibility compliance across a variety of content types.', tags: ['Video Review', 'Captioning', 'Accessibility'], pay: '$30/hr', age: '1 day ago' },
  { id: 'orion', name: 'Project Orion', category: 'Code Review', status: 'Available', description: 'Evaluate and rank AI-generated code snippets for correctness, efficiency, and style. Software engineering background preferred.', tags: ['Python', 'Code Review', 'Software Engineering'], pay: '$35/hr', age: '1 day ago' },
  { id: 'hedgehog', name: 'Project Hedgehog', category: 'AI Evaluation', status: 'Available', description: 'Help improve AI accuracy across audio, visual, and text tasks. Evaluate model outputs and provide structured feedback to enhance performance.', tags: ['Audio', 'Visual', 'Text Analysis'], pay: '$17/hr', age: '2 days ago' },
  { id: 'nova', name: 'Project Nova', category: 'Data Annotation', status: 'Available', description: 'Annotate and label datasets for computer vision model training. Precision and attention to detail are essential for this role.', tags: ['Image Labeling', 'Computer Vision', 'Annotation'], pay: '$25/hr', age: '3 days ago' },
  { id: 'seal', name: 'Project Seal', category: 'AI Red Teaming', status: 'In Progress', description: 'Craft difficult prompts to expose failures in model websearch and reasoning. Requires strong analytical thinking and creativity.', tags: ['Prompt Engineering', 'Reasoning', 'Research'], pay: '$140/task', age: '5 days ago', progress: '2 steps left' },
  { id: 'titan', name: 'Project Titan', category: 'Content Creation', status: 'In Progress', description: 'Write and evaluate creative content for generative AI systems. Strong writing skills and creative thinking are a must.', tags: ['Creative Writing', 'Content Evaluation', 'Storytelling'], pay: '$28/hr', age: '7 days ago', progress: '1 steps left' },
  { id: 'falcon', name: 'Project Falcon', category: 'Data Annotation', status: 'Completed', description: 'Annotate images for object detection model training. Work with diverse datasets across multiple domains and industries.', tags: ['Image Labeling', 'Object Detection'], pay: '$22/hr', age: '30 days ago' },
  { id: 'atlas', name: 'Project Atlas', category: 'Transcription', status: 'Completed', description: 'Transcribe and verify audio clips for speech recognition model improvement. Native or near-native language proficiency required.', tags: ['Transcription', 'Audio', 'Language'], pay: '$18/hr', age: '45 days ago' },
];

const navPrimary = [
  { label: 'Jobs', icon: BriefcaseBusiness }, { label: 'Explore', icon: Compass }, { label: 'Inbox', icon: Inbox },
];
const navSecondary = [
  { label: 'Feed', icon: Rss }, { label: 'AI showcase', icon: Sparkles }, { label: 'Events', icon: CalendarDays }, { label: 'Employers', icon: Building2 },
];

function Sidebar() {
  const [location, setLocation] = useLocation();
  const [toast, setToast] = useState('');
  const itemClick = (label: string) => {
    if (label === 'AI work') setLocation('/ai-work-dashboard');
    else if (label === 'Projects') setLocation('/projects');
    else setToast(`${label} is coming soon`);
    window.setTimeout(() => setToast(''), 1800);
  };
  return <aside className="workspace-sidebar sidebar-wrap flex min-h-screen flex-col py-3">
    <div className="mb-5 px-3"><Link href="/ai-work-dashboard" className="h-logo" data-testid="link-brand">H</Link></div>
    <nav className="flex flex-col gap-0.5 px-2">{navPrimary.map(({ label, icon: Icon }) => <button key={label} onClick={() => itemClick(label)} className="sidebar-item" data-testid={`button-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon /><span>{label}</span></button>)}</nav>
    <div className="sidebar-divider mx-3 my-3 border-t border-[#e5e5e5]" />
    <nav className="flex flex-col gap-0.5 px-2">{navSecondary.map(({ label, icon: Icon }) => <button key={label} onClick={() => itemClick(label)} className="sidebar-item" data-testid={`button-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon /><span>{label}</span></button>)}</nav>
    <div className="sidebar-divider mx-3 my-3 border-t border-[#e5e5e5]" />
    <nav className="flex flex-col gap-0.5 px-2">
      <button onClick={() => itemClick('AI work')} className={`sidebar-item ${location === '/ai-work-dashboard' || location === '/' ? 'active' : ''}`} data-testid="button-nav-ai-work"><Bot /><span>AI work</span></button>
      <button onClick={() => itemClick('Projects')} className={`sidebar-item ${location === '/projects' ? 'active' : ''}`} data-testid="button-nav-projects"><FolderOpen /><span>Projects</span></button>
    </nav>
    {toast && <div className="fixed bottom-5 left-5 z-50 rounded-md bg-[#111] px-3 py-2 text-xs text-white">{toast}</div>}
    <div className="mobile-nav">{['AI work', 'Projects'].map((label) => <button key={label} onClick={() => itemClick(label)} className={`sidebar-item ${location.includes(label === 'Projects' ? 'projects' : 'ai-work') ? 'active' : ''}`} data-testid={`button-mobile-${label.toLowerCase().replace(' ', '-')}`}>{label === 'Projects' ? <FolderOpen /> : <Bot />}<span>{label}</span></button>)}</div>
  </aside>;
}

function Header({ title = 'AI work', profileOpen, setProfileOpen }: { title?: string; profileOpen: boolean; setProfileOpen: (v: boolean) => void }) {
  const [location, setLocation] = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);
  const tabs = ['AI work', 'Projects', 'Payments', 'Referrals'];
  return <header className="workspace-header relative flex items-center justify-between bg-white px-4 md:px-5">
    <div className="top-tabs flex h-full items-center">{tabs.map((tab) => <button key={tab} onClick={() => (tab === 'Projects' ? setLocation('/projects') : tab === 'AI work' ? setLocation('/ai-work-dashboard') : setSupportOpen(true))} className={`h-full border-b-2 px-3 text-[11px] font-medium ${((tab === 'AI work' && (location === '/ai-work-dashboard' || location === '/')) || (tab === 'Projects' && location === '/projects')) ? 'border-black text-black font-semibold' : 'border-transparent text-[#777] hover:text-black'}`} data-testid={`button-tab-${tab.toLowerCase().replace(' ', '-')}`}>{tab}</button>)}</div>
    <div className="flex items-center gap-3"><button onClick={() => setSupportOpen((v) => !v)} className="flex items-center gap-1 text-[11px] text-[#666] hover:text-black" data-testid="button-support"><CircleHelp size={12} /> Support</button><button onClick={() => setProfileOpen(!profileOpen)} className="flex h-5 w-5 items-center justify-center rounded-full bg-[#111] text-[9px] font-bold text-white" data-testid="button-profile">AI</button>
      {supportOpen && <Popover className="right-12 top-8 w-52"><p className="font-semibold">How can we help?</p><p className="mt-1 text-xs text-[#777]">Contact support for help with your projects and account.</p><button onClick={() => setSupportOpen(false)} className="mt-3 w-full rounded border px-2 py-1 text-xs">Close</button></Popover>}
      {profileOpen && <Popover className="right-2 top-8 w-40"><p className="font-semibold">AI contributor</p><p className="mt-1 text-xs text-[#777]">Account settings</p><button onClick={() => setProfileOpen(false)} className="mt-3 w-full rounded border px-2 py-1 text-xs">Close</button></Popover>}
    </div>
  </header>;
}

function Popover({ children, className = '' }: { children: ReactNode; className?: string }) { return <div className={`absolute z-40 rounded-lg border border-[#dedede] bg-white p-3 text-xs shadow-lg ${className}`}>{children}</div>; }

function Workspace({ children, title: _title }: { children: ReactNode; title?: string }) {
  const [profileOpen, setProfileOpen] = useState(false);
  return <div className="workspace-shell flex flex-col md:flex-row"><Sidebar /><div className="workspace-main flex min-h-[calc(100dvh-52px)] flex-col md:min-h-screen"><Header title={_title} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />{children}</div></div>;
}

function Assessment() {
  const [, setLocation] = useLocation();
  return <Workspace><main className="relative flex min-h-[calc(100dvh-52px)] flex-1 items-center justify-center px-5"><div className="max-w-[430px] text-center"><h1 className="text-[27px] font-bold leading-tight tracking-[-.035em] md:text-[28px]">You passed the assessment!</h1><p className="mt-3 text-[13px] leading-[1.4] text-[#777]">This task type will now be available to you in the drop-down. Great job!</p><div className="mt-7 flex flex-col items-center gap-3"><button onClick={() => setLocation('/projects')} className="solid-btn px-4 py-2" data-testid="button-go-to-project">Go to project</button><button onClick={() => setLocation('/ai-work-dashboard')} className="text-[12px] underline underline-offset-2" data-testid="button-go-to-dashboard">Go to dashboard</button></div></div></main></Workspace>;
}

function ProjectMiniCard({ project }: { project: Project }) {
  const [, setLocation] = useLocation();
  return <article className="rounded-lg border border-[#e8e8e8] p-3.5"><div className="flex items-start justify-between"><div><h3 className="text-[12px] font-semibold">{project.name}</h3><p className="text-[11px] text-[#777]">{project.pay} · Remote · Contract</p></div></div><p className="mt-3 text-[12px] leading-[1.4] text-[#222]">{project.description}</p>{project.progress && <div className="mt-3 flex items-center gap-2"><div className="h-1 flex-1 rounded bg-[#111]" /><span className="text-[10px] text-[#777]">{project.progress}</span></div>}<div className="mt-3 flex gap-2"><button onClick={() => setLocation(`/projects?open=${project.id}`)} className="solid-btn" data-testid={`button-start-${project.id}`}>{project.status === 'In Progress' ? 'Continue' : 'Start task'}</button><button onClick={() => setLocation(`/projects?open=${project.id}`)} className="tiny-btn" data-testid={`button-view-${project.id}`}>View project</button></div></article>;
}

function Dashboard() {
  const [currentTab, setCurrentTab] = useState<'Current' | 'Past'>('Current');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checklist, setChecklist] = useState([false, false, true, true, true]);
  const [, setLocation] = useLocation();
  const faqs = ['What is it like working as an AI trainer?', 'How and when do I get paid?', 'What skills do I need to work on AI projects?', 'How many hours per week can I work?'];
  const currentProjects = ['hedgehog', 'gaffer', 'seal'].map((id) => projects.find((project) => project.id === id)).filter((project): project is Project => Boolean(project));
  const pastProjects = projects.filter((project) => project.status === 'Completed');
  return <Workspace><div className="dashboard-grid flex flex-1"><main className="dashboard-main min-w-0 flex-1"><div className="workspace-content"><section className="mb-7"><div className="mb-3 flex items-center justify-between"><h1 className="text-[14px] font-semibold">Your projects</h1><div className="flex overflow-hidden rounded-md border border-[#ddd]"><button onClick={() => setCurrentTab('Current')} className={`px-3 py-1 text-[11px] ${currentTab === 'Current' ? 'bg-black font-semibold text-white' : ''}`} data-testid="button-projects-current">Current</button><button onClick={() => setCurrentTab('Past')} className={`px-3 py-1 text-[11px] ${currentTab === 'Past' ? 'bg-black font-semibold text-white' : ''}`} data-testid="button-projects-past">Past</button></div></div>{currentTab === 'Current' ? <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{currentProjects.map((p) => <ProjectMiniCard key={p.id} project={p} />)}</div> : <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{pastProjects.map((p) => <ProjectMiniCard key={p.id} project={p} />)}</div>}</section><section className="mb-7"><h2 className="mb-3 text-[14px] font-semibold">Opportunities that might interest you</h2><div className="rounded-lg border border-dashed border-[#e0e0e0] py-8 text-center text-xs text-[#888]">No opportunities right now — check back soon.</div></section><section><h2 className="mb-3 text-[14px] font-semibold">Frequently asked questions</h2><div className="overflow-hidden rounded-lg border border-[#e4e4e4]">{faqs.map((faq, i) => <div key={faq} className="border-b border-[#e8e8e8] last:border-0"><button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between px-3.5 py-3 text-left text-[11px] hover:bg-[#fafafa]" data-testid={`button-faq-${i}`}><span>{faq}</span><ChevronDown size={13} className={`transition-transform ${openFaq === i ? 'rotate-180' : ''}`} /></button>{openFaq === i && <p className="px-3.5 pb-3 text-[11px] leading-relaxed text-[#777]">{i === 0 ? 'AI trainers review, compare, and improve model outputs with thoughtful feedback.' : i === 1 ? 'Payments are processed after approved work is completed.' : i === 2 ? 'Clear writing, careful attention, and subject expertise are useful.' : 'Choose the hours that work for your schedule.'}</p>}</div>)}</div></section></div></main><aside className="dashboard-aside w-72 shrink-0 border-l border-[#e7e7e7] bg-white px-4 py-4 xl:w-80"><div className="grid grid-cols-2 gap-y-4 border-b border-[#eee] pb-4"><div><p className="text-[10px] text-[#777]">Awaiting payout <CircleHelp size={9} className="inline" /></p><p className="metric mt-1">$0.00</p></div><div><p className="text-[10px] text-[#777]">Total paid <CircleHelp size={9} className="inline" /></p><p className="metric mt-1">$0.00</p></div><div><p className="text-[10px] text-[#777]">Tasks this week <CircleHelp size={9} className="inline" /></p><p className="metric mt-1">0</p></div><div><p className="text-[10px] text-[#777]">Hours this week <CircleHelp size={9} className="inline" /></p><p className="metric mt-1">0:00</p></div></div><section className="border-b border-[#eee] py-4"><h2 className="mb-3 text-[12px] font-semibold">Get more out of Handshake AI</h2>{[['Turn on text message updates', 'Stay in the loop with projects and opportunities'], ['Download Handshake app', 'Track earnings, projects, and referrals on the go'], ['Verify your identity', ''], ['Set up payout method', ''], ['Sign confidentiality agreement', '']].map(([title, sub], i) => <button key={title} onClick={() => setChecklist((items) => items.map((v, j) => j === i ? !v : v))} className="mb-3 flex w-full items-start gap-2 text-left" data-testid={`button-checklist-${i}`}><span className={`mt-0.5 flex h-3 w-3 items-center justify-center rounded-full border ${checklist[i] ? 'border-[#55ba7c] text-[#55ba7c]' : 'border-[#888]'}`}>{checklist[i] && <Check size={9} />}</span><span className={`text-[11px] leading-tight ${checklist[i] ? 'text-[#888] line-through' : 'text-[#222]'}`}>{title}{sub && <small className="mt-1 block text-[10px] text-[#999] no-underline">{sub}</small>}</span><ChevronDown size={12} className="ml-auto rotate-[-90deg] text-[#999]" /></button>)}</section><section className="py-4"><div className="rounded-lg border border-[#e7e7e7] p-3"><div className="flex gap-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#b8ef45] text-[15px]"><DollarSign size={14} /></div><div><p className="text-[11px] font-semibold">Earn up to $700 for each referral</p><p className="mt-1 text-[10px] leading-tight text-[#777]">Help your network find meaningful AI work and earn as they earn. <button onClick={() => setSupportToast()} className="underlined text-[#333]" data-testid="button-view-terms">View terms</button></p></div></div></div><button onClick={() => setLocation('/ai-work-dashboard?referrals=open')} className="tiny-btn mt-4 w-full" data-testid="button-view-referrals">View referrals</button></section></aside></div></Workspace>;
}
function setSupportToast() { /* local action intentionally keeps terms inline */ }

function ProjectBrowser() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | ProjectStatus>('All');
  const [sort, setSort] = useState('Newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(() => projects.find((p) => p.id === searchParams.get('open')) ?? null);
  const [remoteOnly, setRemoteOnly] = useState(true);
  useEffect(() => {
    const syncProject = () => setSelected(projects.find((p) => p.id === new URLSearchParams(window.location.search).get('open')) ?? null);
    window.addEventListener('popstate', syncProject);
    return () => window.removeEventListener('popstate', syncProject);
  }, []);
  const visible = useMemo(() => {
    let list = projects.filter((p) => (status === 'All' || p.status === status) && (`${p.name} ${p.category} ${p.description} ${p.tags.join(' ')}`).toLowerCase().includes(search.toLowerCase()));
    if (sort === 'Highest Pay') list = [...list].sort((a, b) => Number(b.pay.replace(/\D/g, '')) - Number(a.pay.replace(/\D/g, '')));
    if (sort === 'Lowest Pay') list = [...list].sort((a, b) => Number(a.pay.replace(/\D/g, '')) - Number(b.pay.replace(/\D/g, '')));
    return list;
  }, [search, sort, status]);
  const openProject = (project: Project) => { setSelected(project); window.history.pushState({}, '', `/projects?open=${project.id}`); };
  return <Workspace title="Projects"><main className="workspace-content flex-1"><div className="mb-4 flex items-start justify-between"><div><h1 className="text-[17px] font-bold tracking-[-.03em]">Projects</h1><p className="mt-0.5 text-[11px] text-[#888]">Browse and manage your AI work projects</p></div><div className="hidden items-center gap-2 md:flex"><span className="rounded-full bg-[#f5f5f5] px-2 py-1 text-[10px] text-[#777]">4 available</span><span className="rounded-full bg-[#f1f5ff] px-2 py-1 text-[10px] text-[#416db9]">2 in progress</span><span className="rounded-full bg-[#f5f5f5] px-2 py-1 text-[10px] text-[#777]">2 completed</span></div></div><div className="mb-4 flex flex-wrap gap-2"><div className="relative min-w-[220px] flex-1"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects, skills, categories..." className="h-7 w-full rounded-lg border border-[#e2e2e2] pl-8 pr-3 text-[11px] outline-none focus:border-black" data-testid="input-search-projects" /></div><button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex h-7 items-center gap-2 rounded-lg border px-3 text-[11px] ${filtersOpen ? 'border-black bg-[#fafafa]' : 'border-[#e2e2e2]'}`} data-testid="button-filters"><ListFilter size={12} /> Filters</button><select value={sort} onChange={(e) => setSort(e.target.value)} className="h-7 rounded-lg border border-[#e2e2e2] bg-white px-2 text-[11px]" data-testid="select-sort"><option>Newest</option><option>Highest Pay</option><option>Lowest Pay</option></select></div>{filtersOpen && <div className="mb-4 flex items-center gap-3 rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-3 text-[11px]"><label className="flex items-center gap-2"><input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} data-testid="checkbox-remote" /> Remote projects</label><span className="text-[#888]">All projects are currently remote.</span></div>}<div className="mb-5 flex items-center gap-0 border-b border-[#e5e5e5]">{(['All', 'Available', 'In Progress', 'Completed'] as const).map((tab) => <button key={tab} onClick={() => setStatus(tab)} className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-[11px] ${status === tab ? 'border-black font-semibold text-black' : 'border-transparent text-[#777] hover:text-black'}`} data-testid={`button-status-${tab.toLowerCase().replace(' ', '-')}`}>{tab}<span className="text-[10px]">{tab === 'All' ? projects.length : projects.filter((p) => p.status === tab).length}</span></button>)}</div><div className="mb-3 flex items-center justify-between"><p className="text-[11px] text-[#777]">{visible.length} projects found</p><div className="flex gap-1 text-[10px] text-[#aaa]"><button onClick={() => window.history.back()} aria-label="Back" data-testid="button-history-back"><ArrowLeft size={13} /></button><button onClick={() => window.history.forward()} aria-label="Forward" data-testid="button-history-forward"><ArrowRight size={13} /></button></div></div>{visible.length ? <div className="projects-grid grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((project) => <ProjectCard key={project.id} project={project} onOpen={openProject} />)}</div> : <div className="rounded-lg border border-dashed border-[#ddd] py-20 text-center text-xs text-[#888]">No projects found. Try a different search.</div>}{selected && <ProjectDialog project={selected} onClose={() => { setSelected(null); window.history.pushState({}, '', '/projects'); }} onStart={() => setLocation('/ai-work-dashboard')} />}</main></Workspace>;
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  return <article className="project-card"><div className="flex items-start justify-between gap-2"><div><h2 className="text-[12px] font-semibold">{project.name}</h2><p className="text-[10px] text-[#999]">{project.category}</p></div><span className={`status ${project.status === 'Available' ? 'available' : project.status === 'In Progress' ? 'progress' : 'completed'}`}>{project.status}</span></div><p className="mt-3 line-clamp-2 text-[11px] leading-[1.4] text-[#555]">{project.description}</p><div className="mt-3 flex flex-wrap gap-1">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>{project.progress && <div className="mt-3 flex items-center gap-2"><span className="text-[10px] font-medium">Progress</span><div className="h-1 flex-1 rounded bg-[#111]" /><span className="text-[10px] text-[#777]">{project.progress}</span></div>}<div className="mt-auto flex items-center gap-2 pt-3 text-[10px] text-[#777]"><span>{project.pay}</span><span className="flex items-center gap-0.5"><MapPin size={10} /> Remote</span><span className="flex items-center gap-0.5"><Clock3 size={10} /> {project.age}</span></div><div className="mt-3 flex gap-2 border-t border-[#eee] pt-3">{project.status !== 'Completed' && <button onClick={() => onOpen(project)} className="solid-btn py-1.5 px-3 text-[11px]" data-testid={`button-card-action-${project.id}`}>{project.status === 'In Progress' ? 'Continue' : 'Start task'}</button>}<button onClick={() => onOpen(project)} className="tiny-btn py-1.5 px-3 text-[11px]" data-testid={`button-card-details-${project.id}`}>View details</button></div></article>;
}

function ProjectDialog({ project, onClose, onStart }: { project: Project; onClose: () => void; onStart: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4" role="dialog" aria-modal="true"><div className="w-full max-w-[480px] rounded-xl bg-white p-5 shadow-xl"><div className="flex justify-between"><div><p className="text-[10px] text-[#777]">{project.category}</p><h2 className="mt-1 text-lg font-bold">{project.name}</h2></div><button onClick={onClose} aria-label="Close project details" data-testid="button-close-project-dialog"><X size={17} /></button></div><p className="mt-5 text-[12px] leading-relaxed text-[#555]">{project.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#eee] py-4 text-xs"><div><p className="text-[#999]">Compensation</p><p className="mt-1 font-semibold">{project.pay}</p></div><div><p className="text-[#999]">Location</p><p className="mt-1 font-semibold">Remote</p></div></div><div className="mt-5 flex justify-end gap-2"><button onClick={onClose} className="tiny-btn" data-testid="button-dialog-cancel">Close</button>{project.status !== 'Completed' && <button onClick={onStart} className="solid-btn" data-testid="button-dialog-start">{project.status === 'In Progress' ? 'Continue' : 'Start task'}</button>}</div></div></div>;
}

function Router() {
  return <ErrorBoundary resetKey={window.location.pathname}><Switch><Route path="/" component={Assessment} /><Route path="/ai-work-dashboard" component={Dashboard} /><Route path="/projects" component={ProjectBrowser} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }

export default App;