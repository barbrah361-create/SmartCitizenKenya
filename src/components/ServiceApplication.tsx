import React, { useState, useRef } from "react";
import { ArrowLeft, Upload, FileText, CheckCircle2, AlertCircle, Eye, Trash2, ShieldAlert, Sparkles } from "lucide-react";

interface ServiceApplicationProps {
  service: any;
  onBack: () => void;
  onSubmit: (fields: any, documents: any[]) => Promise<any>;
  showToast: (title: string, message: string, type: "success" | "error") => void;
}

export default function ServiceApplication({
  service,
  onBack,
  onSubmit,
  showToast
}: ServiceApplicationProps) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Fields State
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Documents list
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ id: string; name: string; url: string; size: string }>>([]);

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Simulated Document Upload triggers
  const processSimulatedFile = (file: File) => {
    // Check size & mime
    const sizeKb = Math.floor(file.size / 1024);
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

    showToast("Scanned File", `Processing digital upload of ${file.name}...`, "success");

// Assign different Kenyan default images (from local image folder) based on document type
    const mockDocumentUrls = [
      "/src/components/image/birth certificate.webp",
      "/src/components/image/certificate of good conduct.jpeg",
      "/src/components/image/kenya-id-card-e1718167267333.jpg",
      "/src/components/image/Kenyan-e-passport.jpg"
    ];
    const randomIndex = Math.floor(Math.random() * mockDocumentUrls.length);

    setTimeout(() => {
      const newDoc = {
        id: `doc_${Date.now()}`,
        name: file.name,
        url: mockDocumentUrls[randomIndex],
        size: sizeStr
      };
      setUploadedDocs(prev => [...prev, newDoc]);
      showToast("Uploaded Successfully", `${file.name} is now synchronized.`, "success");
    }, 1200);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSimulatedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSimulatedFile(e.target.files[0]);
    }
  };

  const handleDeleteDoc = (id: string) => {
    setUploadedDocs(prev => prev.filter(d => d.id !== id));
    showToast("Document Deleted", "Document successfully removed from bundle.", "success");
  };

  const handleReplaceDoc = (id: string) => {
    // Delete first then trigger select
    setUploadedDocs(prev => prev.filter(d => d.id !== id));
    fileInputRef.current?.click();
  };

  // Form Submitter
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    // Check basic requirements validation
    if (uploadedDocs.length === 0) {
      showToast("Required Document", "Please upload at least one required document scan.", "error");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData, uploadedDocs);
      showToast("Submission Success", `Application for ${service.name} has been logged.`, "success");
      onBack();
    } catch (err) {
      showToast("Submission Failed", "An error occurred writing details to server registries.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Fields builder based on service id
  const renderDynamicFields = () => {
    switch (service.id) {
      case "srv_bike":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Motorcycle Frame No.</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("frameNumber", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
                placeholder="e.g. KM4-NTSA-128B"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">KRA PIN Certificate</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("kraPin", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
                placeholder="e.g. A019283724X"
              />
            </div>
          </div>
        );

      case "srv_id":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Birth Certificate Entry No.</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("birthCertNo", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
                placeholder="e.g. BC-817293-N"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Local Chief Name</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("chiefName", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md"
                placeholder="Chief Mwangi Kiprop"
              />
            </div>
          </div>
        );

      case "srv_conduct":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Fingerprint capture date</label>
              <input
                type="date"
                required
                onChange={(e) => handleFieldChange("fingerprintDate", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">DCI Station HQ</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("station", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md"
                placeholder="Kiambu Road DCI HQ or County Station"
              />
            </div>
          </div>
        );

      case "srv_birth":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Clinic Notification Slip ID</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("notificationId", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
                placeholder="e.g. SLIP-918239"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Child&apos;s Full Legal Name</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("childName", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md"
                placeholder="Kendi Mwangi"
              />
            </div>
          </div>
        );

      case "srv_business":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Company Registration No.</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("companyRegNo", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
                placeholder="e.g. CPR-2026-9183"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Physical Area Size (Sq Ft)</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("areaSize", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
                placeholder="e.g. 500"
              />
            </div>
          </div>
        );

      case "srv_dl":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Existing DL Number</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("licenseNumber", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
                placeholder="e.g. DL-918239"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Renewal Term</label>
              <select
                required
                onChange={(e) => handleFieldChange("renewalPeriod", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md"
              >
                <option value="">Select Option</option>
                <option value="1 Year">1 Year (Ksh. 600)</option>
                <option value="3 Years">3 Years (Ksh. 1,400)</option>
              </select>
            </div>
          </div>
        );

      case "srv_passport":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Booklet Type</label>
              <select
                required
                onChange={(e) => handleFieldChange("passportType", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md"
              >
                <option value="">Select Option</option>
                <option value="32 Pages">32 Pages (Ksh. 4,550)</option>
                <option value="50 Pages">50 Pages (Ksh. 6,050)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400 block mb-1">Alternative Contact</label>
              <input
                type="text"
                required
                onChange={(e) => handleFieldChange("backupContact", e.target.value)}
                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm px-4 py-2.5 rounded-md font-mono"
                placeholder="+254 7XX XXX XXX"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white uppercase tracking-wider cursor-pointer"
        id="btn_application_back"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Dashboard</span>
      </button>

      {/* Header card with service summary */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Flag Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="bg-black flex-1" />
          <div className="bg-[#006600] w-2" />
          <div className="bg-red-600 w-2" />
          <div className="bg-white flex-1" />
        </div>

        <div className="space-y-2 mt-1">
          <span className="text-[9px] text-gray-400 font-mono tracking-widest block uppercase font-bold">
            {service.department}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight uppercase tracking-tight">
            {service.name}
          </h2>
          <p className="text-xs text-gray-500 max-w-xl">
            {service.description}
          </p>
        </div>

        <div className="bg-green-50/50 dark:bg-green-950/20 px-4 py-3 rounded-md border border-gray-200 dark:border-neutral-800 text-center shrink-0">
          <span className="text-[9px] text-[#006600] dark:text-green-400 block uppercase font-bold tracking-widest">
            Operational SLA
          </span>
          <span className="text-lg font-bold text-[#006600] dark:text-green-400 font-mono">
            {service.estimatedDays} Days
          </span>
        </div>
      </div>

      {/* Form and Document Requirements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Forms */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-6 shadow-xs space-y-6">
          <h3 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white border-b border-gray-200 dark:border-neutral-850 pb-3">
            Inbound Form Parameters
          </h3>

          {renderDynamicFields()}

          {/* Form Declaration agreement checkbox */}
          <div className="p-3 bg-gray-50 dark:bg-neutral-800/40 rounded-md border border-gray-200 dark:border-neutral-800 flex items-start space-x-2.5">
            <input type="checkbox" required className="mt-1 accent-[#006600]" id="declaration-check" />
            <p className="text-[11px] text-gray-500 leading-relaxed font-sans">
              I hereby declare that the details provided are accurate to the best of my knowledge under penalty of perjury under section 34 of the Kenya civil registry act.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#006600] hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-md shadow-xs transition-colors cursor-pointer"
            id="btn_submit_application"
          >
            {loading ? "Registering on Ledger..." : "Settle Fees & Submit"}
          </button>
        </form>

        {/* Right Column: Upload lists and requirements */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Institutional checklist */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white">Required Documents List</h4>
            <ul className="space-y-2 text-xs text-gray-600 dark:text-neutral-400">
              {service.requirements.map((req: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#006600] shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Document Upload Area */}
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-widest text-gray-900 dark:text-white">Scan Upload Zone</h4>

            {/* Drag & Drop Frame */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-all ${
                dragActive
                  ? "border-[#006600] bg-green-50/20 dark:bg-green-950/20"
                  : "border-gray-200 dark:border-neutral-800 hover:border-[#006600]"
              }`}
              id="upload-drag-zone"
            >
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700 dark:text-neutral-300">Drag files here, or click to browse</p>
              <span className="text-[10px] text-gray-400 block mt-1 font-mono">Supports PDF, PNG, JPG (Max 5MB)</span>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileInputChange}
                accept=".pdf,.png,.jpg,.jpeg"
              />
            </div>

            {/* Uploaded Documents List */}
            {uploadedDocs.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                  Synchronized Scans ({uploadedDocs.length})
                </span>
                {uploadedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 bg-gray-50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-800 rounded-md flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#006600] shrink-0" />
                      <div className="truncate pr-2">
                        <p className="font-semibold text-gray-800 dark:text-neutral-200 truncate">{doc.name}</p>
                        <span className="text-[10px] text-gray-400 font-mono block">{doc.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => window.open(doc.url, "_blank")}
                        className="p-1 text-gray-400 hover:text-[#006600] transition-colors cursor-pointer"
                        title="View Doc Scan"
                        type="button"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleReplaceDoc(doc.id)}
                        className="p-1 text-gray-400 hover:text-amber-600 transition-colors text-[10px] font-mono hover:underline cursor-pointer"
                        title="Replace Doc"
                        type="button"
                      >
                        Replace
                      </button>
                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete Doc"
                        type="button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
