import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  DollarSign,
  FolderOpen,
  Inbox,
  ListFilter,
  MapPin,
  MessageSquare,
  Rss,
  Search,
  Sparkles,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Route, Switch, Link, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();
const HEDGEHOG_SIGN_IN_URL = 'https://www.multimango.com/sign-in';
const HEDGEHOG_TASK_URL = 'https://label-exhed4afhtahh0b7.eastus2-01.azurewebsites.net/?projectId=sr_metareranker_toloka_regular_v4&source=toloka&workerId=73e7755de4fff2b35dff414e58ef74fe&hitId=reindeer.01a0a634-381e-70af-8ebe-d957672ae452';

type ProjectStatus = 'Available' | 'In Progress' | 'Completed';
type Project = {
  id: string;
  name: string;
  category: string;
  status: ProjectStatus;
  description: string;
  tags: string[];
  pay: string;
  age: string;
  progress?: string;
};

const projects: Project[] = [
  { id: 'hedgehog', name: 'Project Hedgehog', category: 'AI Evaluation', status: 'Available', description: 'Help improve AI accuracy across audio, visual, and text tasks. Evaluate model outputs and provide structured feedback to enhance performance.', tags: ['Audio', 'Visual', 'Text Analysis'], pay: '$17/hr', age: '2 days ago' },
];

const navPrimary: { label: string; path: string; icon: LucideIcon }[] = [
  { label: 'Jobs', path: '/jobs', icon: BriefcaseBusiness },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Inbox', path: '/inbox', icon: Inbox },
];
const navSecondary: { label: string; path: string; icon: LucideIcon }[] = [
  { label: 'Feed', path: '/feed', icon: Rss },
  { label: 'AI showcase', path: '/ai-showcase', icon: Sparkles },
  { label: 'Events', path: '/events', icon: CalendarDays },
  { label: 'Employers', path: '/employers', icon: Building2 },
];
const workspaceLinks = [
  { label: 'AI work', path: '/ai-work-dashboard', icon: BriefcaseBusiness },
  { label: 'Projects', path: '/projects', icon: FolderOpen },
];
const topTabs = [
  { label: 'AI work', path: '/ai-work-dashboard' },
  { label: 'Projects', path: '/projects' },
  { label: 'Payments', path: '/payments' },
  { label: 'Referrals', path: '/referrals' },
];

function isActivePath(location: string, path: string) {
  return path === '/ai-work-dashboard' ? location === path || location === '/' : location.startsWith(path);
}

function Sidebar() {
  const [location, setLocation] = useLocation();
  const go = (path: string) => setLocation(path);
  return (
    <aside className="workspace-sidebar sidebar-wrap flex min-h-screen flex-col py-3">
      <div className="mb-5 px-3">
        <Link href="/ai-work-dashboard" className="h-logo block overflow-hidden" data-testid="link-brand">
          <img src="/handshake-logo.png" alt="Handshake" className="h-full w-full object-cover" />
        </Link>
      </div>
      <nav className="flex flex-col gap-0.5 px-2">
        {navPrimary.map(({ label, path, icon: Icon }) => (
          <button key={label} onClick={() => go(path)} className={`sidebar-item ${isActivePath(location, path) ? 'active' : ''}`} data-testid={`button-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-divider mx-3 my-3 border-t border-[#e5e5e5]" />
      <nav className="flex flex-col gap-0.5 px-2">
        {navSecondary.map(({ label, path, icon: Icon }) => (
          <button key={label} onClick={() => go(path)} className={`sidebar-item ${isActivePath(location, path) ? 'active' : ''}`} data-testid={`button-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-divider mx-3 my-3 border-t border-[#e5e5e5]" />
      <nav className="flex flex-col gap-0.5 px-2">
        {workspaceLinks.map(({ label, path, icon: Icon }) => (
          <button key={label} onClick={() => go(path)} className={`sidebar-item ${isActivePath(location, path) ? 'active' : ''}`} data-testid={`button-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mobile-nav">
        {workspaceLinks.map(({ label, path, icon: Icon }) => (
          <button key={label} onClick={() => go(path)} className={`sidebar-item ${isActivePath(location, path) ? 'active' : ''}`} data-testid={`button-mobile-${label.toLowerCase().replace(' ', '-')}`}>
            <Icon /><span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function Header({ profileOpen, setProfileOpen }: { profileOpen: boolean; setProfileOpen: (value: boolean) => void }) {
  const [location, setLocation] = useLocation();
  const [supportOpen, setSupportOpen] = useState(false);
  return (
    <header className="workspace-header relative flex items-center justify-between bg-white px-4 md:px-5">
      <div className="top-tabs flex h-full items-center">
        {topTabs.map((tab) => (
          <button key={tab.path} onClick={() => setLocation(tab.path)} className={`h-full border-b-2 px-3 text-[11px] font-medium ${isActivePath(location, tab.path) ? 'border-black font-semibold text-black' : 'border-transparent text-[#777] hover:text-black'}`} data-testid={`button-tab-${tab.label.toLowerCase().replace(' ', '-')}`}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => setSupportOpen((open) => !open)} className="flex items-center gap-1 text-[11px] text-[#666] hover:text-black" data-testid="button-support">
          <CircleHelp size={12} /> Support
        </button>
        <button onClick={() => setProfileOpen(!profileOpen)} className="profile-avatar flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white" data-testid="button-profile">M</button>
        {supportOpen && (
          <Popover className="right-12 top-8 w-56">
            <p className="font-semibold">How can we help?</p>
            <p className="mt-1 text-xs text-[#777]">Find answers or contact the Handshake AI support team.</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setLocation('/support')} className="solid-btn flex-1 py-1.5 text-[11px]">Open support</button>
              <button onClick={() => setSupportOpen(false)} className="tiny-btn flex-1 py-1.5 text-[11px]">Close</button>
            </div>
          </Popover>
        )}
        {profileOpen && (
          <Popover className="profile-menu right-2 top-8 w-56">
            <p className="mb-2 text-[11px] font-semibold">Profile</p>
            {[
              ['My jobs', '/jobs'],
              ['Documents', '/account'],
              ['Career interests', '/account'],
              ['Notification preferences', '/account'],
              ['School connections', '/account'],
              ['Settings', '/account'],
              ['Support', '/support'],
            ].map(([label, path]) => <button key={label} onClick={() => { setProfileOpen(false); setLocation(path); }} className="profile-menu-item">{label}</button>)}
            <div className="my-2 border-t border-[#eee]" />
            <button onClick={() => { setProfileOpen(false); setLocation('/support'); }} className="profile-menu-item">Help center</button>
            <button onClick={() => { setProfileOpen(false); setLocation('/support'); }} className="profile-menu-item">Terms of Service</button>
            <button onClick={() => { setProfileOpen(false); setLocation('/'); }} className="profile-menu-item">Log out</button>
          </Popover>
        )}
      </div>
    </header>
  );
}

function Popover({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`absolute z-40 rounded-lg border border-[#dedede] bg-white p-3 text-xs shadow-lg ${className}`}>{children}</div>;
}

function Workspace({ children }: { children: ReactNode }) {
  const [profileOpen, setProfileOpen] = useState(false);
  return (
    <div className="workspace-shell flex flex-col md:flex-row">
      <Sidebar />
      <div className="workspace-main flex min-h-[calc(100dvh-52px)] flex-col md:min-h-screen">
        <Header profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
        {children}
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-[480px] rounded-xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close dialog" className="rounded p-1 hover:bg-[#f2f2f2]"><X size={17} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Assessment() {
  const [, setLocation] = useLocation();
  return (
    <Workspace>
      <main className="relative flex min-h-[calc(100dvh-52px)] flex-1 items-center justify-center px-5">
        <div className="max-w-[430px] text-center">
          <h1 className="text-[27px] font-bold leading-tight tracking-[-.035em] md:text-[28px]">You passed the assessment!</h1>
          <p className="mt-3 text-[13px] leading-[1.4] text-[#777]">This task type will now be available to you in the drop-down. Great job!</p>
          <div className="mt-7 flex flex-col items-center gap-3">
            <button onClick={() => setLocation('/projects')} className="solid-btn px-4 py-2" data-testid="button-go-to-project">Go to project</button>
            <button onClick={() => setLocation('/ai-work-dashboard')} className="text-[12px] underline underline-offset-2" data-testid="button-go-to-dashboard">Go to dashboard</button>
          </div>
        </div>
      </main>
    </Workspace>
  );
}

function storedIds(key: string): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function projectWithStoredStatus(project: Project, started: string[]) {
  return started.includes(project.id) && project.status === 'Available' ? { ...project, status: 'In Progress' as ProjectStatus, progress: '3 steps left' } : project;
}

function launchHedgehogSignIn() {
  window.location.assign(HEDGEHOG_SIGN_IN_URL);
}

function ProjectMiniCard({ project, onOpen, onStart }: { project: Project; onOpen: (project: Project) => void; onStart: (project: Project) => void }) {
  return (
    <article className="rounded-lg border border-[#e8e8e8] p-3.5">
      <div className="flex items-start justify-between">
        <div><h3 className="text-[12px] font-semibold">{project.name}</h3><p className="text-[11px] text-[#777]">{project.pay} · Remote · Contract</p></div>
      </div>
      <p className="mt-3 text-[12px] leading-[1.4] text-[#222]">{project.description}</p>
      {project.progress && <div className="mt-3 flex items-center gap-2"><div className="h-1 flex-1 rounded bg-[#111]" /><span className="text-[10px] text-[#777]">{project.progress}</span></div>}
      <div className="mt-3 flex gap-2">
        <button onClick={() => onStart(project)} className="solid-btn" data-testid={`button-start-${project.id}`}>{project.status === 'In Progress' ? 'Continue' : 'Start task'}</button>
        <button onClick={() => onOpen(project)} className="tiny-btn" data-testid={`button-view-${project.id}`}>View project</button>
      </div>
    </article>
  );
}

function Dashboard() {
  const [, setLocation] = useLocation();
  const [currentTab, setCurrentTab] = useState<'Current' | 'Past'>('Current');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [checklist, setChecklist] = useState(() => {
    const saved = storedIds('handshake-checklist');
    return [false, false, true, true, true].map((value, index) => saved.includes(String(index)) ? !value : value);
  });
  const [termsOpen, setTermsOpen] = useState(false);
  const [started] = useState(() => storedIds('handshake-started-projects'));
  const faqs = ['What is it like working as an AI trainer?', 'How and when do I get paid?', 'What skills do I need to work on AI projects?', 'How many hours per week can I work?'];
  const currentProjects = projects.map((project) => projectWithStoredStatus(project, started));
  const pastProjects = projects.filter((project) => project.status === 'Completed');
  const toggleChecklist = (index: number) => {
    const next = checklist.map((value, current) => current === index ? !value : value);
    setChecklist(next);
    window.localStorage.setItem('handshake-checklist', JSON.stringify(next.map((value, current) => value !== [false, false, true, true, true][current] ? String(current) : null).filter(Boolean)));
  };
  const openProject = (project: Project) => setLocation(`/projects?open=${project.id}`);
  return (
    <Workspace>
      <div className="dashboard-grid flex flex-1">
        <main className="dashboard-main min-w-0 flex-1">
          <div className="workspace-content">
            <section className="mb-7">
              <div className="mb-3 flex items-center justify-between"><h1 className="text-[14px] font-semibold">Your projects</h1><div className="flex overflow-hidden rounded-md border border-[#ddd]"><button onClick={() => setCurrentTab('Current')} className={`px-3 py-1 text-[11px] ${currentTab === 'Current' ? 'bg-black font-semibold text-white' : ''}`} data-testid="button-projects-current">Current</button><button onClick={() => setCurrentTab('Past')} className={`px-3 py-1 text-[11px] ${currentTab === 'Past' ? 'bg-black font-semibold text-white' : ''}`} data-testid="button-projects-past">Past</button></div></div>
              {currentTab === 'Current' ? <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{currentProjects.map((project) => <ProjectMiniCard key={project.id} project={project} onOpen={openProject} onStart={launchHedgehogSignIn} />)}</div> : <div className="rounded-lg border border-dashed border-[#ddd] py-12 text-center text-xs text-[#777]">No past projects yet.</div>}
            </section>
            <section className="mb-7"><h2 className="mb-3 text-[14px] font-semibold">Opportunities that might interest you</h2><div className="rounded-lg border border-dashed border-[#e0e0e0] py-8 text-center text-xs text-[#888]">No opportunities right now — check back soon.</div></section>
            <section><h2 className="mb-3 text-[14px] font-semibold">Frequently asked questions</h2><div className="overflow-hidden rounded-lg border border-[#e4e4e4]">{faqs.map((faq, index) => <div key={faq} className="border-b border-[#e8e8e8] last:border-0"><button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between px-3.5 py-3 text-left text-[11px] hover:bg-[#fafafa]" data-testid={`button-faq-${index}`}><span>{faq}</span><ChevronDown size={13} className={`transition-transform ${openFaq === index ? 'rotate-180' : ''}`} /></button>{openFaq === index && <p className="px-3.5 pb-3 text-[11px] leading-relaxed text-[#777]">{['AI trainers review, compare, and improve model outputs with thoughtful feedback.', 'Payments are processed after approved work is completed.', 'Clear writing, careful attention, and subject expertise are useful.', 'Choose the hours that work for your schedule.'][index]}</p>}</div>)}</div></section>
          </div>
        </main>
        <aside className="dashboard-aside w-72 shrink-0 border-l border-[#e7e7e7] bg-white px-4 py-4 xl:w-80">
          <div className="grid grid-cols-2 gap-y-4 border-b border-[#eee] pb-4">{[['Awaiting payout', '$0.00'], ['Total paid', '$0.00'], ['Tasks this week', '0'], ['Hours this week', '0:00']].map(([label, value]) => <div key={label}><p className="text-[10px] text-[#777]">{label} <CircleHelp size={9} className="inline" /></p><p className="metric mt-1">{value}</p></div>)}</div>
          <section className="border-b border-[#eee] py-4"><h2 className="mb-3 text-[12px] font-semibold">Get more out of Handshake AI</h2>{[['Turn on text message updates', 'Stay in the loop with projects and opportunities'], ['Download Handshake app', 'Track earnings, projects, and referrals on the go'], ['Verify your identity', ''], ['Set up payout method', ''], ['Sign confidentiality agreement', '']].map(([title, sub], index) => <button key={title} onClick={() => toggleChecklist(index)} className="mb-3 flex w-full items-start gap-2 text-left" data-testid={`button-checklist-${index}`}><span className={`mt-0.5 flex h-3 w-3 items-center justify-center rounded-full border ${checklist[index] ? 'border-[#55ba7c] text-[#55ba7c]' : 'border-[#888]'}`}>{checklist[index] && <Check size={9} />}</span><span className={`text-[11px] leading-tight ${checklist[index] ? 'text-[#888] line-through' : 'text-[#222]'}`}>{title}{sub && <small className="mt-1 block text-[10px] text-[#999] no-underline">{sub}</small>}</span><ChevronDown size={12} className="ml-auto rotate-[-90deg] text-[#999]" /></button>)}</section>
          <section className="py-4"><div className="rounded-lg border border-[#e7e7e7] p-3"><div className="flex gap-2"><div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#b8ef45]"><img src="/handshake-logo.png" alt="" className="h-full w-full object-cover" /></div><div><p className="text-[11px] font-semibold">Earn up to $700 for each referral</p><p className="mt-1 text-[10px] leading-tight text-[#777]">Help your network find meaningful AI work and earn as they earn. <button onClick={() => setTermsOpen(true)} className="underlined text-[#333]" data-testid="button-view-terms">View terms</button></p></div></div></div><button onClick={() => setLocation('/referrals')} className="tiny-btn mt-4 w-full" data-testid="button-view-referrals">View referrals</button></section>
        </aside>
      </div>
      {termsOpen && <Modal title="Referral terms" onClose={() => setTermsOpen(false)}><p className="mt-4 text-sm leading-relaxed text-[#555]">Referral rewards are paid when an eligible referral completes approved work. Rewards and eligibility can vary by project and region.</p><button onClick={() => setTermsOpen(false)} className="solid-btn mt-5 w-full">Got it</button></Modal>}
    </Workspace>
  );
}

function ProjectCard({ project, onOpen, onStart }: { project: Project; onOpen: (project: Project) => void; onStart: (project: Project) => void }) {
  return <article className="project-card"><div className="flex items-start justify-between gap-2"><div><h2 className="text-[12px] font-semibold">{project.name}</h2><p className="text-[10px] text-[#999]">{project.category}</p></div><span className={`status ${project.status === 'Available' ? 'available' : project.status === 'In Progress' ? 'progress' : 'completed'}`}>{project.status}</span></div><p className="mt-3 line-clamp-2 text-[11px] leading-[1.4] text-[#555]">{project.description}</p><div className="mt-3 flex flex-wrap gap-1">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>{project.progress && <div className="mt-3 flex items-center gap-2"><span className="text-[10px] font-medium">Progress</span><div className="h-1 flex-1 rounded bg-[#111]" /><span className="text-[10px] text-[#777]">{project.progress}</span></div>}<div className="mt-auto flex items-center gap-2 pt-3 text-[10px] text-[#777]"><span>{project.pay}</span><span className="flex items-center gap-0.5"><MapPin size={10} /> Remote</span><span>{project.age}</span></div><div className="mt-3 flex gap-2 border-t border-[#eee] pt-3">{project.status !== 'Completed' && <button onClick={() => onStart(project)} className="solid-btn px-3 py-1.5 text-[11px]" data-testid={`button-card-action-${project.id}`}>{project.status === 'In Progress' ? 'Continue' : 'Start task'}</button>}<button onClick={() => onOpen(project)} className="tiny-btn px-3 py-1.5 text-[11px]" data-testid={`button-card-details-${project.id}`}>View details</button></div></article>;
}

function ProjectDialog({ project, onClose, onStart }: { project: Project; onClose: () => void; onStart: () => void }) {
  return <Modal title={project.name} onClose={onClose}><p className="mt-1 text-[10px] text-[#777]">{project.category}</p><p className="mt-5 text-[12px] leading-relaxed text-[#555]">{project.description}</p><div className="mt-4 flex flex-wrap gap-1.5">{project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div><div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#eee] py-4 text-xs"><div><p className="text-[#999]">Compensation</p><p className="mt-1 font-semibold">{project.pay}</p></div><div><p className="text-[#999]">Location</p><p className="mt-1 font-semibold">Remote</p></div></div>{project.id === 'hedgehog' && <div className="mt-4 rounded-md bg-[#f7f7f7] p-3 text-[11px] leading-relaxed text-[#666]">Create your Multimango account first. After signup, use the task workspace link below to continue.<br /><a href={HEDGEHOG_TASK_URL} target="_blank" rel="noreferrer" className="mt-1 inline-block font-semibold text-[#111] underline underline-offset-2">Open Hedgehog task workspace</a></div>}<div className="mt-5 flex justify-end gap-2"><button onClick={onClose} className="tiny-btn">Close</button>{project.status !== 'Completed' && <button onClick={onStart} className="solid-btn">{project.status === 'In Progress' ? 'Continue' : 'Start task'}</button>}</div></Modal>;
}

function ProjectBrowser() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'All' | ProjectStatus>('All');
  const [sort, setSort] = useState('Newest');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(() => projects.find((project) => project.id === searchParams.get('open')) ?? null);
  const [remoteOnly, setRemoteOnly] = useState(true);
  const [started, setStarted] = useState(() => storedIds('handshake-started-projects'));
  useEffect(() => { const sync = () => setSelected(projects.find((project) => project.id === new URLSearchParams(window.location.search).get('open')) ?? null); window.addEventListener('popstate', sync); return () => window.removeEventListener('popstate', sync); }, []);
  const visible = useMemo(() => {
    let list = projects.map((project) => projectWithStoredStatus(project, started)).filter((project) => (status === 'All' || project.status === status) && (`${project.name} ${project.category} ${project.description} ${project.tags.join(' ')}`).toLowerCase().includes(search.toLowerCase()));
    if (sort === 'Highest Pay') list = [...list].sort((a, b) => Number(b.pay.replace(/\D/g, '')) - Number(a.pay.replace(/\D/g, '')));
    if (sort === 'Lowest Pay') list = [...list].sort((a, b) => Number(a.pay.replace(/\D/g, '')) - Number(b.pay.replace(/\D/g, '')));
    return remoteOnly ? list : list;
  }, [search, sort, status, remoteOnly, started]);
  const openProject = (project: Project) => { setSelected(project); window.history.pushState({}, '', `/projects?open=${project.id}`); };
  const startProject = (project: Project) => { const next = started.includes(project.id) ? started : [...started, project.id]; setStarted(next); window.localStorage.setItem('handshake-started-projects', JSON.stringify(next)); launchHedgehogSignIn(); };
  return <Workspace><main className="workspace-content flex-1"><div className="mb-4 flex items-start justify-between"><div><h1 className="text-[17px] font-bold tracking-[-.03em]">Projects</h1><p className="mt-0.5 text-[11px] text-[#888]">Browse and manage your AI work projects</p></div><div className="hidden items-center gap-2 md:flex"><span className="rounded-full bg-[#edfad6] px-2 py-1 text-[10px] text-[#4c8010]">1 available</span></div></div><div className="mb-4 flex flex-wrap gap-2"><div className="relative min-w-[220px] flex-1"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search projects, skills, categories..." className="h-7 w-full rounded-lg border border-[#e2e2e2] pl-8 pr-3 text-[11px] outline-none focus:border-black" data-testid="input-search-projects" /></div><button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex h-7 items-center gap-2 rounded-lg border px-3 text-[11px] ${filtersOpen ? 'border-black bg-[#fafafa]' : 'border-[#e2e2e2]'}`} data-testid="button-filters"><ListFilter size={12} /> Filters</button><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-7 rounded-lg border border-[#e2e2e2] bg-white px-2 text-[11px]"><option>Newest</option><option>Highest Pay</option><option>Lowest Pay</option></select></div>{filtersOpen && <div className="mb-4 flex items-center gap-3 rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-3 text-[11px]"><label className="flex items-center gap-2"><input type="checkbox" checked={remoteOnly} onChange={(event) => setRemoteOnly(event.target.checked)} data-testid="checkbox-remote" /> Remote projects</label><span className="text-[#888]">The Hedgehog project is remote.</span></div>}<div className="mb-5 flex items-center gap-0 border-b border-[#e5e5e5]">{(['All', 'Available', 'In Progress', 'Completed'] as const).map((tab) => <button key={tab} onClick={() => setStatus(tab)} className={`flex items-center gap-1.5 border-b-2 px-3 py-2 text-[11px] ${status === tab ? 'border-black font-semibold text-black' : 'border-transparent text-[#777] hover:text-black'}`} data-testid={`button-status-${tab.toLowerCase().replace(' ', '-')}`}>{tab}<span className="text-[10px]">{projects.map((project) => projectWithStoredStatus(project, started)).filter((project) => tab === 'All' || project.status === tab).length}</span></button>)}</div><div className="mb-3 flex items-center justify-between"><p className="text-[11px] text-[#777]">{visible.length} projects found</p><div className="flex gap-1 text-[10px] text-[#aaa]"><button onClick={() => window.history.back()} aria-label="Back" data-testid="button-history-back"><ArrowLeft size={13} /></button><button onClick={() => window.history.forward()} aria-label="Forward" data-testid="button-history-forward"><ArrowRight size={13} /></button></div></div>{visible.length ? <div className="projects-grid grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">{visible.map((project) => <ProjectCard key={project.id} project={project} onOpen={openProject} onStart={startProject} />)}</div> : <div className="rounded-lg border border-dashed border-[#ddd] py-20 text-center text-xs text-[#888]">No projects found. Try a different search.</div>}{selected && <ProjectDialog project={selected} onClose={() => { setSelected(null); window.history.pushState({}, '', '/projects'); }} onStart={() => startProject(selected)} />}</main></Workspace>;
}

function PaymentsPage() {
  const [, setLocation] = useLocation();
  const [projectFilter, setProjectFilter] = useState('All projects');
  const [period, setPeriod] = useState('Time period');
  const [modal, setModal] = useState<'payout' | 'w9' | null>(null);
  const periods = ['Dec 08 – 14', 'Dec 15 – 21', 'Dec 22 – 28', 'Dec 29 – Jan 4', 'Jan 05 – 11', 'Jan 12 – 18'];
  return (
    <Workspace>
      <main className="workspace-content flex-1">
        <div className="payments-page-grid">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="h-7 rounded-md border border-[#dedede] bg-white px-2 text-[11px]"><option>All projects</option><option>Project Hedgehog</option></select>
              <select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-7 rounded-md border border-[#dedede] bg-white px-2 text-[11px]"><option>Time period</option><option>Last 30 days</option><option>Last 90 days</option></select>
              <button onClick={() => setModal('payout')} className="ml-auto rounded px-2 py-1 text-[#888] hover:bg-[#f4f4f4]" aria-label="Payment options">•••</button>
            </div>
            <article className="payment-card">
              <div className="flex items-start justify-between"><div><h1 className="text-[14px] font-semibold">Earnings</h1><p className="mt-1 text-[11px] text-[#888]">{projectFilter} · {period}</p></div><p className="text-[11px] text-[#777]"><strong className="text-[#111]">$0.00</strong> total earnings</p></div>
              <div className="payment-chart mt-5"><div className="payment-y-axis"><span>$0</span><span>$20</span><span>$40</span><span>$60</span></div><div className="payment-bars">{periods.map((label) => <div key={label} className="payment-bar-group"><div className="payment-bar" /><span>{label}</span></div>)}</div></div>
            </article>
            <div className="payment-payout-list mt-3">
              {['Jan 8 – Jan 16, 2026', 'Dec 30 – Jan 4, 2026', 'Dec 22 – 28, 2025', 'Dec 15 – 21, 2025'].map((label) => <button key={label} onClick={() => setModal('payout')} className="payment-row"><span className="flex items-center gap-2"><ChevronDown size={13} />{label}</span><span className="flex items-center gap-6"><span className="text-[10px] text-[#63a36f]">Paid on Jan 16, 2026</span><strong>$0.00</strong></span></button>)}
            </div>
          </section>
          <aside className="payments-panel">
            <div className="grid grid-cols-2 gap-4 border-b border-[#eee] pb-5"><div><p className="text-[10px] text-[#777]">Earnings awaiting payout <CircleHelp size={9} className="inline" /></p><p className="metric mt-1">$0.00</p></div><div><p className="text-[10px] text-[#777]">Total paid <CircleHelp size={9} className="inline" /></p><p className="metric mt-1">$0.00</p></div></div>
            <button onClick={() => setModal('payout')} className="payment-side-row"><span><strong>Payout method</strong><small>Not set up</small></span><ChevronDown size={15} className="rotate-[-90deg]" /></button>
            <button onClick={() => setLocation('/support')} className="payment-side-row"><span><strong>Payment help center</strong><small>Find answers about payouts</small></span><ChevronDown size={15} className="rotate-[-90deg]" /></button>
            <button onClick={() => setModal('w9')} className="payment-side-row"><span><strong>W-9 form</strong><small>Download or update your tax form</small></span><ArrowRight size={15} /></button>
            <p className="mt-4 text-[10px] leading-relaxed text-[#777]">Payments are processed on Wednesdays for the prior work. Your total may take a few days to post to the funds.</p>
          </aside>
        </div>
      </main>
      {modal === 'payout' && <Modal title="Payout method" onClose={() => setModal(null)}><p className="mt-4 text-sm leading-relaxed text-[#555]">Your balance is currently $0.00. Add a payout method to receive future approved earnings.</p><button onClick={() => setModal(null)} className="solid-btn mt-5 w-full">Add payout method</button></Modal>}
      {modal === 'w9' && <Modal title="W-9 form" onClose={() => setModal(null)}><p className="mt-4 text-sm leading-relaxed text-[#555]">There is no W-9 form to download yet. Complete your contributor profile when you are ready to receive payments.</p><button onClick={() => { setModal(null); setLocation('/account'); }} className="solid-btn mt-5 w-full">Open account settings</button></Modal>}
    </Workspace>
  );
}

type ContentItem = { title: string; detail: string; meta: string; action: string };
const pageContent: Record<string, { title: string; subtitle: string; icon: LucideIcon; items: ContentItem[] }> = {
  jobs: { title: 'Jobs', subtitle: 'Find flexible work that helps improve AI.', icon: BriefcaseBusiness, items: [{ title: 'AI response evaluator', detail: 'Review model responses for accuracy, clarity, and helpfulness.', meta: '$24/hr · Remote', action: 'View job' }, { title: 'Audio quality reviewer', detail: 'Listen to short clips and label speech and sound quality.', meta: '$20/hr · Remote', action: 'View job' }, { title: 'Research prompt tester', detail: 'Test prompts and document where AI reasoning needs improvement.', meta: '$30/hr · Remote', action: 'View job' }] },
  explore: { title: 'Explore', subtitle: 'Discover projects, people, and ways to participate.', icon: Compass, items: [{ title: 'Recommended for you', detail: 'Projects selected from your skills and assessment history.', meta: '3 matches', action: 'See projects' }, { title: 'Build your profile', detail: 'Add skills and experience to unlock more opportunities.', meta: 'Profile strength: 60%', action: 'Update profile' }] },
  inbox: { title: 'Inbox', subtitle: 'Keep up with messages from Handshake AI.', icon: Inbox, items: [{ title: 'Welcome to Handshake AI', detail: 'Your contributor workspace is ready. Start by browsing available projects.', meta: 'Today', action: 'Open message' }, { title: 'Project update', detail: 'Your current project has new guidance available to review.', meta: 'Yesterday', action: 'Read update' }] },
  feed: { title: 'Feed', subtitle: 'Updates from your AI work community.', icon: Rss, items: [{ title: 'New project types are now available', detail: 'Explore new evaluation and annotation opportunities in Projects.', meta: '2 hours ago', action: 'Explore projects' }, { title: 'Contributor spotlight', detail: 'See how other contributors are building useful AI skills.', meta: 'Yesterday', action: 'Read story' }] },
  'ai-showcase': { title: 'AI showcase', subtitle: 'See examples of AI work from the community.', icon: Sparkles, items: [{ title: 'Making model feedback more useful', detail: 'A guide to writing feedback that helps models improve.', meta: 'Guide · 5 min', action: 'Read guide' }, { title: 'Behind the evaluation', detail: 'Learn how careful human review shapes trustworthy AI.', meta: 'Story · 8 min', action: 'View story' }] },
  events: { title: 'Events', subtitle: 'Join sessions for contributors and AI builders.', icon: CalendarDays, items: [{ title: 'Contributor orientation', detail: 'A live walkthrough of projects, payouts, and best practices.', meta: 'Sep 24 · Online', action: 'Save event' }, { title: 'AI evaluation workshop', detail: 'Learn practical techniques for reviewing model outputs.', meta: 'Oct 2 · Online', action: 'Register' }] },
  employers: { title: 'Employers', subtitle: 'Learn about teams building with Handshake AI.', icon: Building2, items: [{ title: 'Handshake AI teams', detail: 'Explore the kinds of AI systems your work helps improve.', meta: '12 teams', action: 'Browse teams' }, { title: 'Responsible AI projects', detail: 'Understand how employers use contributor feedback.', meta: 'Featured', action: 'Learn more' }] },
  payments: { title: 'Payments', subtitle: 'Track earnings and manage your payout method.', icon: DollarSign, items: [{ title: 'Awaiting payout', detail: 'No approved balance is currently awaiting payout.', meta: '$0.00', action: 'View details' }, { title: 'Payout method', detail: 'Add or update where you want to receive approved earnings.', meta: 'Not set up', action: 'Set payout method' }] },
  referrals: { title: 'Referrals', subtitle: 'Invite people to meaningful AI work and earn as they earn.', icon: UserRound, items: [{ title: 'Your referral link', detail: 'Share your link with people who would be a good fit for AI projects.', meta: '0 referrals', action: 'Copy link' }, { title: 'Referral rewards', detail: 'Eligible referrals can earn you up to $700 as they complete approved work.', meta: 'Terms apply', action: 'View terms' }] },
  support: { title: 'Support', subtitle: 'Get help with projects, payments, and your account.', icon: MessageSquare, items: [{ title: 'Project help', detail: 'Find answers to common project and assessment questions.', meta: 'Help center', action: 'Browse help' }, { title: 'Contact support', detail: 'Send a message to the Handshake AI support team.', meta: 'Usually replies within 1 business day', action: 'Start a conversation' }] },
  account: { title: 'Account settings', subtitle: 'Manage your contributor profile and preferences.', icon: UserRound, items: [{ title: 'Profile', detail: 'Keep your skills and experience up to date for better project matches.', meta: 'Profile strength: 60%', action: 'Edit profile' }, { title: 'Notifications', detail: 'Choose how you hear about new projects and updates.', meta: 'Email enabled', action: 'Manage notifications' }] },
};

function ContentPage({ pageKey }: { pageKey: string }) {
  const [, setLocation] = useLocation();
  const page = pageContent[pageKey] ?? pageContent.explore;
  const Icon = page.icon;
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const items = page.items.filter((item) => `${item.title} ${item.detail} ${item.meta}`.toLowerCase().includes(query.toLowerCase()));
  const act = (item: ContentItem) => {
    if (item.action === 'See projects' || item.action === 'Explore projects') setLocation('/projects');
    else if (item.action === 'Copy link') { setSaved((current) => current.includes(item.title) ? current : [...current, item.title]); setNotice('Referral link copied'); }
    else if (item.action === 'Save event' || item.action === 'Register') { setSaved((current) => current.includes(item.title) ? current : [...current, item.title]); setNotice('Event saved to your workspace'); }
    else if (item.action === 'View terms') setSelected(item);
    else setSelected(item);
    window.setTimeout(() => setNotice(''), 2200);
  };
  return <Workspace><main className="workspace-content flex-1"><div className="mb-6 flex items-start gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b8ef45]"><Icon size={18} /></div><div><h1 className="text-[17px] font-bold tracking-[-.03em]">{page.title}</h1><p className="mt-0.5 text-[11px] text-[#888]">{page.subtitle}</p></div></div><div className="mb-5 flex max-w-[680px] items-center gap-2"><div className="relative flex-1"><Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${page.title.toLowerCase()}...`} className="h-8 w-full rounded-lg border border-[#e2e2e2] pl-8 pr-3 text-[11px] outline-none focus:border-black" /></div><button onClick={() => setNotice('Your preferences are up to date')} className="tiny-btn h-8">Refresh</button></div><div className="content-page-grid">{items.map((item) => <article key={item.title} className="content-card"><div><p className="text-[13px] font-semibold">{item.title}</p><p className="mt-2 text-[12px] leading-relaxed text-[#666]">{item.detail}</p><p className="mt-3 text-[10px] text-[#999]">{item.meta}</p></div><button onClick={() => act(item)} className={saved.includes(item.title) ? 'tiny-btn' : 'solid-btn'}>{saved.includes(item.title) ? 'Saved' : item.action}</button></article>)}</div>{!items.length && <div className="rounded-lg border border-dashed border-[#ddd] py-20 text-center text-xs text-[#888]">Nothing found. Try another search.</div>}{notice && <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-md bg-[#111] px-3 py-2 text-xs text-white">{notice}</div>}{selected && <Modal title={selected.title} onClose={() => setSelected(null)}><p className="mt-4 text-sm leading-relaxed text-[#555]">{selected.detail}</p><p className="mt-3 text-xs text-[#888]">{selected.meta}</p><button onClick={() => setSelected(null)} className="solid-btn mt-5 w-full">Done</button></Modal>}</main></Workspace>;
}

function TaskPage() {
  const [, setLocation] = useLocation();
  const id = window.location.pathname.split('/').pop() ?? '';
  const project = projects.find((item) => item.id === id) ?? projects[0];
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  useEffect(() => { const current = storedIds('handshake-started-projects'); if (!current.includes(project.id)) window.localStorage.setItem('handshake-started-projects', JSON.stringify([...current, project.id])); }, [project.id]);
  return <Workspace><main className="workspace-content flex-1"><button onClick={() => setLocation('/projects')} className="mb-5 flex items-center gap-1 text-[11px] text-[#666] hover:text-black"><ArrowLeft size={13} /> Back to projects</button><div className="max-w-[720px]"><p className="text-[10px] text-[#888]">{project.category}</p><h1 className="mt-1 text-[22px] font-bold tracking-[-.03em]">{project.name}</h1><p className="mt-3 text-[13px] leading-relaxed text-[#555]">{project.description}</p><div className="mt-6 rounded-xl border border-[#e4e4e4] p-5"><div className="flex items-center justify-between"><h2 className="text-[14px] font-semibold">Task workspace</h2><span className="text-[11px] text-[#777]">Step {step} of 3</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ededed]"><div className="h-full rounded-full bg-[#b8ef45] transition-all" style={{ width: `${(step / 3) * 100}%` }} /></div><p className="mt-6 text-[13px] leading-relaxed text-[#444]">{done ? 'This task is complete. Thanks for helping improve AI.' : step === 1 ? 'Review the project instructions and confirm you understand the quality bar.' : step === 2 ? 'Complete the sample task using the project guidance and submit your response.' : 'Review your response, then submit the task for approval.'}</p><div className="mt-6 flex justify-end gap-2">{step > 1 && !done && <button onClick={() => setStep((current) => current - 1)} className="tiny-btn">Previous</button>}{done ? <button onClick={() => setLocation('/ai-work-dashboard')} className="solid-btn">Back to dashboard</button> : <button onClick={() => step < 3 ? setStep((current) => current + 1) : setDone(true)} className="solid-btn">{step < 3 ? 'Continue' : 'Submit task'}</button>}</div></div></div></main></Workspace>;
}

function Router() {
  return <ErrorBoundary resetKey={window.location.pathname}><Switch><Route path="/" component={Assessment} /><Route path="/ai-work-dashboard" component={Dashboard} /><Route path="/projects" component={ProjectBrowser} /><Route path="/payments" component={PaymentsPage} /><Route path="/tasks/:id" component={TaskPage} />{Object.keys(pageContent).filter((pageKey) => pageKey !== 'payments').map((pageKey) => <Route key={pageKey} path={`/${pageKey}`} component={() => <ContentPage pageKey={pageKey} />} />)}<Route component={() => <ContentPage pageKey="explore" />} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;