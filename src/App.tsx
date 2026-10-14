
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Target,
  CalendarDays,
  Settings,
  Search,
  Bell,
  Plus,
  Menu,
  X,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  XCircle,
  Moon,
  Sun,
  Trash2,
  ExternalLink,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";

type Status =
  | "Applied"
  | "Interview"
  | "Offer"
  | "Rejected";

type Job = {
  id: number;
  company: string;
  role: string;
  location: string;
  date: string;
  status: Status;
  color: string;
  salary: string;
  link: string;
};

const initialJobs: Job[] = [
  {
    id: 1,
    company: "Google",
    role: "Frontend Developer",
    location: "Bengaluru · Hybrid",
    date: "2026-10-12",
    status: "Interview",
    color: "#4285f4",
    salary: "₹12–18 LPA",
    link: "https://careers.google.com/",
  },
  {
    id: 2,
    company: "Microsoft",
    role: "Software Engineer",
    location: "Hyderabad · Hybrid",
    date: "2026-10-11",
    status: "Applied",
    color: "#00a4ef",
    salary: "₹15–22 LPA",
    link: "https://careers.microsoft.com/",
  },
  {
    id: 3,
    company: "Infosys",
    role: "Java Developer",
    location: "Pune · On-site",
    date: "2026-10-09",
    status: "Applied",
    color: "#0063b1",
    salary: "₹4–7 LPA",
    link: "https://www.infosys.com/careers/",
  },
  {
    id: 4,
    company: "Amazon",
    role: "SDE Intern",
    location: "Remote · India",
    date: "2026-10-07",
    status: "Offer",
    color: "#ff9900",
    salary: "Internship",
    link: "https://www.amazon.jobs/",
  },
  {
    id: 5,
    company: "TCS",
    role: "Full Stack Developer",
    location: "Pune · Hybrid",
    date: "2026-10-05",
    status: "Rejected",
    color: "#6941c6",
    salary: "₹5–8 LPA",
    link: "https://www.tcs.com/careers",
  },
];

const chartData = [
  { day: "Mon", applications: 2 },
  { day: "Tue", applications: 5 },
  { day: "Wed", applications: 3 },
  { day: "Thu", applications: 8 },
  { day: "Fri", applications: 6 },
  { day: "Sat", applications: 10 },
  { day: "Sun", applications: 12 },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Goals", icon: Target },
  { label: "Calendar", icon: CalendarDays },
];

function loadJobs(): Job[] {
  try {
    const saved = localStorage.getItem("devtrack-jobs");
    return saved ? JSON.parse(saved) as Job[] : initialJobs;
  } catch {
    return initialJobs;
  }
}

function App() {
  const [jobs, setJobs] = useState<Job[]>(loadJobs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<Status>("Applied");
  const [salary, setSalary] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    localStorage.setItem("devtrack-jobs", JSON.stringify(jobs));
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        `${job.company} ${job.role} ${job.location}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || job.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, filter]);

  const applied = jobs.length;
  const interviews = jobs.filter(
    (job) => job.status === "Interview",
  ).length;
  const offers = jobs.filter(
    (job) => job.status === "Offer",
  ).length;
  const responseRate = applied
    ? Math.round(
        ((interviews + offers) / applied) * 100,
      )
    : 0;

  function addJob(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newJob: Job = {
      id: Date.now(),
      company: company.trim(),
      role: role.trim(),
      location: location.trim() || "Not specified",
      date: new Date().toISOString().slice(0, 10),
      status,
      color: "#7357e8",
      salary: salary.trim() || "Not specified",
      link: link.trim(),
    };

    setJobs((previous) => [newJob, ...previous]);
    setCompany("");
    setRole("");
    setLocation("");
    setSalary("");
    setLink("");
    setStatus("Applied");
    setShowForm(false);
    setNotice("Application added successfully!");
    window.setTimeout(() => setNotice(""), 3000);
  }

  function removeJob(id: number) {
    setJobs((previous) => previous.filter(
      (job) => job.id !== id,
    ));
  }

  function updateStatus(id: number, nextStatus: Status) {
    setJobs((previous) => previous.map((job) =>
      job.id === id
        ? { ...job, status: nextStatus }
        : job,
    ));
  }

  return (
    <div className={`app-shell ${dark ? "dark" : ""}`}>
      {menuOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark">
            <TrendingUp size={23} />
          </div>
          <span>DevTrack<span className="brand-accent">.</span></span>
          <button
            className="icon-button sidebar-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-link ${activeNav === label ? "active" : ""}`}
              onClick={() => {
                setActiveNav(label);
                setMenuOpen(false);
                if (label === "Applications") {
                  document.getElementById("applications")
                    ?.scrollIntoView({ behavior: "smooth" });
                } else if (label === "Overview") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  setNotice(`${label} section is coming soon.`);
                  window.setTimeout(() => setNotice(""), 2500);
                }
              }}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Applications" && (
                <span className="nav-count">{jobs.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <div className="upgrade-icon"><Target size={21} /></div>
            <h3>Your next opportunity awaits.</h3>
            <p>Keep showing up. Your dream role is closer than you think.</p>
            <button onClick={() => setShowForm(true)}>
              Track a job <ArrowUpRight size={15} />
            </button>
          </div>

          <button
            className="nav-link settings-link"
            onClick={() => {
              setNotice("Settings are coming soon.");
              window.setTimeout(() => setNotice(""), 2500);
            }}
          >
            <Settings size={19} />
            <span>Settings</span>
          </button>

          <div className="profile">
            <div className="avatar">DP</div>
            <div className="profile-copy">
              <strong>Dnyaneshwari Parbat</strong>
              <span>Job seeker · Student</span>
            </div>
            <button
              className="icon-button profile-menu"
              aria-label="Profile menu"
              onClick={() => {
                setNotice("Profile settings are coming soon.");
                window.setTimeout(() => setNotice(""), 2500);
              }}
            >
              ···
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{activeNav}</strong>
          </div>
          <div className="topbar-actions">
            <span className="today-label">
              <CalendarDays size={15} />
              {new Date().toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <button
              className="icon-button theme-button"
              aria-label="Toggle theme"
              onClick={() => setDark(!dark)}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              onClick={() => {
                setNotice(
                  interviews
                    ? `You have ${interviews} interview(s) to prepare for!`
                    : "You're all caught up. Keep applying!",
                );
                window.setTimeout(() => setNotice(""), 3000);
              }}
            >
              <Bell size={19} />
              <span />
            </button>
            <div className="avatar top-avatar">DP</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="live-dot" /> YOUR CAREER, IN FOCUS
              </div>
              <h1>Good evening, Dnyaneshwari <span>✦</span></h1>
              <p>Every application is a step closer to your next big thing.</p>
            </div>
            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} /> Add application
            </button>
          </section>

          {notice && (
            <div className="notice" role="status">
              <CheckCircle2 size={18} /> {notice}
              <button onClick={() => setNotice("")} aria-label="Dismiss">
                <X size={16} />
              </button>
            </div>
          )}

          <section className="stats-grid">
            <StatCard
              label="Total applications"
              value={String(applied)}
              detail="Jobs you're tracking"
              icon={<BriefcaseBusiness size={20} />}
              color="violet"
              trend="All time"
            />
            <StatCard
              label="Interviews"
              value={String(interviews)}
              detail="Conversations started"
              icon={<CalendarDays size={20} />}
              color="blue"
              trend="In progress"
            />
            <StatCard
              label="Offers received"
              value={String(offers)}
              detail="Potential opportunities"
              icon={<CheckCircle2 size={20} />}
              color="green"
              trend="Great progress"
            />
            <StatCard
              label="Response rate"
              value={`${responseRate}%`}
              detail="Interviews + offers"
              icon={<TrendingUp size={20} />}
              color="orange"
              trend="Your pipeline"
            />
          </section>

          <section className="insight-grid">
            <div className="panel chart-panel">
              <div className="panel-heading">
                <div>
                  <h2>Application activity</h2>
                  <p>Your weekly application momentum</p>
                </div>
                <span className="period-pill">This week</span>
              </div>
              <div className="chart-summary">
                <strong>{applied}</strong>
                <span>applications tracked</span>
                <span className="chart-trend">
                  <TrendingUp size={14} /> Stay consistent
                </span>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7657ef" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#7657ef" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 4"
                      vertical={false}
                      stroke="var(--grid-line)"
                    />
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "var(--muted)", fontSize: 12 }}
                      width={25}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        background: "var(--panel)",
                        color: "var(--text)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="applications"
                      stroke="#7657ef"
                      strokeWidth={2.5}
                      fill="url(#areaFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="panel goal-panel">
              <div className="panel-heading">
                <div>
                  <h2>Weekly goal</h2>
                  <p>Small steps. Big results.</p>
                </div>
                <div className="goal-icon"><Target size={21} /></div>
              </div>
              <div className="goal-number">
                <strong>{Math.min(applied, 10)}</strong>
                <span>/ 10 applications</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${Math.min(applied, 10) * 10}%` }}
                />
              </div>
              <p className="goal-caption">
                {applied >= 10
                  ? "Amazing! You've reached your target."
                  : `${10 - Math.min(applied, 10)} more to reach your weekly target.`}
              </p>
              <div className="goal-divider" />
              <div className="goal-tip">
                <div className="tip-icon"><Clock3 size={18} /></div>
                <div>
                  <strong>Today's reminder</strong>
                  <p>Tailor your resume to each role before applying.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="panel applications-panel" id="applications">
            <div className="applications-heading">
              <div>
                <h2>Recent applications</h2>
                <p>Keep every opportunity organized in one place.</p>
              </div>
              <button
                className="secondary-button"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} /> Add job
              </button>
            </div>

            <div className="table-toolbar">
              <div className="search-box">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search company or role..."
                  aria-label="Search applications"
                />
                {search && (
                  <button onClick={() => setSearch("")} aria-label="Clear search">
                    <X size={15} />
                  </button>
                )}
              </div>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                aria-label="Filter applications by status"
              >
                <option>All</option>
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>COMPANY & ROLE</th>
                    <th>DATE APPLIED</th>
                    <th>STATUS</th>
                    <th>PACKAGE</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div className="company-cell">
                          <div
                            className="company-logo"
                            style={{
                              backgroundColor: `${job.color}18`,
                              color: job.color,
                            }}
                          >
                            {job.company.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <strong>{job.company}</strong>
                            <span>{job.role}</span>
                            <small>{job.location}</small>
                          </div>
                        </div>
                      </td>
                      <td className="date-cell">
                        {new Date(`${job.date}T12:00:00`).toLocaleDateString(
                          "en-IN",
                          { day: "numeric", month: "short", year: "numeric" },
                        )}
                      </td>
                      <td>
                        <select
                          className={`status-select status-${job.status.toLowerCase()}`}
                          value={job.status}
                          onChange={(event) =>
                            updateStatus(job.id, event.target.value as Status)
                          }
                          aria-label={`Change status for ${job.company}`}
                        >
                          <option>Applied</option>
                          <option>Interview</option>
                          <option>Offer</option>
                          <option>Rejected</option>
                        </select>
                      </td>
                      <td className="salary-cell">{job.salary}</td>
                      <td>
                        <div className="action-cell">
                          {job.link && (
                            <a
                              className="row-action"
                              href={job.link}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Open ${job.company} careers`}
                              title="Open careers page"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                          <button
                            className="row-action delete-action"
                            onClick={() => removeJob(job.id)}
                            aria-label={`Delete ${job.company}`}
                            title="Delete application"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredJobs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-state">
                        <BriefcaseBusiness size={27} />
                        <strong>No applications found</strong>
                        <span>Try a different search or add a new application.</span>
                        <button
                          className="secondary-button"
                          onClick={() => {
                            setSearch("");
                            setFilter("All");
                            setShowForm(true);
                          }}
                        >
                          <Plus size={15} /> Add application
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <span>Showing <strong>{filteredJobs.length}</strong> of <strong>{jobs.length}</strong> applications</span>
              <span><span className="live-dot" /> Changes saved on this device</span>
            </div>
          </section>

          <footer className="page-footer">
            <span>© 2026 DevTrack Pro</span>
            <span>Built for the next chapter <span className="footer-heart">♥</span></span>
          </footer>
        </div>
      </main>

      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section className="job-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-heading">
              <div>
                <span className="modal-eyebrow">YOUR NEXT OPPORTUNITY</span>
                <h2 id="modal-title">Add an application</h2>
                <p>Keep track of every role you pursue.</p>
              </div>
              <button
                className="icon-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addJob}>
              <label>
                Company name *
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  placeholder="e.g. Microsoft"
                  required
                />
              </label>
              <label>
                Job title *
                <input
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </label>
              <label>
                Location
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="e.g. Pune · Hybrid"
                />
              </label>
              <div className="form-row">
                <label>
                  Application status
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value as Status)}
                  >
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Offer</option>
                    <option>Rejected</option>
                  </select>
                </label>
                <label>
                  Salary / package
                  <input
                    value={salary}
                    onChange={(event) => setSalary(event.target.value)}
                    placeholder="e.g. ₹8 LPA"
                  />
                </label>
              </div>
              <label>
                Careers page URL
                <input
                  type="url"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                  placeholder="https://careers.company.com"
                />
              </label>
              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Plus size={17} /> Save application
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  color: string;
  trend: string;
};

function StatCard({
  label,
  value,
  detail,
  icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${color}`}>{icon}</div>
        <span className="stat-trend"><ArrowUpRight size={14} /> {trend}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-detail">{detail}</div>
    </article>
  );
}

export default App;
