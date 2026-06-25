import React from "react";
import { Shield, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import KenyaLogo from "./KenyaLogo";

interface FooterProps {
  navigate?: (path: string) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-neutral-300 pt-16 pb-12 border-t border-neutral-800 relative z-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Logo Brand / Institutional details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <KenyaLogo className="w-9 h-9" />
              <span className="text-white font-bold tracking-wider text-sm uppercase font-sans">
                REPUBLIC OF KENYA
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Academic research project for a streamlined national smart citizen service portal. Designed with precision, optimizing accessibility and verification security.
            </p>
            <div className="flex items-center space-x-2 text-[10px] bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-sm text-neutral-400 font-mono">
              <Shield className="w-3 h-3 text-[#006600] mr-1" />
              <span>SSL SHA-256 SECURED CRYPTO</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-sans">Featured Services</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li>
                <span className="hover:text-green-400 transition-colors cursor-pointer flex items-center">
                  Boda Boda Motorcycle Registration
                </span>
              </li>
              <li>
                <span className="hover:text-green-400 transition-colors cursor-pointer flex items-center">
                  National ID Application
                </span>
              </li>
              <li>
                <span className="hover:text-green-400 transition-colors cursor-pointer flex items-center">
                  Certificate of Good Conduct (DCI)
                </span>
              </li>
              <li>
                <span className="hover:text-green-400 transition-colors cursor-pointer flex items-center">
                  Unified County Business Permits
                </span>
              </li>
            </ul>
          </div>

          {/* External Portals links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-sans">Official Resources</h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-sans">
              <li>
                <a href="https://www.kra.go.ke" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center">
                  <span>Kenya Revenue Authority (KRA)</span>
                  <ExternalLink className="w-3 h-3 ml-1 text-neutral-600" />
                </a>
              </li>
              <li>
                <a href="https://www.ntsa.go.ke" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center">
                  <span>Transport and Safety (NTSA)</span>
                  <ExternalLink className="w-3 h-3 ml-1 text-neutral-600" />
                </a>
              </li>
              <li>
                <a href="https://www.dci.go.ke" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center">
                  <span>Criminal Investigations (DCI)</span>
                  <ExternalLink className="w-3 h-3 ml-1 text-neutral-600" />
                </a>
              </li>
              <li>
                <a href="https://hudumakenya.go.ke" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center">
                  <span>Huduma Kenya Centers</span>
                  <ExternalLink className="w-3 h-3 ml-1 text-neutral-600" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-sans">Helpdesk Support</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-sans">
              <li className="flex items-start">
                <MapPin className="w-3.5 h-3.5 mr-2 text-[#BB0000] shrink-0" />
                <span>Eldoret, Kenya</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2 text-[#006600] shrink-0" />
                <span>0726625144</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2 text-neutral-400 shrink-0" />
                <span>support@smartcitizen.go.ke</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-wider text-neutral-500 font-sans">
          <p>© {currentYear} Kenya Smart Citizen Portal. Academic Research Project.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0 font-mono">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Use</span>
            <span>•</span>
            <span className="text-[#006600] font-black tracking-widest">HARAMBEE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
