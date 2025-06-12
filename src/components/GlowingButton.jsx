import { NavLink } from 'react-router-dom';

const GlowingButton = ({ to, children, primary = false, className = "" }) => (
  <NavLink
    to={to}
    className={`
      group relative inline-flex items-center justify-center 
      px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 
      ${primary 
        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-2xl' 
        : 'bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20'
      }
      ${className}
    `}
  >
    {/* Glowing background */}
    <span className="absolute inset-0 z-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
    
    {/* Glow blur background */}
    <span className="absolute inset-0 z-[-1] rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />

    {/* Button text and icon */}
    <span className="relative flex items-center">
      {children}
    </span>
  </NavLink>
);

export default GlowingButton;