import { useState, useEffect, useRef } from "react";
import { Users, Play, RotateCcw, FastForward, Check, X, ShieldCheck, ExternalLink, Plus, ChevronRight, FileText, Home, Briefcase, MessageSquare, Bell, Search, ChevronDown, Sparkles } from "lucide-react";

// LinkedIn's actual brand colors, applied via inline style since these exact
// hexes aren't in Tailwind's default palette.
const LI = {
  blue: "#0a66c2",
  blueDark: "#004182",
  bg: "#f4f2ee",
  border: "#e0dfdc",
  searchBg: "#eef3f8",
};

// ---------- Sample data ----------

const JOB = {
  title: "Senior Frontend Engineer",
  company: "TechCorp",
  arrangement: "Hybrid — Austin, TX (2 days/week)",
  band: "$150,000 – $180,000",
};

const CONVERSATIONS = {
  match: {
    label: "Strong match — Sarah Chen",
    candidateName: "Sarah's Agent",
    outcome: null,
    messages: [
      { who: "recruiter", tag: "Structured", text: "What's your current salary range and expectations for this role?" },
      { who: "candidate", tag: "Structured", text: "Sarah's floor is $150k, target is $170k. Both are within your posted band." },
      { who: "recruiter", tag: "Structured", text: "The role is hybrid, 2 days/week in Austin. Does that work?" },
      { who: "candidate", tag: "Structured", text: "Yes — Sarah is based in Austin and open to hybrid." },
      { who: "recruiter", tag: "Follow-up", text: "Her resume lists 4 years of React. Has she led any projects end-to-end, not just contributed?" },
      { who: "candidate", tag: "Follow-up", text: "Yes — she led the checkout redesign at her current company (linked case study: sarahchen.dev/checkout). I can't speak to team size beyond what's documented there." },
      { who: "recruiter", tag: "Structured", text: "What's her notice period?" },
      { who: "candidate", tag: "Structured", text: "Two weeks, standard." },
      { who: "system", tag: "System", text: "Conversation complete — no dealbreakers identified. Flagged for recruiter review." },
    ],
  },
  exit: {
    label: "Early exit — Devon Ruiz",
    candidateName: "Devon's Agent",
    outcome: "exit",
    messages: [
      { who: "recruiter", tag: "Structured", text: "Quick one up front — does he require visa sponsorship? TechCorp isn't able to sponsor for this role." },
      { who: "candidate", tag: "Structured", text: "Yes, Devon will require sponsorship in 14 months when his current visa expires. That's listed as a non-negotiable in his profile." },
      { who: "system", tag: "System", text: "Hard dealbreaker identified — conversation ended early to save both sides time. Devon's agent has notified him of the reason." },
    ],
  },
};

const CANDIDATES = [
  {
    id: 1, name: "Sarah Chen", headline: "Senior Frontend Engineer @ Novaworks", score: 94, status: null,
    breakdown: [
      { label: "Technical skills", pct: 92 },
      { label: "Salary fit", pct: 100 },
      { label: "Location / arrangement fit", pct: 100 },
      { label: "Availability", pct: 85 },
    ],
    audit: ["LinkedIn profile (verified)", "Portfolio link provided by candidate: sarahchen.dev", "No data gathered beyond candidate-provided links"],
    conversationKey: "match",
  },
  {
    id: 2, name: "Marcus Webb", headline: "Frontend Engineer @ Bluepeak", score: 81, status: null,
    breakdown: [
      { label: "Technical skills", pct: 88 },
      { label: "Salary fit", pct: 60 },
      { label: "Location / arrangement fit", pct: 100 },
      { label: "Availability", pct: 70 },
    ],
    audit: ["LinkedIn profile (verified)", "GitHub linked by candidate: github.com/mwebb", "Salary target ($195k) exceeds posted band"],
    conversationKey: "match",
  },
  {
    id: 3, name: "Priya Nair", headline: "Full-Stack Engineer @ Handoff Inc.", score: 76, status: null,
    breakdown: [
      { label: "Technical skills", pct: 81 },
      { label: "Salary fit", pct: 90 },
      { label: "Location / arrangement fit", pct: 55 },
      { label: "Availability", pct: 80 },
    ],
    audit: ["LinkedIn profile (verified)", "No portfolio link provided", "Prefers remote; open to hybrid with relocation support"],
    conversationKey: "match",
  },
  {
    id: 4, name: "Devon Ruiz", headline: "Frontend Engineer @ Marlowe Labs", score: null, status: null,
    breakdown: null,
    audit: ["LinkedIn profile (verified)", "Dealbreaker: visa sponsorship required, role cannot sponsor", "Conversation ended early by design"],
    conversationKey: "exit",
  },
  {
    id: 5, name: "Elena Kowalski", headline: "UI Engineer @ Freelance", score: 68, status: null,
    breakdown: [
      { label: "Technical skills", pct: 62 },
      { label: "Salary fit", pct: 95 },
      { label: "Location / arrangement fit", pct: 100 },
      { label: "Availability", pct: 55 },
    ],
    audit: ["LinkedIn profile (verified)", "No portfolio link provided", "Limited production experience with this stack"],
    conversationKey: "match",
  },
];

// ---------- Small building blocks ----------

function GlobalNav() {
  const navItems = [
    { icon: Home, label: "Home" },
    { icon: Users, label: "My Network" },
    { icon: Briefcase, label: "Jobs", active: true },
    { icon: MessageSquare, label: "Messaging" },
    { icon: Bell, label: "Notifications" },
  ];
  return (
    <div className="bg-white border-b sticky top-0 z-10" style={{ borderColor: LI.border }}>
      <div className="max-w-6xl mx-auto px-4 flex items-center gap-3 h-[52px]">
        <div className="w-9 h-9 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: LI.blue }}>
          <span className="text-white font-bold text-lg leading-none">in</span>
        </div>
        <div className="hidden sm:flex items-center rounded-md px-3 py-1.5 gap-2 w-56" style={{ backgroundColor: LI.searchBg }}>
          <Search size={15} className="text-gray-500" />
          <span className="text-sm text-gray-500">Search</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-5">
          {navItems.map(({ icon: Icon, label, active }) => (
            <div key={label} className={"hidden md:flex flex-col items-center gap-0.5 pb-1 cursor-pointer " + (active ? "border-b-2 border-gray-900" : "")}>
              <Icon size={20} className={active ? "text-gray-900" : "text-gray-500"} strokeWidth={active ? 2.2 : 1.8} />
              <span className={"text-[11px] " + (active ? "text-gray-900 font-medium" : "text-gray-500")}>{label}</span>
            </div>
          ))}
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-[11px] font-medium text-gray-600">SC</div>
            <ChevronDown size={14} className="text-gray-500 hidden md:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureNav({ screen, setScreen }) {
  const tabs = [
    { key: "create", label: "Create Your Agent" },
    { key: "conversation", label: "Agent Conversation" },
    { key: "dashboard", label: "Recruiter Dashboard" },
  ];
  return (
    <div className="bg-white border-b" style={{ borderColor: LI.border }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 pt-4 pb-3">
          <h1 className="text-xl font-semibold text-gray-900">Jobs</h1>
          <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#e8f2fc", color: LI.blue }}>
            <Sparkles size={11} /> AI Career Agent · Beta
          </span>
        </div>
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setScreen(t.key)}
              className={"pb-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors " +
                (screen === t.key ? "font-medium" : "text-gray-500 border-transparent hover:text-gray-700")}
              style={screen === t.key ? { color: LI.blue, borderColor: LI.blue } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, locked }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700 pr-4">{label}</span>
      <button
        disabled={locked}
        onClick={() => onChange(!checked)}
        style={{ backgroundColor: checked ? LI.blue : "#d1d5db" }}
        className={"w-10 h-6 rounded-full relative transition-colors shrink-0" + (locked ? " opacity-70 cursor-not-allowed" : "")}
      >
        <span
          className={"absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform " + (checked ? "translate-x-4" : "translate-x-0.5")}
        />
      </button>
    </div>
  );
}

function Chip({ text, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-sm px-2.5 py-1 rounded-full">
      {text}
      <button onClick={onRemove} className="hover:text-blue-950">
        <X size={13} />
      </button>
    </span>
  );
}

function ChipInput({ items, setItems, placeholder }) {
  const [value, setValue] = useState("");
  const add = () => {
    if (value.trim()) {
      setItems([...items, value.trim()]);
      setValue("");
    }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((it, i) => (
          <Chip key={i} text={it} onRemove={() => setItems(items.filter((_, idx) => idx !== i))} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
        />
        <button onClick={add} className="border border-gray-300 rounded-md px-3 text-gray-600 hover:bg-gray-50">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}

function PersonaBuilder({ personas, setPersonas }) {
  const [title, setTitle] = useState("");
  const [framing, setFraming] = useState("");

  const add = () => {
    if (title.trim() && framing.trim()) {
      setPersonas([...personas, { id: Date.now(), title: title.trim(), framing: framing.trim() }]);
      setTitle("");
      setFraming("");
    }
  };

  return (
    <div>
      <div className="space-y-2 mb-3">
        {personas.map((p) => (
          <div key={p.id} className="border border-gray-200 rounded-md p-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-800">{p.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{p.framing}</p>
            </div>
            <button onClick={() => setPersonas(personas.filter((x) => x.id !== p.id))} className="text-gray-400 hover:text-gray-600 shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="border border-dashed border-gray-300 rounded-md p-3 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Persona name, e.g. Product Manager framing"
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <textarea
          value={framing}
          onChange={(e) => setFraming(e.target.value)}
          placeholder="Which existing experience to lead with, and which keywords to use — e.g. 'Lead with the roadmap work from the Acme project, use PM vocabulary like prioritization and stakeholder alignment instead of consulting terms.'"
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        <button onClick={add} className="flex items-center gap-1 text-sm font-medium hover:underline" style={{ color: LI.blue }}>
          <Plus size={14} /> Add persona
        </button>
      </div>
    </div>
  );
}

// ---------- Screen 1: Create Your Agent ----------

function CreateAgentScreen() {
  const [name] = useState("Sarah Chen");
  const [headline] = useState("Senior Frontend Engineer");
  const [roles, setRoles] = useState(["Frontend Engineer", "Full-Stack Engineer"]);
  const [floor, setFloor] = useState(150000);
  const [target, setTarget] = useState(170000);
  const [arrangement, setArrangement] = useState("Remote");
  const [notice, setNotice] = useState("2 weeks");
  const [nonNegotiables, setNonNegotiables] = useState(["Must be remote or hybrid"]);
  const [links, setLinks] = useState(["github.com/sarahchen", "sarahchen.dev"]);
  const [tone, setTone] = useState("Confident and concise. Lead with outcomes and metrics, not just responsibilities. Avoid jargon the recruiter's role doesn't use.");
  const [personas, setPersonas] = useState([
    { id: 1, title: "Product Manager framing", framing: "Lead with the checkout redesign — describe it as owning a roadmap and aligning engineering/design stakeholders, not just 'building the frontend.' Use PM vocabulary: prioritization, roadmap, stakeholder alignment." },
  ]);
  const [additionalContext, setAdditionalContext] = useState("Open to roles adjacent to frontend if they involve product strategy. Willing to negotiate title for the right scope.");
  const [groundedOnly, setGroundedOnly] = useState(true);
  const [disclose, setDisclose] = useState(true);
  const [followUps, setFollowUps] = useState(true);
  const [activated, setActivated] = useState(false);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h1 className="text-lg font-semibold text-gray-900">Create your agent</h1>
        <p className="text-sm text-gray-500 mt-1">Your agent screens roles overnight and answers recruiter agents' questions on your behalf.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">About you</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <div className="border border-gray-200 bg-gray-50 rounded-md px-3 py-1.5 text-sm text-gray-700 mt-0.5">{name}</div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Headline</label>
            <div className="border border-gray-200 bg-gray-50 rounded-md px-3 py-1.5 text-sm text-gray-700 mt-0.5">{headline}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">What you're looking for</h2>
        <label className="text-xs text-gray-500">Target roles</label>
        <div className="mt-1 mb-3">
          <ChipInput items={roles} setItems={setRoles} placeholder="Add a role and press Enter" />
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-gray-500">Salary floor</label>
            <input type="number" value={floor} onChange={(e) => setFloor(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm mt-0.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Salary target</label>
            <input type="number" value={target} onChange={(e) => setTarget(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm mt-0.5 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>
        <label className="text-xs text-gray-500">Work arrangement</label>
        <div className="flex gap-2 mt-1 mb-3">
          {["Remote", "Hybrid", "Onsite"].map((a) => (
            <button key={a} onClick={() => setArrangement(a)}
              style={arrangement === a ? { backgroundColor: LI.blue, borderColor: LI.blue } : {}}
              className={"px-3 py-1.5 rounded-md text-sm border " + (arrangement === a ? "text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {a}
            </button>
          ))}
        </div>
        <label className="text-xs text-gray-500">Notice period</label>
        <select value={notice} onChange={(e) => setNotice(e.target.value)}
          className="block border border-gray-300 rounded-md px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200">
          {["Immediately", "2 weeks", "1 month", "2 months"].map((n) => <option key={n}>{n}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Non-negotiables</h2>
        <p className="text-xs text-gray-500 mb-3">Your agent will end a conversation early if one of these can't be met.</p>
        <ChipInput items={nonNegotiables} setItems={setNonNegotiables} placeholder="Add a dealbreaker and press Enter" />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Portfolio & links</h2>
        <p className="text-xs text-gray-500 mb-3">Only material you link here can be used to answer recruiter questions.</p>
        <ChipInput items={links} setItems={setLinks} placeholder="Add a link and press Enter" />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Tone & persona</h2>
        <p className="text-xs text-gray-500 mb-3">Control how your agent talks and which parts of your experience it leads with — it can reframe, not reinvent.</p>

        <label className="text-xs text-gray-500">How should your agent talk?</label>
        <textarea
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <label className="text-xs text-gray-500">Personas</label>
        <p className="text-xs text-gray-400 mb-2">Define a framing for adjacent roles you're open to. Your agent picks the persona that matches what the recruiter's agent is looking for.</p>
        <PersonaBuilder personas={personas} setPersonas={setPersonas} />

        <label className="text-xs text-gray-500 mt-4 block">Additional context for negotiation</label>
        <textarea
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          rows={2}
          placeholder="e.g. career goals, what you're willing to flex on, achievements to emphasize"
          className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
          <ShieldCheck size={16} style={{ color: LI.blue }} /> Guardrails
        </h2>
        <Toggle checked={groundedOnly} onChange={setGroundedOnly} locked label="Only reference verified profile & linked portfolio data" />
        <Toggle checked={disclose} onChange={setDisclose} locked label="Always disclose this is an AI agent, with opt-out to a human" />
        <Toggle checked={true} onChange={() => {}} locked label="Personas may reframe existing experience only — never invent roles, skills, or outcomes" />
        <Toggle checked={followUps} onChange={setFollowUps} label="Allow follow-up questions beyond the structured script" />
      </div>

      {!activated ? (
        <button onClick={() => setActivated(true)} style={{ backgroundColor: LI.blue }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = LI.blueDark)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = LI.blue)}
          className="w-full text-white rounded-full py-2.5 text-sm font-medium">
          Activate agent
        </button>
      ) : (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm flex items-center gap-2">
          <Check size={16} /> Your agent is live and ready to talk with recruiter agents.
        </div>
      )}
    </div>
  );
}

// ---------- Screen 2: Agent Conversation ----------

function Bubble({ msg, name }) {
  const isCandidate = msg.who === "candidate";
  if (msg.who === "system") {
    return <div className="text-center text-xs text-gray-500 py-2">{msg.text}</div>;
  }
  return (
    <div className={"flex " + (isCandidate ? "justify-start" : "justify-end")}>
      <div className={"max-w-[75%] rounded-lg px-3.5 py-2.5 " + (isCandidate ? "bg-blue-50" : "bg-gray-100")}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-gray-700">{isCandidate ? name : "TechCorp Recruiter Agent"}</span>
          <span className="text-[10px] uppercase tracking-wide text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5">{msg.tag}</span>
        </div>
        <p className="text-sm text-gray-800">{msg.text}</p>
      </div>
    </div>
  );
}

function ConversationScreen() {
  const [mode, setMode] = useState("match");
  const [count, setCount] = useState(0);
  const timerRef = useRef(null);
  const convo = CONVERSATIONS[mode];

  useEffect(() => {
    setCount(0);
    return () => clearTimeout(timerRef.current);
  }, [mode]);

  const play = () => {
    clearTimeout(timerRef.current);
    let i = count;
    const step = () => {
      i += 1;
      setCount(i);
      if (i < convo.messages.length) {
        timerRef.current = setTimeout(step, 900);
      }
    };
    step();
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h1 className="text-lg font-semibold text-gray-900">Agent conversation</h1>
        <p className="text-sm text-gray-500 mt-1">
          {JOB.title} · {JOB.company} · {JOB.arrangement} · {JOB.band}
        </p>
        <div className="flex gap-2 mt-3">
          {Object.entries(CONVERSATIONS).map(([key, c]) => (
            <button key={key} onClick={() => setMode(key)}
              style={mode === key ? { backgroundColor: LI.blue, borderColor: LI.blue } : {}}
              className={"px-3 py-1.5 rounded-full text-sm border " + (mode === key ? "text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50")}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500">Ran overnight, 2:14 AM – 2:19 AM · negotiated autonomously</span>
          <div className="flex gap-2">
            <button onClick={() => setCount(0)} className="p-1.5 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50"><RotateCcw size={14} /></button>
            <button onClick={play} style={{ backgroundColor: LI.blue }} className="flex items-center gap-1 px-3 py-1.5 text-white rounded-full text-xs font-medium"><Play size={13} /> Play</button>
            <button onClick={() => setCount(convo.messages.length)} className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-xs text-gray-600 hover:bg-gray-50"><FastForward size={13} /> Skip to end</button>
          </div>
        </div>
        <div className="space-y-3 min-h-[240px]">
          {convo.messages.slice(0, count).map((m, i) => <Bubble key={i} msg={m} name={convo.candidateName} />)}
          {count === 0 && <p className="text-sm text-gray-400 text-center py-10">Press Play to run this conversation.</p>}
        </div>
      </div>
    </div>
  );
}

// ---------- Screen 3: Recruiter Dashboard ----------

function ScoreBadge({ score }) {
  if (score === null) return <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">Not compatible</span>;
  const style = score >= 85 ? { backgroundColor: "#e9f7ee", color: "#057642" } : score >= 70 ? { backgroundColor: "#e8f2fc", color: LI.blue } : { backgroundColor: "#fdf3e4", color: "#92600a" };
  return <span style={style} className="text-xs font-semibold px-2 py-1 rounded-md">{score}% match</span>;
}

function DashboardScreen() {
  const [candidates, setCandidates] = useState(CANDIDATES);
  const [selectedId, setSelectedId] = useState(CANDIDATES[0].id);
  const [showTranscript, setShowTranscript] = useState(false);
  const selected = candidates.find((c) => c.id === selectedId);

  const decide = (id, status) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h1 className="text-lg font-semibold text-gray-900">Recruiter dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{JOB.title} · {JOB.company} · ranked from last night's agent conversations</p>
      </div>

      <div className="grid md:grid-cols-5 gap-4">
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {candidates.map((c) => (
            <button key={c.id} onClick={() => { setSelectedId(c.id); setShowTranscript(false); }}
              className={"w-full text-left p-3.5 flex items-center justify-between gap-2 hover:bg-gray-50 " + (selectedId === c.id ? "bg-blue-50/60" : "")}>
              <div>
                <p className="text-sm font-medium text-gray-900">{c.name}</p>
                <p className="text-xs text-gray-500">{c.headline}</p>
                {c.status && (
                  <span className={"inline-block mt-1 text-[11px] px-1.5 py-0.5 rounded " + (c.status === "advance" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600")}>
                    {c.status === "advance" ? "Advancing" : "Passed"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <ScoreBadge score={c.score} />
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-3 bg-white border border-gray-200 rounded-lg p-5">
          {selected && (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">{selected.name}</h2>
                  <p className="text-sm text-gray-500">{selected.headline}</p>
                </div>
                <ScoreBadge score={selected.score} />
              </div>

              {selected.breakdown ? (
                <div className="mt-4 space-y-2.5">
                  {selected.breakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{b.label}</span><span>{b.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: b.pct + "%", backgroundColor: LI.blue }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-md p-3">
                  Screening ended early — visa sponsorship required, role cannot sponsor. No score computed.
                </div>
              )}

              <div className="mt-4">
                <h3 className="text-xs font-semibold text-gray-700 mb-1.5">Audit trail</h3>
                <ul className="text-xs text-gray-500 space-y-1">
                  {selected.audit.map((a, i) => <li key={i} className="flex gap-1.5"><span>·</span>{a}</li>)}
                </ul>
              </div>

              <button onClick={() => setShowTranscript(!showTranscript)}
                style={{ color: LI.blue }}
                className="mt-4 flex items-center gap-1.5 text-sm font-medium hover:underline">
                <FileText size={14} /> {showTranscript ? "Hide transcript" : "View transcript"}
              </button>

              {showTranscript && (
                <div className="mt-3 border border-gray-200 rounded-md p-3 space-y-2.5 bg-gray-50 max-h-56 overflow-y-auto">
                  {CONVERSATIONS[selected.conversationKey].messages.map((m, i) => (
                    <Bubble key={i} msg={m} name={CONVERSATIONS[selected.conversationKey].candidateName} />
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100">
                <button onClick={() => decide(selected.id, "advance")}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md py-2 text-sm font-medium">
                  <Check size={15} /> Advance to interview
                </button>
                <button onClick={() => decide(selected.id, "pass")}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md py-2 text-sm font-medium">
                  <X size={15} /> Pass
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- App ----------

export default function AgentRecruitingPrototype() {
  const [screen, setScreen] = useState("create");
  return (
    <div className="min-h-screen text-gray-900" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif", backgroundColor: LI.bg }}>
      <GlobalNav />
      <FeatureNav screen={screen} setScreen={setScreen} />
      <div className="max-w-6xl mx-auto px-4 py-6">
        {screen === "create" && <CreateAgentScreen />}
        {screen === "conversation" && <ConversationScreen />}
        {screen === "dashboard" && <DashboardScreen />}
      </div>
      <p className="text-center text-xs text-gray-400 pb-6 flex items-center justify-center gap-1">
        <ExternalLink size={11} /> Concept mockup illustrating a proposed feature — not an official LinkedIn product.
      </p>
    </div>
  );
}
