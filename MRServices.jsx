import { useState, useMemo } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const EMPLOYEES = [
  { id: 1,  name: "Ravi Kumar",   role: "technician", username: "ravi.kumar",   password: "ravi@123"   },
  { id: 2,  name: "Suresh Patel", role: "technician", username: "suresh.patel", password: "suresh@123" },
  { id: 3,  name: "Anil Sharma",  role: "technician", username: "anil.sharma",  password: "anil@123"   },
  { id: 4,  name: "Deepak Verma", role: "technician", username: "deepak.verma", password: "deepak@123" },
  { id: 5,  name: "Manoj Singh",  role: "technician", username: "manoj.singh",  password: "manoj@123"  },
  { id: 99, name: "Admin",        role: "admin",       username: "admin",        password: "admin@mrs"  },
];

const now = new Date();
const THIS_MONTH = now.getMonth();
const THIS_YEAR  = now.getFullYear();

function daysAgo(d) {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t.toISOString();
}

const INITIAL_CALLS = [
  { id: 1,  customer_name: "Ramesh Gupta",  address: "12 MG Road, Delhi",        work_type: "Installation", assigned_to: 1, status: "Completed",  created_at: daysAgo(2)  },
  { id: 2,  customer_name: "Priya Nair",    address: "45 Brigade Rd, Bangalore",  work_type: "Repair",       assigned_to: 2, status: "In Progress", created_at: daysAgo(1)  },
  { id: 3,  customer_name: "Sanjay Mehta",  address: "78 Park St, Kolkata",       work_type: "Installation", assigned_to: 1, status: "Pending",     created_at: daysAgo(0)  },
  { id: 4,  customer_name: "Kavya Reddy",   address: "23 Anna Salai, Chennai",    work_type: "Repair",       assigned_to: 3, status: "Completed",   created_at: daysAgo(5)  },
  { id: 5,  customer_name: "Vikram Joshi",  address: "90 FC Road, Pune",          work_type: "Installation", assigned_to: 4, status: "Pending",     created_at: daysAgo(3)  },
  { id: 6,  customer_name: "Anita Bose",    address: "11 Howrah, Kolkata",        work_type: "Repair",       assigned_to: 2, status: "Completed",   created_at: daysAgo(7)  },
  { id: 7,  customer_name: "Kiran Shah",    address: "55 SG Highway, Ahmedabad",  work_type: "Repair",       assigned_to: 5, status: "In Progress", created_at: daysAgo(1)  },
  { id: 8,  customer_name: "Pooja Iyer",    address: "33 Linking Rd, Mumbai",     work_type: "Installation", assigned_to: 3, status: "Pending",     created_at: daysAgo(0)  },
  { id: 9,  customer_name: "Nitin Rao",     address: "66 Jubilee Hills, Hyd",     work_type: "Repair",       assigned_to: 1, status: "Completed",   created_at: daysAgo(10) },
  { id: 10, customer_name: "Sunita Tiwari", address: "27 Civil Lines, Nagpur",    work_type: "Installation", assigned_to: 4, status: "Completed",   created_at: daysAgo(4)  },
];

// ─── Constants ───────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  Pending:       "bg-amber-100 text-amber-700 border border-amber-200",
  "In Progress": "bg-blue-100 text-blue-700 border border-blue-200",
  Completed:     "bg-emerald-100 text-emerald-700 border border-emerald-200",
};
const NEXT_STATUS = { Pending: "In Progress", "In Progress": "Completed", Completed: "Completed" };

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = {
  tv:       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  users:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  clock:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
  check:    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  list:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  plus:     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  logout:   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  arrow:    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  calendar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  eye:      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeOff:   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  warn:     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  user:     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  lock:     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

// ─── Shared: StatusBadge ──────────────────────────────────────────────────────
function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}

// ─── Shared: StatCard ─────────────────────────────────────────────────────────
function StatCard({ label, value, icon, accent }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-5 overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-10 ${accent}`} />
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${accent} bg-opacity-15`}>
        <span className={accent.replace("bg-", "text-")}>{icon}</span>
      </div>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5 font-medium">{label}</p>
    </div>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState("");
  const [shake, setShake]       = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const user = EMPLOYEES.find(
      emp => emp.username === username.trim().toLowerCase() && emp.password === password
    );
    if (user) {
      onLogin(user);
    } else {
      setError("Invalid User ID or Password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
      <div className={`w-full max-w-sm ${shake ? "animate-shake" : ""}`}>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500 bg-opacity-20 border border-blue-400 border-opacity-30 mb-4">
            <span className="text-blue-300">{Icon.tv}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">M R Services</h1>
          <p className="text-blue-300 text-sm mt-1">TV Service Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white bg-opacity-5 backdrop-blur border border-white border-opacity-10 rounded-2xl p-6 space-y-4">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest">Sign in to your account</p>

          {error && (
            <div className="flex items-center gap-2 bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30 text-red-300 rounded-xl px-4 py-2.5 text-sm">
              {Icon.warn} {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-blue-300 mb-1.5">User ID</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{Icon.user}</span>
                <input type="text" required autoComplete="username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }}
                  placeholder="e.g. ravi.kumar"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-blue-300 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{Icon.lock}</span>
                <input type={showPass ? "text" : "password"} required autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors">
                  {showPass ? Icon.eyeOff : Icon.eye}
                </button>
              </div>
            </div>

            <button type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900 flex items-center justify-center gap-2 mt-1">
              Sign In {Icon.arrow}
            </button>
          </form>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-2">Demo Credentials</p>
          <div className="space-y-1 text-xs font-mono">
            {EMPLOYEES.map(emp => (
              <div key={emp.id} className="flex justify-between">
                <span className="text-slate-300">{emp.username}</span>
                <span className="text-slate-500">{emp.password}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ calls, setCalls }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [form, setForm]           = useState({ customer_name: "", address: "", work_type: "Installation", assigned_to: "" });
  const [submitted, setSubmitted] = useState(false);

  const stats = useMemo(() => ({
    total:      calls.length,
    pending:    calls.filter(c => c.status === "Pending").length,
    inProgress: calls.filter(c => c.status === "In Progress").length,
    completed:  calls.filter(c => c.status === "Completed").length,
  }), [calls]);

  const performance = useMemo(() =>
    EMPLOYEES.filter(e => e.role !== "admin").map(emp => ({
      ...emp,
      done:  calls.filter(c => c.assigned_to === emp.id && c.status === "Completed").length,
      left:  calls.filter(c => c.assigned_to === emp.id && ["Pending", "In Progress"].includes(c.status)).length,
      total: calls.filter(c => c.assigned_to === emp.id).length,
    }))
  , [calls]);

  function handleAssign(e) {
    e.preventDefault();
    if (!form.customer_name || !form.address || !form.assigned_to) return;
    setCalls(prev => [{
      id: Date.now(), ...form,
      assigned_to: parseInt(form.assigned_to),
      status: "Pending",
      created_at: new Date().toISOString(),
    }, ...prev]);
    setForm({ customer_name: "", address: "", work_type: "Installation", assigned_to: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  const TABS = [
    { id: "overview",    label: "Overview",    icon: Icon.list  },
    { id: "performance", label: "Performance", icon: Icon.users },
    { id: "assign",      label: "Assign Job",  icon: Icon.plus  },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === t.id ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}>
            {t.icon}<span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Calls"  value={stats.total}      icon={Icon.tv}    accent="bg-blue-500"    />
            <StatCard label="Pending"      value={stats.pending}    icon={Icon.clock} accent="bg-amber-500"   />
            <StatCard label="In Progress"  value={stats.inProgress} icon={Icon.list}  accent="bg-indigo-500"  />
            <StatCard label="Completed"    value={stats.completed}  icon={Icon.check} accent="bg-emerald-500" />
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">All Service Calls</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-left text-xs uppercase tracking-wider">
                    <th className="px-6 py-3 font-semibold">Customer</th>
                    <th className="px-6 py-3 font-semibold hidden md:table-cell">Address</th>
                    <th className="px-6 py-3 font-semibold hidden sm:table-cell">Type</th>
                    <th className="px-6 py-3 font-semibold">Assigned</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {calls.map(c => {
                    const emp = EMPLOYEES.find(e => e.id === c.assigned_to);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-slate-800">{c.customer_name}</td>
                        <td className="px-6 py-3.5 text-slate-500 hidden md:table-cell max-w-[200px] truncate">{c.address}</td>
                        <td className="px-6 py-3.5 hidden sm:table-cell">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${c.work_type === "Installation" ? "bg-purple-50 text-purple-700" : "bg-cyan-50 text-cyan-700"}`}>
                            {c.work_type}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-600">{emp?.name ?? "—"}</td>
                        <td className="px-6 py-3.5"><StatusBadge status={c.status} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Performance ── */}
      {activeTab === "performance" && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fadeIn">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Employee Performance</h3>
            <p className="text-xs text-slate-400 mt-0.5">Task completion across all service calls</p>
          </div>
          <div className="divide-y divide-slate-50">
            {performance.map(emp => {
              const pct = emp.total > 0 ? Math.round((emp.done / emp.total) * 100) : 0;
              return (
                <div key={emp.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800 text-sm truncate">{emp.name}</span>
                      <span className="text-xs text-slate-400 ml-2">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-3 text-center flex-shrink-0">
                    <div>
                      <p className="text-lg font-bold text-emerald-600">{emp.done}</p>
                      <p className="text-xs text-slate-400">Done</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-amber-500">{emp.left}</p>
                      <p className="text-xs text-slate-400">Left</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Assign Job ── */}
      {activeTab === "assign" && (
        <div className="max-w-lg animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600">
              <h3 className="font-bold text-white">Assign New Job</h3>
              <p className="text-xs text-blue-200 mt-0.5">Fill details to dispatch a technician</p>
            </div>
            <form onSubmit={handleAssign} className="p-6 space-y-4">
              {submitted && (
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">
                  {Icon.check} Job assigned successfully!
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Customer Name</label>
                <input type="text" required value={form.customer_name}
                  onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                  placeholder="e.g. Ramesh Gupta"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Address</label>
                <textarea required rows={2} value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Full service address"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Work Type</label>
                  <select value={form.work_type} onChange={e => setForm(f => ({ ...f, work_type: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Installation</option>
                    <option>Repair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Assign To</label>
                  <select required value={form.assigned_to} onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Select employee</option>
                    {EMPLOYEES.filter(e => e.role !== "admin").map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2">
                {Icon.plus} Assign Job
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EMPLOYEE DASHBOARD ───────────────────────────────────────────────────────
function EmployeeDashboard({ employee, calls, setCalls }) {
  const myTasks = useMemo(() =>
    calls
      .filter(c => c.assigned_to === employee.id)
      .sort((a, b) => {
        const ord = { "In Progress": 0, Pending: 1, Completed: 2 };
        return ord[a.status] - ord[b.status];
      })
  , [calls, employee.id]);

  const monthlyDone = useMemo(() =>
    myTasks.filter(c => {
      const d = new Date(c.created_at);
      return c.status === "Completed" && d.getMonth() === THIS_MONTH && d.getFullYear() === THIS_YEAR;
    }).length
  , [myTasks]);

  function advance(id) {
    setCalls(prev => prev.map(c =>
      c.id === id && c.status !== "Completed" ? { ...c, status: NEXT_STATUS[c.status] } : c
    ));
  }

  const pending    = myTasks.filter(c => c.status === "Pending").length;
  const inProgress = myTasks.filter(c => c.status === "In Progress").length;
  const completed  = myTasks.filter(c => c.status === "Completed").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="My Total"    value={myTasks.length} icon={Icon.list}     accent="bg-blue-500"    />
        <StatCard label="Pending"     value={pending}        icon={Icon.clock}    accent="bg-amber-500"   />
        <StatCard label="In Progress" value={inProgress}     icon={Icon.tv}       accent="bg-indigo-500"  />
        <StatCard label="Completed"   value={completed}      icon={Icon.check}    accent="bg-emerald-500" />
      </div>

      {/* Monthly Record */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {Icon.calendar}
            <span className="text-sm font-semibold text-blue-200">Monthly Record</span>
          </div>
          <p className="text-4xl font-bold">{monthlyDone}</p>
          <p className="text-sm text-blue-200 mt-0.5">jobs completed this month</p>
        </div>
        <div className="opacity-20">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="white">
            <rect x="10" y="30" width="12" height="40" rx="2"/>
            <rect x="34" y="15" width="12" height="55" rx="2"/>
            <rect x="58" y="45" width="12" height="25" rx="2"/>
          </svg>
        </div>
      </div>

      {/* Task Cards */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3">My Tasks</h3>
        {myTasks.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <div className="mx-auto mb-3 opacity-30">{Icon.list}</div>
            <p className="text-sm">No tasks assigned yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTasks.map(task => (
              <div key={task.id}
                className={`bg-white rounded-2xl border shadow-sm p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-all ${
                  task.status === "Completed" ? "opacity-60 border-slate-100" : "border-slate-100"
                }`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-800">{task.customer_name}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${task.work_type === "Installation" ? "bg-purple-50 text-purple-700" : "bg-cyan-50 text-cyan-700"}`}>
                      {task.work_type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5 truncate">{task.address}</p>
                  <div className="mt-2"><StatusBadge status={task.status} /></div>
                </div>
                {task.status !== "Completed" ? (
                  <button onClick={() => advance(task.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      task.status === "Pending"
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}>
                    {task.status === "Pending" ? "Start" : "Complete"} {Icon.arrow}
                  </button>
                ) : (
                  <span className="flex-shrink-0 text-emerald-500">{Icon.check}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [calls, setCalls]             = useState(INITIAL_CALLS);

  if (!currentUser) {
    return (
      <>
        <LoginScreen onLogin={setCurrentUser} />
        <style>{`
          @keyframes shake {
            0%,100% { transform:translateX(0); }
            20%,60%  { transform:translateX(-8px); }
            40%,80%  { transform:translateX(8px); }
          }
          .animate-shake { animation: shake 0.5s ease-in-out; }
        `}</style>
      </>
    );
  }

  const isAdmin = currentUser.role === "admin";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              {Icon.tv}
            </div>
            <div>
              <h1 className="font-black text-slate-900 leading-none">M R Services</h1>
              <p className="text-xs text-slate-400">{isAdmin ? "Admin Dashboard" : "Employee Portal"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {currentUser.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-slate-700">{currentUser.name}</span>
            </div>
            <button onClick={() => setCurrentUser(null)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-red-500 transition-colors px-3 py-2 rounded-xl hover:bg-red-50">
              {Icon.logout}<span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {isAdmin
          ? <AdminDashboard calls={calls} setCalls={setCalls} />
          : <EmployeeDashboard employee={currentUser} calls={calls} setCalls={setCalls} />
        }
      </main>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
      `}</style>
    </div>
  );
}
