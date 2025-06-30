import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Linkedin, 
  Github, 
  Facebook,
  Instagram,
  Sparkles,
  Shield,
  Award,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div> */}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mr-3">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  FutureForge
                </h3>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">
                Empowering professionals through intelligent skill assessment and personalized career development recommendations.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-400" />
                Platform
              </h4>
              <ul className="space-y-4">
                {[
                  { label: 'Skill Assessments', href: '/assessments' },
                  { label: 'Career Recommendations', href: '/recommendations' },
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-purple-400" />
                Resources
              </h4>
              <ul className="space-y-4">
                {[
                  { label: 'Help Center', href: '/help' },
                  { label: 'API Documentation', href: '/docs', external: true },
                  { label: 'Blog & Insights', href: '/blog' },
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href} 
                      className="text-slate-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0" />
                      {link.label}
                      {link.external && <ExternalLink className="h-3 w-3 ml-1" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-6 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-400" />
                Stay Connected
              </h4>
              
              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-slate-300">
                  <Mail className="h-4 w-4 mr-3 text-blue-400" />
                  <span className="text-sm">sayomikun123@gmail.com</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Phone className="h-4 w-4 mr-3 text-green-400" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <MapPin className="h-4 w-4 mr-3 text-purple-400" />
                  <span className="text-sm">San Ramon, CA</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              {/* <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h5 className="font-semibold mb-3 text-sm">Get Career Insights</h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-colors"
                  />
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 rounded-r-lg transition-all duration-200 hover:scale-105">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div> */}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <div className="flex items-center space-x-6 mb-4 md:mb-0">
              <p>&copy; {currentYear} FutureForge. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
                <span>•</span>
                <a href="/terms" className="hover:text-white transition-colors">Terms of Service</a>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-xs">SOC 2 Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;