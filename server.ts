import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const DEFAULT_PORT = Number(process.env.PORT || 3000);
const JWT_SECRET = process.env.JWT_SECRET || "kenya_smart_citizen_secret_key_2026";
const DB_FILE = path.join(process.cwd(), "smart_citizen_db.json");

// Define basic database storage types
interface DBData {
  users: any[];
  services: any[];
  applications: any[];
  certificates: any[];
  notifications: any[];
  auditLogs: any[];
  articles: any[];
}

// Resilient DB Class
class SmartCitizenDB {
  private data: DBData = {
    users: [],
    services: [],
    applications: [],
    certificates: [],
    notifications: [],
    auditLogs: [],
    articles: []
  };

  constructor() {
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        this.data = JSON.parse(raw);
        console.log("Database loaded successfully with:", {
          users: this.data.users?.length || 0,
          services: this.data.services?.length || 0,
          applications: this.data.applications?.length || 0,
          certificates: this.data.certificates?.length || 0,
          notifications: this.data.notifications?.length || 0,
          auditLogs: this.data.auditLogs?.length || 0,
          articles: this.data.articles?.length || 0,
        });
      } else {
        this.seed();
      }
    } catch (e) {
      console.error("Failed to load local DB, fallback to seed:", e);
      this.seed();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed to write database file:", e);
    }
  }

  getData() {
    return this.data;
  }

  seed() {
    console.log("Seeding default database records...");
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync("Admin123!", salt);
    const citizenPasswordHash = bcrypt.hashSync("Citizen123!", salt);

    // Seed Users
    this.data.users = [
      {
        id: "usr_admin",
        name: "Hon. Jane Mwangi",
        nationalId: "12345678",
        phone: "+254 712 345678",
        email: "admin@citizen.go.ke",
        password: adminPasswordHash,
        role: "admin",
        status: "active",
        createdAt: new Date().toISOString()
      },
      {
        id: "usr_citizen",
        name: "David Kiprop",
        nationalId: "87654321",
        phone: "+254 722 987654",
        email: "citizen@citizen.go.ke",
        password: citizenPasswordHash,
        role: "citizen",
        status: "active",
        createdAt: new Date().toISOString()
      }
    ];

    // Seed Services
    this.data.services = [
      {
        id: "srv_bike",
        name: "Boda Boda Motorcycle Registration",
        description: "Official registration and digital logbook allocation for motorbike owners and commercial operators under NTSA guidelines.",
        image: "/src/image/Boda-boda-launch.jpg",
        icon: "Bike",
        department: "National Transport and Safety Authority (NTSA)",
        estimatedDays: 3,
        requirements: ["Proof of ownership (Invoice/Logbook)", "ID Card copy", "KRA PIN Certificate", "Insurances policy copy"]
      },
      {
        id: "srv_id",
        name: "National ID Card Application",
        description: "Apply for a new national registration card, replace a lost ID, or correct card information with the civil registry.",
        image: "/src/image/birth certificate.webp",
        icon: "CreditCard",
        department: "National Registration Bureau (NRB)",
        estimatedDays: 14,
        requirements: ["Birth Certificate copy", "Parent's ID copies", "School leaving certificate", "Chief's introduction letter"]
      },
      {
        id: "srv_conduct",
        name: "Certificate of Good Conduct",
        description: "Police clearance certificate validating the applicant's criminal status for employment or travel clearance.",
        image: "/src/image/certificate of good conduct.jpeg",
        icon: "FileCheck",
        department: "Directorate of Criminal Investigations (DCI)",
        estimatedDays: 5,
        requirements: ["Fingerprint appointment booking", "National ID Copy", "eCitizen invoice receipt"]
      },
      {
        id: "srv_birth",
        name: "Birth Certificate Issuance",
        description: "Obtain a certified legal document detailing birth records for individuals born within Kenyan jurisdictions.",
        image: "/src/image/birth certificate.webp",
        icon: "Baby",
        department: "Civil Registration Department",
        estimatedDays: 7,
        requirements: ["Notification of Birth (Clinic Card)", "Parents' National IDs", "KRA PIN of parents"]
      },
      {
        id: "srv_business",
        name: "Unified Business Permit",
        description: "Acquire county-level commercial licensing covering health, fire, advertising, and trade regulations.",
        image: "/src/image/bussiness permit.webp",
        icon: "Briefcase",
        department: "Nairobi City County Business Licensing",
        estimatedDays: 2,
        requirements: ["Business Registration Certificate", "KRA PIN of business", "Physical address details", "Land rates receipt"]
      },
      {
        id: "srv_dl",
        name: "Driving License Renewal",
        description: "Fast digital renewal of standard driving license credentials for 1-year or 3-year periods.",
        image: "/src/image/driving lisence kenya.jpeg",
        icon: "ShieldAlert",
        department: "National Transport and Safety Authority (NTSA)",
        estimatedDays: 1,
        requirements: ["Existing Driving License Number", "National ID card scan", "Medical eye test certificate (for heavy vehicles)"]
      },
      {
        id: "srv_passport",
        name: "New Generation Passport Application",
        description: "Apply for a secure biometric e-passport with international travel validation.",
        image: "/src/image/Kenyan-e-passport.jpg",
        icon: "Compass",
        department: "Department of Immigration Services",
        estimatedDays: 21,
        requirements: ["Birth Certificate copy", "National ID card copy", "Recommender's ID Copy", "3 Passport size photos"]
      }
    ];

    // Seed Articles
    this.data.articles = [
      {
        id: "art_1",
        title: "Digital Kenya 2026: Revolutionizing Public Service Delivery",
        description: "The Government of Kenya accelerates eCitizen portal capabilities to simplify documentation for over 15 million citizens.",
        content: "Under the new Smart Kenya Blueprint, the ministry of ICT has launched premium automation modules targeting high-frequency requests including NTSA licenses, business licensing, and police clearance certifications. These cloud-backed solutions aim to reduce queue times at Huduma centers by up to 90% in key urban sectors like Nairobi, Mombasa, and Kisumu.",
        image: "/src/image/New-Kenya-logo.jpeg",
        date: "2026-06-20",
        category: "Policy Announcements"
      },
      {
        id: "art_2",
        title: "Simplified Boda Boda Operator Registration Guidelines Launched",
        description: "The Ministry of Transport partners with NTSA to roll out instantaneous digital certificate renewals for motorbike operators.",
        content: "To enhance micro-entrepreneurship and road safety, the newly simplified motorbike registration module allows riders to verify ownership, upload insurance certificates, and download instant digitized operation permits. Local county operators will also receive tailored SMS safety alerts directly.",
        image: "/src/image/Boda-boda-launch.jpg",
        date: "2026-06-22",
        category: "Transit Reforms"
      },
      {
        id: "art_3",
        title: "Unified Business Permitting Now Live Across All 47 Counties",
        description: "Entrepreneurs can now apply and pay for local county trade licenses online in a streamlined unified system.",
        content: "County trade, food-handling, advertising, and fire certificates have been successfully compiled into a single unified business permit system. Payments can now be disbursed securely online with certificates issued in under 48 hours.",
        image: "/src/image/bussiness permit.webp",
        date: "2026-06-24",
        category: "Trade & Commerce"
      }
    ];

    // Seed some Demo Applications
    this.data.applications = [
      {
        id: "app_demo_1",
        userId: "usr_citizen",
        userName: "David Kiprop",
        userEmail: "citizen@citizen.go.ke",
        serviceId: "srv_dl",
        serviceName: "Driving License Renewal",
        status: "Approved",
        fields: {
          licenseNumber: "DL-987654-K",
          renewalPeriod: "3 Years",
          county: "Nairobi",
          bloodGroup: "O+"
        },
        documents: [
          { id: "doc_1", name: "current_dl_scan.jpg", url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=300", size: "420 KB" }
        ],
        reviewNotes: "Details verified successfully. Electronic credential issued.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "app_demo_2",
        userId: "usr_citizen",
        userName: "David Kiprop",
        userEmail: "citizen@citizen.go.ke",
        serviceId: "srv_conduct",
        serviceName: "Certificate of Good Conduct",
        status: "Pending Review",
        fields: {
          fingerprintDate: "2026-06-28",
          station: "DCI Headquarters Kiambu Road",
          purpose: "Job Application",
          employer: "Safaricom PLC"
        },
        documents: [
          { id: "doc_2", name: "national_id_scan.pdf", url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=300", size: "1.2 MB" }
        ],
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Seed certificates
    this.data.certificates = [
      {
        id: "cert_demo_1",
        applicationId: "app_demo_1",
        serviceName: "Driving License Renewal",
        citizenName: "David Kiprop",
        citizenNationalId: "87654321",
        citizenPhone: "+254 722 987654",
        citizenEmail: "citizen@citizen.go.ke",
        issueDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        refNumber: "NTSA-DL-817293-2026",
        qrCodeValue: "https://ais-dev-oamxtjqtewiy655qciyong-817037786414.europe-west2.run.app/verify/NTSA-DL-817293-2026"
      }
    ];

    // Seed Notifications
    this.data.notifications = [
      {
        id: "notif_1",
        userId: "usr_citizen",
        title: "Application Submitted Successfully",
        message: "Your application for Certificate of Good Conduct has been received.",
        read: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "notif_2",
        userId: "usr_citizen",
        title: "Certificate Available for Download",
        message: "Your Driving License Renewal certificate has been issued! You can download it now.",
        read: true,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Seed Audit Logs
    this.data.auditLogs = [
      {
        id: "log_1",
        userId: "usr_citizen",
        userName: "David Kiprop",
        userRole: "citizen",
        action: "Login",
        details: "User successfully authenticated into the portal",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "log_2",
        userId: "usr_citizen",
        userName: "David Kiprop",
        userRole: "citizen",
        action: "Create Application",
        details: "Submitted a application for Certificate of Good Conduct",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    this.save();
  }
}

const db = new SmartCitizenDB();

// Setup Lazy Gemini API Client
let ai: any = null;
function getGeminiClient() {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.log("No GEMINI_API_KEY provided in env. Gemini Assistant is running in Sim mode.");
      return null;
    }
    ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// REST APIs setup
const app = express();
app.use(express.json());

// Helper to write audit log
function logAction(userId: string, userName: string, role: string, action: string, details: string) {
  const data = db.getData();
  const log = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    userId,
    userName,
    userRole: role,
    action,
    details,
    createdAt: new Date().toISOString()
  };
  data.auditLogs.unshift(log);
  db.save();
}

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No session token supplied." });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Expired or invalid session token." });
    }
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ENDPOINTS ---

// Register
app.post("/api/auth/register", (req, res) => {
  const { name, nationalId, phone, email, password } = req.body;

  if (!name || !nationalId || !phone || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const data = db.getData();
  const existingUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase() || u.nationalId === nationalId);

  if (existingUser) {
    return res.status(400).json({ message: "A citizen with this email or National ID already exists." });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    nationalId,
    phone,
    email: email.toLowerCase(),
    password: passwordHash,
    role: "citizen",
    status: "active",
    createdAt: new Date().toISOString()
  };

  data.users.push(newUser);
  db.save();

  logAction(newUser.id, newUser.name, "citizen", "Registration", "Citizen registered a new account");

  const token = jwt.sign(
    { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, nationalId: newUser.nationalId, phone: newUser.phone },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      nationalId: newUser.nationalId,
      phone: newUser.phone,
      status: newUser.status
    }
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const data = db.getData();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  if (user.status === "disabled") {
    return res.status(403).json({ message: "This account has been disabled by administrators." });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, nationalId: user.nationalId, phone: user.phone },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  logAction(user.id, user.name, user.role, "Login", "User logged in successfully");

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nationalId: user.nationalId,
      phone: user.phone,
      status: user.status
    }
  });
});

// Reset Password Simulation
app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const data = db.getData();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ message: "No registered citizen matches that email address." });
  }

  // Generate mock token and log action
  logAction(user.id, user.name, user.role, "Password Reset Request", "Triggered standard recovery protocol email");
  res.json({
    message: "SMS notification simulation and reset instructions dispatched to registered phone " + user.phone
  });
});

app.post("/api/auth/reset-password", (req, res) => {
  const { email, password } = req.body;
  const data = db.getData();
  const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(password, salt);
  db.save();

  logAction(user.id, user.name, user.role, "Password Reset", "Successfully updated password credentials");
  res.json({ message: "Your password has been reset successfully." });
});

// Update Profile
app.put("/api/auth/profile", authenticateToken, (req: any, res) => {
  const { name, phone } = req.body;
  const data = db.getData();
  const user = data.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  user.name = name || user.name;
  user.phone = phone || user.phone;
  db.save();

  logAction(user.id, user.name, user.role, "Profile Update", "Updated name or contact info");

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role, nationalId: user.nationalId, phone: user.phone },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nationalId: user.nationalId,
      phone: user.phone,
      status: user.status
    }
  });
});

// Verify Auth Token Session
app.get("/api/auth/session", authenticateToken, (req: any, res) => {
  const data = db.getData();
  const user = data.users.find(u => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nationalId: user.nationalId,
      phone: user.phone,
      status: user.status
    }
  });
});

// --- SERVICES ENDPOINTS ---

app.get("/api/services", (req, res) => {
  res.json(db.getData().services);
});

// Add Service (Admin only)
app.post("/api/services", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const { name, description, image, icon, department, estimatedDays, requirements } = req.body;
  const data = db.getData();

  const newService = {
    id: `srv_${Date.now()}`,
    name,
    description,
        image: image || "/src/image/New-Kenya-logo.jpeg",
    icon: icon || "Briefcase",
    department,
    estimatedDays: Number(estimatedDays) || 3,
    requirements: Array.isArray(requirements) ? requirements : [requirements]
  };

  data.services.push(newService);
  db.save();

  logAction(req.user.id, req.user.name, req.user.role, "Create Service", `Added new service option: ${name}`);
  res.status(201).json(newService);
});

// Edit Service (Admin)
app.put("/api/services/:id", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const { name, description, image, icon, department, estimatedDays, requirements } = req.body;
  const data = db.getData();
  const service = data.services.find(s => s.id === req.params.id);

  if (!service) return res.status(404).json({ message: "Service not found" });

  service.name = name || service.name;
  service.description = description || service.description;
  service.image = image || service.image;
  service.icon = icon || service.icon;
  service.department = department || service.department;
  service.estimatedDays = Number(estimatedDays) || service.estimatedDays;
  service.requirements = requirements || service.requirements;

  db.save();
  logAction(req.user.id, req.user.name, req.user.role, "Update Service", `Modified service configuration: ${service.name}`);
  res.json(service);
});

// Delete Service (Admin)
app.delete("/api/services/:id", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const data = db.getData();
  const initialLen = data.services.length;
  data.services = data.services.filter(s => s.id !== req.params.id);

  if (data.services.length === initialLen) {
    return res.status(404).json({ message: "Service not found" });
  }

  db.save();
  logAction(req.user.id, req.user.name, req.user.role, "Delete Service", `Removed service ID: ${req.params.id}`);
  res.json({ success: true });
});

// --- APPLICATIONS ENDPOINTS ---

// Get Applications
app.get("/api/applications", authenticateToken, (req: any, res) => {
  const data = db.getData();
  if (req.user.role === "admin") {
    res.json(data.applications);
  } else {
    res.json(data.applications.filter(a => a.userId === req.user.id));
  }
});

// Create Application
app.post("/api/applications", authenticateToken, (req: any, res) => {
  const { serviceId, fields, documents } = req.body;
  const data = db.getData();
  const service = data.services.find(s => s.id === serviceId);

  if (!service) {
    return res.status(404).json({ message: "Selected citizen service not found." });
  }

  const newApp = {
    id: `app_${Date.now()}`,
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    serviceId: service.id,
    serviceName: service.name,
    status: "Submitted",
    fields: fields || {},
    documents: documents || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  data.applications.unshift(newApp);

  // Auto create notification
  data.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: req.user.id,
    title: "Application Submitted",
    message: `Your application for ${service.name} has been submitted. Tracking Ref: ${newApp.id}`,
    read: false,
    createdAt: new Date().toISOString()
  });

  db.save();
  logAction(req.user.id, req.user.name, req.user.role, "Create Application", `Submitted application for: ${service.name}`);

  res.status(201).json(newApp);
});

// Update Application (Citizen - Draft saving or editing)
app.put("/api/applications/:id", authenticateToken, (req: any, res) => {
  const data = db.getData();
  const appItem = data.applications.find(a => a.id === req.params.id);

  if (!appItem) return res.status(404).json({ message: "Application not found" });

  // Citizen can update if it's their own draft or submitted application
  if (req.user.role !== "admin" && appItem.userId !== req.user.id) {
    return res.status(403).json({ message: "Forbidden" });
  }

  appItem.fields = req.body.fields || appItem.fields;
  appItem.documents = req.body.documents || appItem.documents;
  appItem.status = req.body.status || appItem.status;
  appItem.updatedAt = new Date().toISOString();

  db.save();
  res.json(appItem);
});

// Approve/Reject Application (Admin Only)
app.post("/api/applications/:id/review", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const { status, reviewNotes } = req.body;
  const data = db.getData();
  const appItem = data.applications.find(a => a.id === req.params.id);

  if (!appItem) return res.status(404).json({ message: "Application not found" });

  appItem.status = status;
  appItem.reviewNotes = reviewNotes || "";
  appItem.updatedAt = new Date().toISOString();

  // Create notifications
  data.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: appItem.userId,
    title: `Application Status: ${status}`,
    message: `Your application for ${appItem.serviceName} was reviewed. Decision: ${status}. Notes: ${reviewNotes || "None"}`,
    read: false,
    createdAt: new Date().toISOString()
  });

  // Generate certificate if Approved
  if (status === "Approved" || status === "Completed") {
    const refNum = `SMART-${appItem.serviceId.substring(4).toUpperCase()}-${Date.now().toString().substring(7)}-2026`;
    const newCert = {
      id: `cert_${Date.now()}`,
      applicationId: appItem.id,
      serviceName: appItem.serviceName,
      citizenName: appItem.userName,
      citizenNationalId: appItem.fields.nationalId || "NRB-Verified",
      citizenPhone: appItem.fields.phone || "+254 Registered",
      citizenEmail: appItem.userEmail,
      issueDate: new Date().toISOString().split("T")[0],
      refNumber: refNum,
      qrCodeValue: `https://ais-dev-oamxtjqtewiy655qciyong-817037786414.europe-west2.run.app/verify/${refNum}`
    };
    data.certificates.unshift(newCert);

    data.notifications.unshift({
      id: `notif_cert_${Date.now()}`,
      userId: appItem.userId,
      title: "Digital Certificate Issued!",
      message: `Your secure digital certificate for ${appItem.serviceName} has been issued. Ref: ${refNum}`,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  db.save();
  logAction(req.user.id, req.user.name, req.user.role, "Review Application", `Reviewed application ID ${appItem.id}: set to ${status}`);

  res.json(appItem);
});

// --- CERTIFICATES ENDPOINTS ---

app.get("/api/certificates", authenticateToken, (req: any, res) => {
  const data = db.getData();
  if (req.user.role === "admin") {
    res.json(data.certificates);
  } else {
    res.json(data.certificates.filter(c => c.citizenEmail === req.user.email));
  }
});

// Verify Certificate without Authentication (Public Endpoint)
app.get("/api/certificates/verify/:ref", (req, res) => {
  const data = db.getData();
  const cert = data.certificates.find(c => c.refNumber === req.params.ref);

  if (!cert) {
    return res.status(404).json({ verified: false, message: "No official certificate matches this reference number in our system." });
  }

  res.json({ verified: true, certificate: cert });
});

// --- NOTIFICATIONS ENDPOINTS ---

app.get("/api/notifications", authenticateToken, (req: any, res) => {
  const data = db.getData();
  res.json(data.notifications.filter(n => n.userId === req.user.id));
});

app.post("/api/notifications/mark-read", authenticateToken, (req: any, res) => {
  const data = db.getData();
  data.notifications
    .filter(n => n.userId === req.user.id)
    .forEach(n => n.read = true);
  db.save();
  res.json({ success: true });
});

app.delete("/api/notifications/:id", authenticateToken, (req: any, res) => {
  const data = db.getData();
  data.notifications = data.notifications.filter(n => !(n.id === req.params.id && n.userId === req.user.id));
  db.save();
  res.json({ success: true });
});

// --- AUDIT LOGS (Admin only) ---

app.get("/api/audit-logs", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  res.json(db.getData().auditLogs);
});

// --- ADMIN USER MANAGEMENT ---

app.get("/api/admin/users", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  res.json(db.getData().users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone, nationalId: u.nationalId, status: u.status, createdAt: u.createdAt })));
});

app.put("/api/admin/users/:id", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  const data = db.getData();
  const targetUser = data.users.find(u => u.id === req.params.id);

  if (!targetUser) return res.status(404).json({ message: "User not found" });

  targetUser.name = req.body.name || targetUser.name;
  targetUser.phone = req.body.phone || targetUser.phone;
  targetUser.role = req.body.role || targetUser.role;
  targetUser.status = req.body.status || targetUser.status;

  db.save();
  logAction(req.user.id, req.user.name, req.user.role, "Update User Account", `Modified profile for user: ${targetUser.email}`);
  res.json({ success: true });
});

app.delete("/api/admin/users/:id", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  const data = db.getData();
  const initialLen = data.users.length;
  data.users = data.users.filter(u => u.id !== req.params.id);

  if (data.users.length === initialLen) {
    return res.status(404).json({ message: "User not found" });
  }

  db.save();
  logAction(req.user.id, req.user.name, req.user.role, "Delete User Account", `Removed user account ID: ${req.params.id}`);
  res.json({ success: true });
});

// --- ANNOUNCEMENT ARTICLES ---

app.get("/api/articles", (req, res) => {
  res.json(db.getData().articles);
});

// --- ANALYTICS DASHBOARD STATS ---

app.get("/api/analytics/stats", authenticateToken, (req: any, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });

  const data = db.getData();

  // Citizen Growth (Simulated monthly increments ending with current total)
  const userGrowth = [
    { month: "Jan", citizens: Math.max(1, Math.floor(data.users.length * 0.4)) },
    { month: "Feb", citizens: Math.max(2, Math.floor(data.users.length * 0.5)) },
    { month: "Mar", citizens: Math.max(2, Math.floor(data.users.length * 0.6)) },
    { month: "Apr", citizens: Math.max(3, Math.floor(data.users.length * 0.75)) },
    { month: "May", citizens: Math.max(4, Math.floor(data.users.length * 0.9)) },
    { month: "Jun", citizens: data.users.length }
  ];

  // Applications count by status
  const statuses = ["Draft", "Submitted", "Pending Review", "Approved", "Rejected", "Completed"];
  const statusStats = statuses.map(st => ({
    name: st,
    value: data.applications.filter(a => a.status === st).length
  })).filter(s => s.value > 0);

  if (statusStats.length === 0) {
    statusStats.push({ name: "Submitted", value: 1 });
  }

  // Applications count by service
  const serviceStatsMap: Record<string, number> = {};
  data.applications.forEach(appItem => {
    serviceStatsMap[appItem.serviceName] = (serviceStatsMap[appItem.serviceName] || 0) + 1;
  });

  const serviceStats = Object.keys(serviceStatsMap).map(key => ({
    name: key,
    applications: serviceStatsMap[key]
  }));

  if (serviceStats.length === 0) {
    serviceStats.push({ name: "Driving License Renewal", applications: 1 });
  }

  // Monthly applications timeline
  const monthlyApplications = [
    { name: "Jan", submissions: 12 },
    { name: "Feb", submissions: 19 },
    { name: "Mar", submissions: 28 },
    { name: "Apr", submissions: 42 },
    { name: "May", submissions: 55 },
    { name: "Jun", submissions: data.applications.length + 30 }
  ];

  // Revenue simulation (Ksh. 1,500 per application fee on average)
  const totalSubmissions = data.applications.length;
  const simulatedRevenue = totalSubmissions * 1500;

  res.json({
    totalCitizens: data.users.filter(u => u.role === "citizen").length,
    totalApplications: data.applications.length,
    pendingReviews: data.applications.filter(a => a.status === "Pending Review" || a.status === "Submitted").length,
    totalApproved: data.applications.filter(a => a.status === "Approved" || a.status === "Completed").length,
    totalRejected: data.applications.filter(a => a.status === "Rejected").length,
    simulatedRevenue,
    userGrowth,
    statusStats,
    serviceStats,
    monthlyApplications
  });
});

// --- AI VIRTUAL ASSISTANT POWERED BY GEMINI ---

app.post("/api/assistant", async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Habari! Please ask me a question so I can assist you." });
  }

  const gemini = getGeminiClient();

  if (!gemini) {
    // Elegant fallback simulation if API Key is not set yet
    const lower = message.toLowerCase();
    let reply = "Habari Mwananchi! I am the Smart Citizen Virtual Assistant. It seems my advanced AI capabilities are running in offline/simulation mode right now because a GEMINI_API_KEY is not set in the AI Studio secrets. However, I can guide you through our standard services:\n\n";

    if (lower.includes("id") || lower.includes("identity") || lower.includes("kitambulisho")) {
      reply += "To apply for or renew a **National ID Card**, you must be a Kenyan Citizen aged 18 or above. Requirements include:\n1. Birth Certificate copy\n2. Parents' National ID card copies\n3. An introduction letter from your local Chief.\nThe civil registry takes approximately 14 working days.";
    } else if (lower.includes("boda") || lower.includes("bike") || lower.includes("motorcycle")) {
      reply += "For **Boda Boda Motorcycle Registration**, NTSA requires:\n1. Legitimate proof of purchase (Invoice/previous registration)\n2. Your PIN Certificate from KRA\n3. Valid commercial third-party insurance certificate.\nProcessing is fully digitalized and takes 3 business days.";
    } else if (lower.includes("conduct") || lower.includes("police") || lower.includes("clearance")) {
      reply += "To obtain a **Certificate of Good Conduct** from the DCI:\n1. File the booking request on our portal\n2. Make payments via our eCitizen simulated channels\n3. Present yourself at Kiambu Road DCI HQ or local county headquarters for finger biometric scanning.\nCertificate gets compiled in 5 working days.";
    } else if (lower.includes("permit") || lower.includes("business")) {
      reply += "For the **Unified Business Permit** (Nairobi City County or local counties):\n1. Provide your registered business name/number\n2. Enter exact physical premises and sizing parameters.\nThis unified permit covers trade license, fire security, health certificate, and outdoor signboards. Issued digitally in 48 hours.";
    } else if (lower.includes("hello") || lower.includes("mambo") || lower.includes("habari")) {
      reply = "Habari Mwananchi! Welcome to the Kenya Smart Citizen Portal AI Guide. I can help explain the requirements, costs, and timeline for National ID, Boda Boda certificates, Driving License renewal, Birth certificates, Business Permits, and Passport applications. What service can I guide you with today?";
    } else {
      reply += "I am ready to help you with:\n• Motorcycle Registration\n• National ID Applications\n• Certificate of Good Conduct (DCI)\n• Business Trade Permits\n• Birth Certificates\n• Driving License Renewals\n• Passport Applications\n\nAsk me about required documents, processing fees, or delivery timelines!";
    }

    return res.json({ reply, offlineMode: true });
  }

  try {
    const formattedHistory = (chatHistory || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" as const : "model" as const,
      parts: [{ text: msg.text }]
    }));

    // Generate response using gemini-3.5-flash which does not require a paid key
    const systemPrompt = `You are "Sema", the official, highly polite AI Virtual Citizen Assistant for the "Kenya Smart Citizen Portal" (inspired by Kenya's eCitizen).
Your role is to guide Kenyan citizens through civil registry and government applications.
Speak warmly with a professional, helpful, and proudly Kenyan patriotic tone. You can use common Kenyan greetings like 'Habari!' or 'Mambo!' occasionally, but reply primarily in English with clear formatting.
Here is the factual data about our services:
1. NTSA Motorbike/Boda Boda Registration: Costs Ksh 1,500. Takes 3 working days. Requires proof of ownership/purchase invoice, KRA PIN, insurance copy, ID copy.
2. National ID Application: Free for first-time applicants, Ksh 1,000 for replacements/corrections. Takes 14 working days. Requires Birth certificate, parents' ID copies, chief's introduction.
3. DCI Certificate of Good Conduct (Police Clearance): Costs Ksh 1,050. Takes 5 working days. Requires biometric finger scanning booking, National ID.
4. Birth Certificate: Costs Ksh 180 for standard registration. Takes 7 working days. Requires birth notification slip, parents' IDs and PINs.
5. Unified Business Trade Permit: Costs vary by county/size (approx Ksh 10,000). Takes 2 days. Requires business register name, KRA PIN, physical dimensions.
6. Driving License Renewal: Ksh 600 for 1 year, Ksh 1,400 for 3 years. Instantly active. Requires ID copy and previous license number.
7. Department of Immigration e-Passport: Costs Ksh 4,550 for 32-pages, Ksh 6,050 for 50-pages. Takes 21 days. Requires birth certificate, ID card copy, recommender ID.

If the citizen asks about application tracking, explain that they can see live status updates ('Draft', 'Submitted', 'Pending Review', 'Approved', 'Rejected', 'Completed') inside their personal Citizen Dashboard on this portal.
Respond with markdown lists, bold key numbers, and clean structured text. Avoid speculative information outside of this scope.`;

    const contents = [
      ...formattedHistory,
      { role: "user" as const, parts: [{ text: message }] }
    ];

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    res.json({ reply: response.text || "I apologize, but I could not formulate a response. Please try asking again.", offlineMode: false });
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    res.status(500).json({ reply: "Habari. I am experiencing a temporary connection issue communicating with the AI servers. Let me assist you locally: What documents can I help you check?", error: error.message, offlineMode: true });
  }
});

// --- VITE AND PUBLIC ASSETS HANDLERS ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const listenOnPort = (port: number) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`Kenya Smart Citizen Portal full-stack server operating dynamically at http://localhost:${port}`);
    });

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.warn(`Port ${port} is already in use. Trying ${port + 1}...`);
        server.close();
        listenOnPort(port + 1);
      } else {
        console.error("Failed to start server:", error);
        process.exit(1);
      }
    });
  };

  listenOnPort(DEFAULT_PORT);
}

startServer();
