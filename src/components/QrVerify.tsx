import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, AlertCircle, Search, ShieldCheck, Printer, Calendar, User, FileText, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function QrVerify() {
  const [searchParams] = useSearchParams();
  const [refInput, setRefInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const refParam = searchParams.get("ref");

  useEffect(() => {
    if (refParam) {
      setRefInput(refParam);
      handleVerify(refParam);
    }
  }, [refParam]);

  const handleVerify = async (refStr: string) => {
    if (!refStr.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(refStr.trim())}`);
      const data = await res.json();

      if (res.ok && data.verified) {
        setResult(data.certificate);
      } else {
        setError(data.message || "The certificate reference number is invalid or could not be found.");
      }
    } catch (e) {
      setError("Unable to connect to the central validation registry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Title block */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center space-x-2 bg-green-50/50 dark:bg-green-950/20 px-3 py-1.5 rounded-sm border border-gray-200 dark:border-neutral-800 mb-4">
          <ShieldCheck className="w-4 h-4 text-[#006600] animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest font-bold text-[#006600] dark:text-green-400 uppercase">
            NTSA & Civil Registry Verification Gate
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-950 dark:text-white tracking-tight uppercase">
          Verify Secure Digital Certificates
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-2 max-w-xl mx-auto">
          Authorized officers, employers, and county registry workers can check the legal standing of any license, permit, or certificate issued by our smart eCitizen portal.
        </p>
      </div>

      {/* Verification Query Input */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs p-6 max-w-xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. SMART-DL-817293-2026"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-750 outline-none focus:ring-1 focus:ring-[#006600] text-gray-800 dark:text-neutral-100 text-xs sm:text-sm pl-10 pr-4 py-3 rounded-md placeholder-gray-400 font-mono"
            />
          </div>
          <button
            onClick={() => handleVerify(refInput)}
            disabled={loading || !refInput.trim()}
            className="bg-[#006600] hover:bg-green-800 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-md shadow-xs transition-colors shrink-0 disabled:bg-gray-300 dark:disabled:bg-neutral-800 cursor-pointer"
          >
            {loading ? "Checking System..." : "Validate Seal"}
          </button>
        </div>
      </div>

      {/* Verification Results */}
      <div className="max-w-2xl mx-auto">
        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-gray-200 dark:bg-neutral-800 rounded-md w-1/3 mx-auto" />
            <div className="h-40 bg-gray-200 dark:bg-neutral-800 rounded-md" />
          </div>
        )}

        {/* Success Case */}
        {result && (
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg shadow-xs overflow-hidden print:border-none print:shadow-none"
            id="verification-stamp-card"
          >
            {/* Header Shield Flag */}
            <div className="bg-[#006600] text-white p-5 flex justify-between items-center relative">
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="bg-black flex-1" />
                <div className="bg-red-600 w-2" />
                <div className="bg-white flex-1" />
              </div>
              <div className="flex items-center space-x-3 mt-1">
                <div className="w-10 h-10 rounded-sm bg-green-800 flex items-center justify-center text-white font-bold border border-green-700 font-mono text-xs uppercase">
                  Seal
                </div>
                <div>
                  <h3 className="font-bold text-xs tracking-widest uppercase">
                    Republic of Kenya
                  </h3>
                  <span className="text-[9px] text-green-200 font-mono tracking-wider block font-bold">
                    GOVERNMENT DIGITAL SIGNATURE VALIDATED
                  </span>
                </div>
              </div>
              <button
                onClick={printDocument}
                className="p-2 bg-green-800 hover:bg-green-900 rounded-md text-white transition-colors print:hidden cursor-pointer"
                title="Print Certificate Verification Record"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            {/* Stamp details */}
            <div className="p-6 space-y-6">
              
              {/* Authenticated banner */}
              <div className="bg-green-50/50 dark:bg-green-950/20 border border-gray-200 dark:border-neutral-800 p-4 rounded-md flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#006600] dark:text-green-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#006600] dark:text-green-400 leading-none">
                    Verified Authentic Document
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    This certificate is recorded as legally valid in the Civil Registry Central Ledger.
                  </p>
                </div>
              </div>

              {/* Data Rows */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="p-3.5 bg-gray-50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-800 rounded-md">
                  <span className="text-[9px] text-gray-450 uppercase font-bold tracking-widest font-sans block">
                    Citizen Name
                  </span>
                  <div className="flex items-center space-x-2 mt-1.5 font-bold uppercase tracking-tight text-gray-900 dark:text-white">
                    <User className="w-4 h-4 text-[#006600]" />
                    <span>{result.citizenName}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-800 rounded-md">
                  <span className="text-[9px] text-gray-450 uppercase font-bold tracking-widest font-sans block">
                    National ID Card
                  </span>
                  <div className="flex items-center space-x-2 mt-1.5 font-mono font-bold text-gray-900 dark:text-white">
                    <FileText className="w-4 h-4 text-[#006600]" />
                    <span>ID NO. {result.citizenNationalId}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-800 rounded-md">
                  <span className="text-[9px] text-gray-450 uppercase font-bold tracking-widest font-sans block">
                    Approved Service
                  </span>
                  <div className="flex items-center space-x-2 mt-1.5 font-bold uppercase tracking-tight text-gray-900 dark:text-white">
                    <Globe className="w-4 h-4 text-[#006600]" />
                    <span>{result.serviceName}</span>
                  </div>
                </div>

                <div className="p-3.5 bg-gray-50 dark:bg-neutral-800/40 border border-gray-200 dark:border-neutral-800 rounded-md">
                  <span className="text-[9px] text-gray-450 uppercase font-bold tracking-widest font-sans block">
                    Date of Issue
                  </span>
                  <div className="flex items-center space-x-2 mt-1.5 font-mono font-bold text-gray-900 dark:text-white">
                    <Calendar className="w-4 h-4 text-[#006600]" />
                    <span>{result.issueDate}</span>
                  </div>
                </div>

              </div>

              {/* Unique hash references */}
              <div className="p-4 bg-neutral-900 rounded-md text-neutral-300 text-xs font-mono space-y-1 text-center border border-neutral-850">
                <span className="text-[9px] text-neutral-500 block uppercase font-sans font-bold tracking-widest">
                  Central Ledger Cryptographic Token Ref
                </span>
                <span className="text-green-500 font-bold block select-all tracking-wider text-[11px]">
                  {result.refNumber}
                </span>
                <span className="text-[8px] text-neutral-600 block mt-1 select-none">
                  SYSTEM TIME INBOUND VALIDATION TIMESTAMP: {new Date().toISOString()}
                </span>
              </div>

            </div>
          </motion.div>
        )}

        {/* Error Case */}
        {error && (
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-neutral-900 border border-red-200 dark:border-red-950/40 rounded-lg p-8 shadow-xs text-center max-w-xl mx-auto"
          >
            <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-sm flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-red-700">Validation Seal Failed</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              {error}
            </p>
            <div className="mt-6 text-[10px] text-gray-400 bg-gray-50 dark:bg-neutral-800/30 p-3.5 rounded-sm font-mono border border-gray-200 dark:border-neutral-800 leading-relaxed">
              Please double check the spelling and try again. For further verification inquiries, kindly visit the nearest county Huduma Center with your printed voucher.
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
