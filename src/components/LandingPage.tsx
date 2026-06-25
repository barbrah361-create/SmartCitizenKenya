import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bike, CreditCard, FileCheck, Baby, Briefcase, ShieldAlert, Compass, Search, ArrowRight, ShieldCheck, Zap, Users, Activity, MessageSquare, BookOpen, MapPin, Mail, Phone, Calendar, Star, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "motion/react";
import KenyaLogo from "./KenyaLogo";

interface LandingPageProps {
  services: any[];
}

export default function LandingPage({ services }: LandingPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<any[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/articles")
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((e) => console.error("Failed to load articles", e));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/auth?search=${encodeURIComponent(searchQuery)}`);
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSuccess(true);
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const stats = [
    { label: "Registered Citizens", value: "2.4M+", icon: Users, color: "text-emerald-700" },
    { label: "Successful Applications", value: "4.8M+", icon: ShieldCheck, color: "text-blue-600" },
    { label: "Avg. Turnaround Time", value: "48 Hours", icon: Zap, color: "text-amber-500" },
    { label: "Daily Transactions", value: "35,000+", icon: Activity, color: "text-red-600" }
  ];

  const successStories = [
    {
      name: "Mercy Wambui",
      role: "Boda Boda Operator, Nairobi",
      quote: "Getting my motorcycle registration certificate took me only 3 days on this portal! No long queues, no middlemen. It is a real lifesaver.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      rating: 5
    },
    {
      name: "Josphat Kiprop",
      role: "Founder, Rift Tech Solutions",
      quote: "I renewed our county business permits instantly. The unified billing meant we paid once, got approved, and printed our seal in 48 hours.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      rating: 5
    }
  ];

  const benefits = [
    {
      title: "Zero Bureaucracy",
      description: "Direct digital uploads and electronic queue allocations bypass traditional administrative bottlenecks.",
      icon: Zap,
      color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400"
    },
    {
      title: "Cryptographic Seals",
      description: "Every issued license features a unique tracking ID and verified QR code for authentic legal validation.",
      icon: ShieldCheck,
      color: "bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-400"
    },
    {
      title: "Unified Billing",
      description: "Complete secure M-Pesa or card simulated fee disbursements seamlessly on a single agency dashboard.",
      icon: Briefcase,
      color: "bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400"
    }
  ];

  const faqs = [
    {
      q: "What is the processing cost for a National ID Card?",
      a: "First-time applications for a National ID Card are entirely free. Replacement for lost, stolen, or damaged ID cards incurs a standard regulatory fee of Ksh 1,000, which is securely disbursed online during submission."
    },
    {
      q: "How can third parties verify my issued digital certificates?",
      a: "All approved certificates come with a secure QR code and a unique reference number. Authorized officers can enter your tracking reference directly into the public 'Verify Certificate' tab on this portal to see verified live civil registry credentials."
    },
    {
      q: "What is the turnaround timeline for the Certificate of Good Conduct?",
      a: "The Directorate of Criminal Investigations compiles police clearance certifications in approximately 5 working days following successful finger biometric capture at the selected county headquarters."
    }
  ];

  // Helper to map icons string to actual component
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Bike": return <Bike className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      case "CreditCard": return <CreditCard className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      case "FileCheck": return <FileCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      case "Baby": return <Baby className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      case "Briefcase": return <Briefcase className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      case "ShieldAlert": return <ShieldAlert className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      case "Compass": return <Compass className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
      default: return <Briefcase className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-16 pb-12 transition-colors">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden bg-[#006600] text-white min-h-[500px] flex items-center pt-24 pb-16">
        {/* Dynamic Image underlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=1200"
            alt="Nairobi skyline digital blueprint"
            className="w-full h-full object-cover opacity-10 filter grayscale"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-sm font-bold text-[10px] text-white tracking-widest uppercase">
                <KenyaLogo className="w-5 h-5" />
                <span>REPUBLIC OF KENYA • VISION 2026</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-none uppercase">
                Secure Portal for <span className="text-white block sm:inline font-bold">Citizen Services</span>
              </h1>
              <p className="text-sm text-green-100 max-w-xl font-sans leading-relaxed">
                Experience Kenya&apos;s next-generation eCitizen portal. Register motorbikes, apply for national IDs, renew driving credentials, or verify security certificates seamlessly under one unified gateway.
              </p>

              {/* Global search form */}
              <form onSubmit={handleSearchSubmit} className="flex bg-white p-1 rounded-md max-w-lg shadow-sm border border-gray-100">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search services (e.g. Boda Boda, Good Conduct)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent border-none outline-none focus:ring-0 text-black text-xs sm:text-sm pl-10 pr-4 py-3 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#006600] hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-md transition-all shrink-0 flex items-center space-x-1"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 hidden lg:block">
              {/* Premium Floating Badge Panel */}
              <div className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md shadow-sm relative space-y-4">
                <div className="absolute top-[-10px] right-4 bg-[#BB0000] text-white text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded-sm">
                  NEW REFORMS
                </div>
                <h3 className="font-bold text-sm tracking-wider uppercase text-white font-sans">
                  Unified County Permits
                </h3>
                <p className="text-xs text-green-100 leading-relaxed font-sans">
                  Trade, health, advertising, and safety certificates are now integrated into a single instant approval pipeline for all 47 county administrations.
                </p>
                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono">
                  <span className="text-green-200">STATUS: INTER-OPERABLE</span>
                  <Link to="/auth" className="text-white hover:underline flex items-center font-bold uppercase tracking-wider text-[10px]">
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT THE PORTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative">
            <div className="absolute top-2 left-2 w-full h-full bg-[#006600] rounded-md z-0" />
            <img
              src="https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=600"
              alt="Kenyan digital infrastructure"
              className="w-full h-auto rounded-md shadow-sm relative z-10 object-cover min-h-[350px]"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-[#006600] dark:text-green-400 uppercase tracking-widest block font-mono">
              About the smart citizen initiative
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight uppercase font-display">
              A Leap Forward in National Digital Service Infrastructure
            </h2>
            <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed font-sans">
              The Smart Citizen Portal represents an academic vision of secure, decentralized, and citizen-centric public administration. By consolidating multi-ministerial platforms into a unified system, we provide public safety, registration efficiency, and county trade ease.
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400 leading-relaxed font-sans">
              Designed with strict validation parameters, cryptographic certificate generation, and an online AI helpdesk, we ensure that civil credentials remain secure, traceable, and instantly verifiable worldwide.
            </p>
            <div className="pt-2">
              <Link
                to="/auth?tab=register"
                className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#006600] dark:text-green-400 hover:underline"
              >
                <span>Establish your profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: FEATURED SERVICES */}
      <section className="bg-[#F5F5F5] dark:bg-neutral-900/40 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider font-display">
              Digitized Public Services
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-2">
              Select any verified department pathway below to initiate, track, or download certified civil documents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white dark:bg-neutral-800 border-2 border-transparent hover:border-[#006600] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
                onClick={() => navigate("/auth")}
              >
                {/* Service Image banner */}
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-white dark:bg-neutral-900 p-2 rounded-sm flex items-center justify-center shadow-sm">
                    {getServiceIcon(srv.icon)}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black text-white text-[10px] font-black font-mono px-2.5 py-1 rounded-sm">
                    {srv.estimatedDays} DAYS
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 dark:text-neutral-500 font-mono tracking-widest block uppercase">
                      {srv.department}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-[#006600] dark:group-hover:text-green-400 transition-colors uppercase tracking-wide">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                      {srv.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-neutral-700/60 flex justify-between items-center text-xs">
                    <span className="font-bold text-[#006600] dark:text-green-400 uppercase tracking-wider text-[10px]">Online Submission</span>
                    <span className="inline-flex items-center space-x-1 text-black dark:text-white font-bold uppercase tracking-wider text-[10px]">
                      <span>Apply</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: BENEFITS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            Why Use the Smart Portal?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-2">
            Engineered for reliability, biometric accuracy, and complete county ledger synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="p-6 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm text-center space-y-4 hover:border-gray-300 transition-colors"
            >
              <div className={`w-12 h-12 rounded-sm flex items-center justify-center mx-auto ${b.color}`}>
                <b.icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider font-sans">{b.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 leading-relaxed font-sans">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: STATISTICS SECTION */}
      <section className="bg-[#006600] text-white py-16 relative">
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="bg-black flex-1" />
          <div className="bg-[#BB0000] w-3" />
          <div className="bg-white flex-1" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-wider uppercase font-display">
              Portal Operations Ledger
            </h2>
            <p className="text-xs text-green-100">
              Real-time administrative parameters confirming high service-level execution speeds and complete transparent operations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="space-y-2">
                <div className="w-10 h-10 rounded-sm bg-black/20 flex items-center justify-center mx-auto text-white mb-2">
                  <s.icon className="w-4 h-4" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                  {s.value}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-green-200 font-bold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CITIZEN SUCCESS STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            Citizen Success Stories
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-2">
            See how smart digital governance is impacting the daily lives and businesses of everyday Kenyans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {successStories.map((s, i) => (
            <div
              key={i}
              className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-gray-600 dark:text-neutral-400 italic leading-relaxed font-sans">
                &ldquo;{s.quote}&rdquo;
              </p>
              <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800/80">
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="w-10 h-10 rounded-full object-cover shadow"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">{s.name}</h4>
                  <span className="text-[10px] text-gray-400 font-mono block">{s.role}</span>
                </div>
                <div className="ml-auto flex text-amber-500">
                  {Array.from({ length: s.rating }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: FEATURED NEWS & ARTICLES */}
      <section className="bg-gray-50 dark:bg-neutral-900/40 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
              News & Announcements
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-2">
              Official press briefings regarding digitized infrastructure policies, County laws, and Huduma upgrades.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.slice(0, 3).map((art) => (
              <div
                key={art.id}
                className="bg-white dark:bg-neutral-800 border border-gray-100 dark:border-neutral-700 rounded-2xl overflow-hidden shadow-sm flex flex-col"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono uppercase">
                      <span>{art.category}</span>
                      <span>{art.date}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug">
                      {art.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
                      {art.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-neutral-700/60">
                    <Link
                      to="/auth"
                      className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Read Full Briefing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: GOVERNMENT SERVICES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            Inter-Departmental Bento Grid
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-2">
            Integrated smart citizen applications across vital ministries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-black text-white p-6 rounded-lg shadow-sm min-h-[220px] flex flex-col justify-between relative overflow-hidden group border border-neutral-800">
            <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 space-y-2">
              <span className="text-[9px] text-[#006600] font-mono uppercase font-black tracking-widest block">NTSA Transport Division</span>
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide font-display">Biometric Driving Credentials</h3>
              <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
                Directly access the central vehicle registries to link ownership logbooks, dispatch new boda boda permit validations, or request prompt license renewals.
              </p>
            </div>
            <Link to="/auth" className="relative z-10 text-[10px] uppercase tracking-wider font-bold text-white hover:text-green-400 inline-flex items-center mt-4">
              <span>Enter Registry Path</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="md:col-span-4 bg-[#006600] text-white p-6 rounded-lg shadow-sm min-h-[220px] flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[9px] text-green-200 font-mono uppercase block font-black tracking-widest">DCI Forensics Branch</span>
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide font-display">Clearance Gate</h3>
              <p className="text-xs text-green-100 leading-relaxed">
                Pre-book fingerprint scheduling appointments and fetch digital Police Clearance vouchers.
              </p>
            </div>
            <Link to="/auth" className="text-[10px] uppercase tracking-wider font-bold text-white hover:underline inline-flex items-center mt-4">
              <span>Book Appointment</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: DIGITAL KENYA SECTION */}
      <section className="bg-neutral-950 text-white py-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-1 bg-red-950/40 border border-red-900 text-red-400 text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded">
                <span>VIBRANT STARTUP PATHWAYS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase leading-none font-sans">
                Empowering Kenya&apos;s <span className="text-emerald-500 block">Silicon Savannah</span>
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                By accelerating the issuance of legal business certificates, unified county food permits, and transport logistics clearances, we provide micro-enterprises and global startups with friction-free licensing.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <h4 className="font-extrabold text-sm text-white font-sans">M-Pesa Integrated</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Settle application invoice fees with zero agency middleman friction.</p>
                </div>
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
                  <h4 className="font-extrabold text-sm text-white font-sans">Secure Cloud Storage</h4>
                  <p className="text-[11px] text-neutral-500 mt-1">Instantly retrieve or replace your uploaded document scans.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600"
                alt="Silicon savannah entrepreneurs"
                className="w-full h-auto rounded-2xl shadow-2xl relative z-0 object-cover min-h-[300px]"
              />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 10: FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">
            Frequently Answered Guides
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-2">
            Read common operational procedures regarding secure certificate requests and registry rules.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-xs sm:text-sm text-gray-900 dark:text-white flex justify-between items-center bg-gray-50/50 dark:bg-neutral-900"
              >
                <span className="flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>{faq.q}</span>
                </span>
                {faqOpen === idx ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
              </button>
              {faqOpen === idx && (
                <div className="p-4 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800/80 text-xs sm:text-sm text-gray-600 dark:text-neutral-300 leading-relaxed font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: CONTACT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            <div className="lg:col-span-5 bg-black text-white p-8 sm:p-12 space-y-6 flex flex-col justify-between relative">
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="bg-[#006600] flex-1" />
                <div className="bg-[#BB0000] w-3" />
                <div className="bg-white flex-1" />
              </div>

              <div className="space-y-4 mt-2">
                <h3 className="text-sm font-bold font-display tracking-wider uppercase">Institutional Helpdesk</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  For physical fingerprint booking assistance, county permit queries, or lost national ID replacement help, connect directly with our desk officers.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono text-neutral-300">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-[#BB0000]" />
                  <span>Eldoret, Kenya</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[#006600]" />
                  <span>0726625144</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-neutral-400" />
                  <span>support@smartcitizen.go.ke</span>
                </div>
              </div>

              <span className="text-[9px] text-neutral-500 font-sans tracking-widest block uppercase">
                MINISTRY OF INFORMATION, COMMUNICATIONS & THE DIGITAL ECONOMY
              </span>
            </div>

            <div className="lg:col-span-7 p-8 sm:p-12 space-y-6">
              <h3 className="text-xs uppercase tracking-wider font-bold text-gray-900 dark:text-white">File Support Query</h3>
              
              {contactSuccess && (
                <div className="p-3 bg-green-50 dark:bg-neutral-900 border border-[#006600] text-[#006600] rounded-sm text-xs font-bold">
                  Thank you! Your helpdesk ticket has been compiled. Representative will revert shortly.
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-emerald-700 text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-3 rounded-xl placeholder-gray-400"
                    placeholder="e.g. David Kiprop"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-emerald-700 text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-3 rounded-xl placeholder-gray-400"
                    placeholder="citizen@citizen.go.ke"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Your Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border-none outline-none focus:ring-1 focus:ring-emerald-700 text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-3 rounded-xl placeholder-gray-400"
                    placeholder="Describe your inquiry or tracking ticket issues..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-950 text-white font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow transition-colors block w-full text-center"
                >
                  Dispatch Ticket
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
