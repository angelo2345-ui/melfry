import React from "react";

// Pequeño kit de UI reutilizable para el panel de administración (tema oscuro)

export const Card = ({ title, actions, children, className = "" }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-2xl ${className}`}>
    {(title || actions) && (
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
        {title && <h3 className="text-white font-semibold">{title}</h3>}
        {actions}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-gray-400 mt-1">{subtitle}</p>}
    </div>
    {actions && <div className="flex gap-3">{actions}</div>}
  </div>
);

const variants = {
  primary: "bg-orange-500 text-white hover:bg-orange-600",
  secondary: "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-gray-300 hover:text-white hover:bg-gray-800",
};

export const Button = ({ variant = "primary", className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    {...props}
  />
);

const statusColors = {
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  orange: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
  blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  gray: "bg-gray-500/15 text-gray-300 border-gray-500/30",
};

export const Badge = ({ color = "gray", children }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[color] || statusColors.gray}`}>
    {children}
  </span>
);

export const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-gray-300 mb-1">
    {children} {required && <span className="text-orange-500">*</span>}
  </label>
);

const inputBase =
  "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-500";

export const Input = ({ label, required, className = "", ...props }) => (
  <div className={className}>
    {label && <Label required={required}>{label}</Label>}
    <input className={inputBase} required={required} {...props} />
  </div>
);

export const Select = ({ label, required, children, className = "", ...props }) => (
  <div className={className}>
    {label && <Label required={required}>{label}</Label>}
    <select className={inputBase} required={required} {...props}>
      {children}
    </select>
  </div>
);

export const Textarea = ({ label, required, className = "", ...props }) => (
  <div className={className}>
    {label && <Label required={required}>{label}</Label>}
    <textarea className={inputBase} required={required} {...props} />
  </div>
);

export const Modal = ({ open, onClose, title, children, footer, size = "max-w-lg" }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`bg-gray-900 border border-gray-800 rounded-2xl w-full ${size} my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-800">{footer}</div>}
      </div>
    </div>
  );
};

export const EmptyState = ({ message, action }) => (
  <div className="text-center py-16">
    <p className="text-gray-400 mb-4">{message}</p>
    {action}
  </div>
);

export const Spinner = ({ label = "Cargando..." }) => (
  <div className="text-center py-16 text-gray-400">{label}</div>
);

export const ErrorText = ({ children }) =>
  children ? <p className="text-red-400 text-sm mb-4">{children}</p> : null;
