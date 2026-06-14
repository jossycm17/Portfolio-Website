import { useState, useEffect, useRef, useCallback } from "react";
import './App.css';
import emailjs from "emailjs-com";

const NAV_LINKS = ["Home", "About", "Experience", "Resume", "Contact"];

const SKILLS = [
  {
    cat: "Programming & Data",
    color: "from-cyan-500 to-blue-600",
    glow: "shadow-cyan-500/20",
    icon: "💻",
    items: ["Python", "C++", "MATLAB", "Pandas", "NumPy", "Matplotlib", "Machine Learning"],
  },
  {
    cat: "Engineering & Design",
    color: "from-blue-500 to-indigo-600",
    glow: "shadow-blue-500/20",
    icon: "⚙️",
    items: ["SolidWorks", "CATIA", "AutoCAD", "Proteus", "MATLAB Simulink"],
  },
  {
    cat: "Research & Development",
    color: "from-teal-500 to-cyan-600",
    glow: "shadow-teal-500/20",
    icon: "🔬",
    items: ["Prototype Development", "Technical Documentation", "Experimental Setup"],
  },
  {
    cat: "Core Engineering",
    color: "from-indigo-500 to-purple-600",
    glow: "shadow-indigo-500/20",
    icon: "🔧",
    items: ["Mechatronics", "Troubleshooting", "System Integration", "FEA Basics"],
  },
];

const EXPERIENCE = [
  {
    company: "Green Tech Africa",
    role: "Research & Development Assistant",
    period: "June 2023 – Present",
    color: "from-emerald-400 to-cyan-500",
    dot: "bg-emerald-400",
    items: ["Prototype development", "Data analysis", "Research documentation", "Technical troubleshooting"],
  },
  {
    company: "Brand Engineering",
    role: "Electromechanical Designer",
    period: "Feb 2023 – May 2023",
    color: "from-blue-400 to-cyan-500",
    dot: "bg-blue-400",
    items: ["HVAC systems", "Electrical power distribution", "CAD technical drawings", "Cost estimation"],
  },
  {
    company: "MOHA Softdrinks Industry",
    role: "Electromechanical Engineering Intern",
    period: "June 2021 – Sep 2021",
    color: "from-cyan-400 to-teal-500",
    dot: "bg-cyan-400",
    items: ["Machine control and maintenance"],
  },
];

const PROJECTS = [
  { title: "Object Tracking Robot", sub: "Raspberry Pi", desc: "Real-time object detection and autonomous tracking using computer vision and embedded systems.", tags: ["Python", "OpenCV", "RPi"], icon: "🤖"},
  { title: "House Price Prediction", sub: "ML Model", desc: "Regression-based ML model predicting real estate prices with feature engineering and cross-validation.", tags: ["Python", "Sklearn", "Pandas"], icon: "🏠", github: "https://github.com/JK1716/PRODIGY_ML_01" },
  { title: "Customer Segmentation", sub: "K-Means Clustering", desc: "Unsupervised clustering of retail customers to identify behavioral patterns and business insights.", tags: ["Python", "K-Means", "Seaborn"], icon: "📊", github: "https://github.com/JK1716/PRODIGY_ML_02" },
  { title: "Hand Gesture Recognition", sub: "Computer Vision", desc: "MediaPipe-based hand tracking system recognizing 10+ gestures for HCI applications.", tags: ["Python", "MediaPipe", "TensorFlow"], icon: "✋", github: "https://github.com/JK1716/PRODIGY_ML_04" },
  { title: "Cat vs Dog Classifier", sub: "Deep Learning", desc: "CNN-based image classifier achieving high accuracy using transfer learning and data augmentation.", tags: ["Python", "CNN", "Keras"], icon: "🐾", github: "https://github.com/JK1716/PRODIGY_ML_03" },
  { title: "Food Item Recognition", sub: "Computer Vision", desc: "Develop a model that can accurately recognize food items from images and estimate their calorie content, enabling users to track their dietary intake and make informed food choices.", tags: ["Python", "OpenCV", "TensorFlow"], icon: "🍽️", github: "https://github.com/JK1716/PRODIGY_ML_05" },
];

const CERTS = [
  { title: "Machine Learning Specialization", org: "DeepLearning.AI", icon: "🎓", color: "from-orange-500 to-red-500" },
  { title: "Python Programming Certificate", org: "MITx", icon: "🐍", color: "from-blue-500 to-indigo-500" },
  { title: "Machine Learning Internship", org: "Prodigy InfoTech", icon: "💡", color: "from-green-500 to-teal-500" },
  { title: "Academic Excellence Recognition", org: "Hawassa University", icon: "🏆", color: "from-yellow-500 to-orange-500" },
  { title: "Semester Project Completion", org: "Hawassa University", icon: "📋", color: "from-purple-500 to-pink-500" },
];

const VOLUNTEER = [
  { role: "Electromechanical Club Coordinator", icon: "⚡" },
  { role: "Niber Foundation Member", icon: "🌍" },
];



// Replace handleSubmit with:
const handleSubmit = async () => {
  if (formData.name && formData.email && formData.message) {
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
  }
};

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();
  const transforms = { up: "translateY(32px)", down: "translateY(-32px)", left: "translateX(-32px)", right: "translateX(32px)", none: "none" };
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "none" : transforms[direction],
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let anim;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(34,211,238,0.5)";
        ctx.fill();
      });
      pts.forEach((a, i) => pts.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(34,211,238,${0.15 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      anim = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(anim); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

function TypingText({ words }) {
  const [idx, setIdx] = useState(0);
  const [char, setChar] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!del) {
        if (char < words[idx].length) setChar(c => c + 1);
        else setTimeout(() => setDel(true), 1500);
      } else {
        if (char > 0) setChar(c => c - 1);
        else { setDel(false); setIdx(i => (i + 1) % words.length); }
      }
    }, del ? 40 : 80);
    return () => clearTimeout(t);
  }, [char, del, idx, words]);
  return (
    <span className="text-cyan-400 font-semibold">
      {words[idx].slice(0, char)}
      <span className="animate-pulse">|</span>
    </span>
  );
}

function ScrollProgress() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.documentElement;
      setProg((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100);
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 z-50 transition-all" style={{ width: `${prog}%` }} />;
}

function BackToTop() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const fn = () => setVis(window.scrollY > 400);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return vis ? (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/40 transition-all backdrop-blur-sm">
      ↑
    </button>
  ) : null;
}

function LoadingScreen({ done }) {
  return (
    <div className={`fixed inset-0 z-[100] bg-gray-950 flex flex-col items-center justify-center transition-opacity duration-700 ${done ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-transparent animate-spin" />
        <div className="absolute inset-4 rounded-full bg-cyan-500/10 flex items-center justify-center text-2xl">⚡</div>
      </div>
      <p className="text-cyan-400 text-sm tracking-widest uppercase font-mono animate-pulse">Initializing Portfolio</p>
    </div>
  );
}

function StatCard({ value, label, delay }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const dur = 1500;
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setCount(Math.round(p * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    setTimeout(() => requestAnimationFrame(tick), delay * 1000);
  }, [inView, value, delay]);
  return (
    <div ref={ref} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
      <div className="text-4xl font-bold text-cyan-400 font-mono">{count}+</div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  );
}

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [dark, setDark] = useState(true);
  const [nav, setNav] = useState(false);
  const [active, setActive] = useState("Home");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 2000); }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNav(false);
    setActive(id);
  };

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    NAV_LINKS.forEach(l => { const el = document.getElementById(l); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [loaded]);

  const handleSubmit = () => {
    if (formData.name && formData.email && formData.message) {
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  const bg = dark ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900";
  const navBg = dark ? "bg-gray-950/80 border-white/10" : "bg-white/80 border-gray-200";
  const cardBg = dark ? "bg-white/5 border-white/10 hover:border-cyan-500/40" : "bg-white border-gray-200 hover:border-cyan-400";
  const inputBg = dark ? "bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-cyan-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500";

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300 font-sans`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Space Grotesk', sans-serif; scroll-behavior: smooth; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .glass { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
        .glow-cyan { box-shadow: 0 0 30px rgba(34,211,238,0.15); }
        .glow-blue { box-shadow: 0 0 30px rgba(59,130,246,0.15); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.3); border-radius: 2px; }
      `}</style>

      <LoadingScreen done={loaded} />
      <ScrollProgress />
      <BackToTop />
      {dark && <Particles />}

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-40 border-b glass transition-all ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <span className="mono text-cyan-400 font-semibold text-sm tracking-wider">ENG.AI</span>
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l)}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${active === l ? "bg-cyan-500/15 text-cyan-400" : dark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDark(d => !d)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${dark ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"}`}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setNav(n => !n)} className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5">
              {[0,1,2].map(i => <span key={i} className={`block h-0.5 bg-current transition-all ${nav && i===1 ? "opacity-0" : nav && i===0 ? "rotate-45 translate-y-2" : nav && i===2 ? "-rotate-45 -translate-y-2" : "w-5"}`} style={{width: i===1&&!nav?"14px":"20px"}} />)}
            </button>
          </div>
        </div>
        {nav && (
          <div className={`md:hidden border-t glass ${dark ? "bg-gray-950/95 border-white/10" : "bg-white/95 border-gray-200"}`}>
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l)} className={`block w-full text-left px-6 py-3 text-sm border-b transition-all ${dark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"} ${active===l?"text-cyan-400":""}`}>{l}</button>
            ))}
          </div>
        )}
      </nav>

      {/* HOME */}
      <section id="Home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay:"1s"}} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/3 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs mono mb-8" style={{opacity:loaded?1:0,transition:"opacity 0.8s ease 0.5s"}}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
            Available for Opportunities
          </div>
          <div style={{opacity:loaded?1:0,transform:loaded?"none":"translateY(20px)",transition:"all 0.8s ease 0.7s"}}>
            <h1 className="text-5xl sm:text-7xl font-bold mb-4 leading-tight">
              <span className={dark?"text-white":"text-gray-900"}>Engineer.</span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Analyst.</span>{" "}
              <span className={dark?"text-white":"text-gray-900"}>Builder.</span>
            </h1>
          </div>
          <div style={{opacity:loaded?1:0,transition:"opacity 0.8s ease 1s"}} className="text-lg sm:text-xl mb-3 min-h-[2rem]">
            <TypingText words={["Electromechanical Engineer", "Data Analyst", "Machine Learning Engineer", "Researcher & Developer"]} />
          </div>
          <p style={{opacity:loaded?1:0,transition:"opacity 0.8s ease 1.2s"}} className={`flex items-center justify-center gap-2 text-sm mb-10 ${dark?"text-gray-400":"text-gray-500"}`}>
            <span>📍</span> Addis Ababa, Ethiopia
          </p>
          <div style={{opacity:loaded?1:0,transition:"opacity 0.8s ease 1.4s"}} className="flex flex-wrap items-center justify-center gap-4">
            <button onClick={() => scrollTo("Resume")} className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 active:scale-95 transition-all glow-cyan">
              View Resume
            </button>
            <button onClick={() => scrollTo("Contact")} className={`px-8 py-3 rounded-xl border font-medium transition-all active:scale-95 ${dark?"border-white/20 text-white hover:bg-white/10":"border-gray-300 text-gray-700 hover:bg-gray-100"}`}>
              Contact Me
            </button>
          </div>
          <div style={{opacity:loaded?1:0,transition:"opacity 0.8s ease 2s"}} className="absolute bottom-10 left-1/2 -translate-x-1/2">
            <div className="w-5 h-9 rounded-full border border-current opacity-30 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2.5 rounded-full bg-current animate-bounce opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* HERO IMAGE */}
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn delay={0.2}>
            <div className="relative inline-block group">

              {/* Border */}
              <div className="relative rounded-[30px] p-[2px] overflow-hidden">

                {/* Moving light line */}
                <div className="absolute inset-0 rounded-[30px]">
                  <div className="absolute w-20 h-10 bg-cyan-400 blur-[2px] animate-borderMove"></div>
                </div>

                {/* Image */}
                <img
                  src="/src/assets/Hero.jpg"
                  alt="Hero"
                  className="relative w-64 h-64 md:w-60 md:h-100 object-cover rounded-[28px] border border-cyan-500/30 shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />
              </div>

            </div>
          </FadeIn>
        </div>
      </section> 

      <div style={{opacity:loaded?1:0,transform:loaded?"none":"translateY(20px)",transition:"all 0.8s ease 0.7s"}}>
            <h1 className="text-5xl sm:text-7xl font-bold mb-4 leading-tight text-center ">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Kalkidan</span>{" "}
              <span className={dark?"text-white":"text-gray-900"}>Tsegaye</span>
            </h1>
          </div>

      {/* ABOUT */}
      <section id="About" className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn><h2 className="text-center text-3xl sm:text-4xl font-bold mb-4">About <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Me</span></h2></FadeIn>
          <FadeIn delay={0.1}><p className={`text-center max-w-xl mx-auto mb-16 ${dark?"text-gray-400":"text-gray-500"}`}>Passionate engineer bridging mechanical systems, data science, and intelligent automation.</p></FadeIn>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <FadeIn direction="left" delay={0.1}>
              <div className={`p-8 rounded-2xl border glass ${cardBg} h-full`}>
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold mb-1">Education</h3>
                <p className="text-cyan-400 font-medium">Hawassa University</p>
                <p className={`${dark?"text-gray-300":"text-gray-700"} font-medium mt-2`}>BSc in Electromechanical Engineering</p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <span className="text-cyan-400 font-bold mono">CGPA: 3.55</span>
                  <span className={`text-xs ${dark?"text-gray-400":"text-gray-500"}`}>/ 4.0</span>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <div className={`p-8 rounded-2xl border glass ${cardBg} h-full`}>
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-3">Core Strengths</h3>
                <div className="flex flex-wrap gap-2">
                  {["Mechanical Design", "Machine Learning", "Automation", "R&D", "Data Analysis", "Embedded Systems"].map(s => (
                    <span key={s} className="px-3 py-1 rounded-lg text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400">{s}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.1}><h3 className={`text-center text-xl font-semibold mb-8 ${dark?"text-gray-300":"text-gray-700"}`}>Skills & Technologies</h3></FadeIn>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKILLS.map((s, i) => (
              <FadeIn key={s.cat} delay={i * 0.1} direction="up">
                <div className={`p-5 rounded-2xl border glass ${cardBg} group cursor-default transition-all duration-300 hover:-translate-y-1 h-full`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg mb-3 group-hover:scale-110 transition-transform`}>{s.icon}</div>
                  <h4 className="font-semibold text-sm mb-3">{s.cat}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map(item => (
                      <span key={item} className={`text-xs px-2 py-0.5 rounded-md ${dark?"bg-white/5 text-gray-300":"bg-gray-100 text-gray-600"}`}>{item}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="Experience" className={`relative z-10 py-24 px-4 sm:px-6 ${dark?"bg-white/[0.02]":"bg-gray-100/50"}`}>
        <div className="max-w-4xl mx-auto">
          <FadeIn><h2 className="text-center text-3xl sm:text-4xl font-bold mb-4">Work <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Experience</span></h2></FadeIn>
          <FadeIn delay={0.1}><p className={`text-center max-w-xl mx-auto mb-16 ${dark?"text-gray-400":"text-gray-500"}`}>A track record of applied engineering, research, and technical leadership.</p></FadeIn>

          <div className="relative">
            <div className={`absolute left-6 top-0 bottom-0 w-px ${dark?"bg-white/10":"bg-gray-200"}`} />
            <div className="space-y-8">
              {EXPERIENCE.map((e, i) => (
                <FadeIn key={e.company} delay={i * 0.15} direction="left">
                  <div className="relative pl-16">
                    <div className={`absolute left-4 top-6 w-4 h-4 rounded-full ${e.dot} border-4 ${dark?"border-gray-950":"border-gray-100"} -translate-x-1/2 shadow-lg`} />
                    <div className={`p-6 rounded-2xl border glass ${cardBg} hover:-translate-y-1 transition-all duration-300`}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="font-bold text-lg">{e.company}</h3>
                          <p className={`text-sm bg-gradient-to-r ${e.color} bg-clip-text text-transparent font-medium`}>{e.role}</p>
                        </div>
                        <span className={`text-xs px-3 py-1.5 rounded-full mono ${dark?"bg-white/5 text-gray-400":"bg-gray-100 text-gray-500"}`}>{e.period}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {e.items.map(it => (
                          <li key={it} className={`flex items-center gap-2 text-sm ${dark?"text-gray-300":"text-gray-600"}`}>
                            <span className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0" />{it}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Projects */}
          
          <div className="mt-20">
            <FadeIn><h3 className="text-2xl font-bold text-center mb-10">Featured <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Projects</span></h3></FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PROJECTS.map((p, i) => (
                <FadeIn key={p.title} delay={i * 0.08}>
                  <div className={`p-5 rounded-2xl border glass ${cardBg} group hover:-translate-y-2 transition-all duration-300 h-full flex flex-col`}>
                    <div className="text-3xl mb-3">{p.icon}</div>
                    <h4 className="font-bold mb-0.5">{p.title}</h4>
                    <p className="text-cyan-400 text-xs font-medium mb-2">{p.sub}</p>
                    <p className={`text-sm flex-1 mb-4 ${dark?"text-gray-400":"text-gray-500"}`}>{p.desc}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{t}</span>)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(p.github, "_blank")}
                        className={`flex-1 text-xs py-2 rounded-lg border transition-all ${
                          dark
                            ? "border-white/10 hover:bg-white/5"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        GitHub
                      </button>

                      <button
                        onClick={() => window.open(p.demo, "_blank")}
                        className="flex-1 text-xs py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all"
                      >
                        Demo
                      </button>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Certs */}
          <div className="mt-20">
            <FadeIn><h3 className="text-2xl font-bold text-center mb-10">Awards & <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Certifications</span></h3></FadeIn>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CERTS.map((c, i) => (
                <FadeIn key={c.title} delay={i * 0.08}>
                  <div className={`p-5 rounded-2xl border glass ${cardBg} flex items-center gap-4 hover:-translate-y-1 transition-all`}>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-xl flex-shrink-0`}>{c.icon}</div>
                    <div>
                      <p className="font-semibold text-sm">{c.title}</p>
                      <p className={`text-xs ${dark?"text-gray-400":"text-gray-500"}`}>{c.org}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Volunteer */}
          <div className="mt-16">
            <FadeIn><h3 className="text-2xl font-bold text-center mb-8">Volunteer <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Work</span></h3></FadeIn>
            <div className="flex flex-wrap justify-center gap-4">
              {VOLUNTEER.map((v, i) => (
                <FadeIn key={v.role} delay={i * 0.1}>
                  <div className={`px-6 py-4 rounded-2xl border glass ${cardBg} flex items-center gap-3`}>
                    <span className="text-2xl">{v.icon}</span>
                    <span className="font-medium text-sm">{v.role}</span>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RESUME */}
      <section id="Resume" className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn><h2 className="text-center text-3xl sm:text-4xl font-bold mb-4">My <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Resume</span></h2></FadeIn>
          <FadeIn delay={0.1}><p className={`text-center max-w-xl mx-auto mb-16 ${dark?"text-gray-400":"text-gray-500"}`}>A summary of my education, skills, and professional journey.</p></FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            {[{value:2,label:"Years Experience"},{value:5,label:"Projects Completed"},{value:5,label:"Certifications"},{value:3,label:"Companies"}].map((s,i)=>(
              <StatCard key={s.label} value={s.value} label={s.label} delay={i*0.15} />
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div className={`rounded-2xl border glass ${dark?"bg-white/5 border-white/10":"bg-white border-gray-200"} overflow-hidden mb-8`}>
              <div className={`px-6 py-4 border-b ${dark?"border-white/10":"border-gray-100"} flex items-center justify-between`}>
                <span className={`text-sm font-medium ${dark?"text-gray-300":"text-gray-700"}`}>Resume Preview</span>
                <span className={`text-xs mono px-2 py-1 rounded ${dark?"bg-white/5 text-gray-500":"bg-gray-100 text-gray-400"}`}>PDF</span>
              </div>
              <div className={`p-8 min-h-64 ${dark?"text-gray-300":"text-gray-700"}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold">Electromechanical Engineer</h3>
                  <p className="text-cyan-400">Data Analyst · ML Engineer</p>
                  <p className={`text-sm mt-1 ${dark?"text-gray-400":"text-gray-500"}`}>📍 Addis Ababa, Ethiopia</p>
                </div>
                <div className={`border-t ${dark?"border-white/10":"border-gray-200"} pt-6 grid md:grid-cols-2 gap-6`}>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-cyan-400 mb-3 mono">Education</h4>
                    <p className="font-semibold">BSc Electromechanical Engineering</p>
                    <p className={`text-sm ${dark?"text-gray-400":"text-gray-500"}`}>Hawassa University · CGPA 3.55/4.0</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-cyan-400 mb-3 mono">Current Role</h4>
                    <p className="font-semibold">Sales Manager</p>
                    <p className={`text-sm ${dark?"text-gray-400":"text-gray-500"}`}>Green Tech Africa · June 2023 – Present</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

        <FadeIn delay={0.3} className="text-center">
          <button
            onClick={async () => {
              const response = await fetch("/Resume.pdf");
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "Resume.pdf";
              link.click();
              URL.revokeObjectURL(url);
            }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 active:scale-95 transition-all glow-cyan">
            <span>⬇</span> Download Resume
          </button>

          </FadeIn>
          
          </div>
      </section>

      {/* CONTACT */}
      <section id="Contact" className={`relative z-10 py-24 px-4 sm:px-6 ${dark?"bg-white/[0.02]":"bg-gray-100/50"}`}>
        <div className="max-w-5xl mx-auto">
          <FadeIn><h2 className="text-center text-3xl sm:text-4xl font-bold mb-4">Get In <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Touch</span></h2></FadeIn>
          <FadeIn delay={0.1}><p className={`text-center max-w-xl mx-auto mb-16 ${dark?"text-gray-400":"text-gray-500"}`}>Open to research collaborations, engineering roles, and ML projects.</p></FadeIn>

          <div className="grid md:grid-cols-2 gap-10">
            <FadeIn direction="left" delay={0.1}>
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Let's Connect</h3>
                {[
                  { icon: "✉️", label: "Email", val: "kalkidantsegaye171@gmail.com" },
                  { icon: "📍", label: "Location", val: "Addis Ababa, Ethiopia" },
                  { icon: "💼", label: "LinkedIn", val: "in/kalkidan-tsegaye" },
                  { icon: "🐙", label: "GitHub", val: "github.com/JK1716" },
                ].map(c => (
                  <div key={c.label} className={`flex items-center gap-4 p-4 rounded-xl border glass ${cardBg} group hover:-translate-x-1 transition-all`}>
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <p className={`text-xs ${dark?"text-gray-500":"text-gray-400"}`}>{c.label}</p>
                      <p className="font-medium text-sm text-cyan-400">{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2}>
              <div className={`p-8 rounded-2xl border glass ${cardBg}`}>
                {sent ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
                    <div className="text-5xl animate-bounce">✅</div>
                    <p className="text-cyan-400 font-medium">Message sent successfully!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className={`text-xs mb-1.5 block ${dark?"text-gray-400":"text-gray-500"}`}>Your Name</label>
                      <input value={formData.name} onChange={e=>setFormData(f=>({...f,name:e.target.value}))}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${inputBg}`} />
                    </div>
                    <div>
                      <label className={`text-xs mb-1.5 block ${dark?"text-gray-400":"text-gray-500"}`}>Email Address</label>
                      <input value={formData.email} onChange={e=>setFormData(f=>({...f,email:e.target.value}))}
                        type="email" placeholder="john@example.com"
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${inputBg}`} />
                    </div>
                    <div>
                      <label className={`text-xs mb-1.5 block ${dark?"text-gray-400":"text-gray-500"}`}>Message</label>
                      <textarea value={formData.message} onChange={e=>setFormData(f=>({...f,message:e.target.value}))}
                        placeholder="Tell me about your project or opportunity..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm resize-none ${inputBg}`} />
                    </div>
                    <button onClick={handleSubmit}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90 active:scale-95 transition-all glow-cyan flex items-center justify-center gap-2">
                      Send Message <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`relative z-10 py-8 px-4 border-t ${dark?"border-white/10":"border-gray-200"}`}>
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${dark?"text-gray-500":"text-gray-400"}`}>Designed & Developed with React.js ⚡</p>
            <div className="flex items-center gap-4">
              {[
                { label: "LinkedIn", url: "https://www.linkedin.com/in/kalkidan-tsegaye" },
                { label: "GitHub", url: "https://github.com/JK1716" },
                { label: "Email", url: "mailto:kalkidantsegaye171@gmail.com" },
              ].map(s => (
                 <a
                  key={s.label}
                  href={s.url}
                  target={s.label !== "Email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all ${dark ? "text-gray-500 hover:text-cyan-400" : "text-gray-400 hover:text-cyan-500"}`}>
                  {s.label}
                </a>
              ))}
            </div>
            <p className={`text-xs mono ${dark?"text-gray-600":"text-gray-400"}`}>© 2026 · Addis Ababa, Ethiopia</p>
          </div>
        </footer>


    </div>
  );
}
