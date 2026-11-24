import React from "react";
import { X } from "lucide-react";

// Kit de UI del panel de administración (usa los tokens del sistema de diseño)

export const Card = ({ title, actions, children, className = "" }) => (
  <div className={`surface animate-fade-up ${className}`}>
    {(title || actions) && (
      <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-border">
        {title && <h3 className="font-display text-base font-semibold tracking-tight text-foreground">{title}</h3>}
        {actions}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 animate-fade-up">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary mb-2">Melfry · Admin</p>
      <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-2 max-w-xl">{subtitle}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
  </div>
);

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-soft)]",
  secondary: "bg-card text-foreground border border-border hover:bg-muted",
  danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
};

export const Button = ({ variant = "primary", className = "", ...props }) => (
  <button
    className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
    {...props}
  />
);

const statusColors = {
  green: "bg-success/10 text-success",
  orange: "bg-primary/10 text-primary",
  red: "bg-destructive/10 text-destructive",
  blue: "bg-info/10 text-info",
  gray: "bg-muted text-muted-foreground",
};

export const Badge = ({ color = "gray", children }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${statusColors[color] || statusColors.gray}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {children}
  </span>
);

export const Label = ({ children, required }) => (
  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
    {children} {required && <span className="text-primary">*</span>}
  </label>
);

const inputBase =
  "w-full bg-card border border-input text-foreground rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition placeholder:text-muted-foreground";

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
      className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`surface w-full ${size} my-8 animate-fade-up shadow-[var(--shadow-lift)]`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-border bg-muted/40 rounded-b-[var(--radius-xl)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const EmptyState = ({ message, action }) => (
  <div className="text-center py-14 px-4 rounded-lg border border-dashed border-border bg-muted/30">
    <p className="text-muted-foreground mb-4 text-sm">{message}</p>
    {action}
  </div>
);

export const Spinner = ({ label = "Cargando..." }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted-foreground">
    <span className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    {label}
  </div>
);

export const ErrorText = ({ children }) =>
  children ? (
    <p className="text-destructive text-sm mb-4 rounded-lg bg-destructive/10 px-3 py-2">{children}</p>
  ) : null;
