import { VakyomLogo } from "@/components/VakyomLogo";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { Briefcase, Shield, User } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

type Role = "user" | "lawyer" | "admin";

interface LoginScreenProps {
  onSuccess: () => void;
  onLawyerLogin: () => void;
  onAdminLogin: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export function LoginScreen({
  onSuccess,
  onLawyerLogin,
  onAdminLogin,
}: LoginScreenProps) {
  const { actor } = useActor();
  const [role, setRole] = useState<Role>("user");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const particlesRef = useRef<Particle[]>([]);

  if (particlesRef.current.length === 0) {
    particlesRef.current = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 4,
    }));
  }

  const handleRoleSelect = (r: Role) => {
    if (r === "lawyer") {
      onLawyerLogin();
      return;
    }
    if (r === "admin") {
      onAdminLogin();
      return;
    }
    setRole(r);
  };

  const validate = () => {
    const newErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!actor) {
      setSubmitError("Connecting to backend… please try again.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const ok = await actor.registerOrUpdateUser(name.trim(), phone.trim());
      if (ok) {
        localStorage.setItem("vakyom_user_name", name.trim());
        localStorage.setItem("vakyom_role", "user");
        onSuccess();
      } else {
        setSubmitError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ROLES: {
    id: Role;
    label: string;
    icon: React.ElementType;
    desc: string;
  }[] = [
    { id: "user", label: "User", icon: User, desc: "Seek legal help" },
    { id: "lawyer", label: "Lawyer", icon: Briefcase, desc: "Join as counsel" },
    { id: "admin", label: "Admin", icon: Shield, desc: "Platform control" },
  ];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#0a0f1e" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(212,175,55,0.12) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(212,175,55,0.07) 0%, transparent 60%)",
        }}
      />

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {particlesRef.current.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              backgroundColor: "oklch(var(--gold))",
            }}
            animate={{
              y: ["-12px", "12px", "-12px"],
              opacity: [p.opacity, p.opacity * 0.3, p.opacity],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div
          style={{
            background: "rgba(17,25,55,0.72)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: 20,
            boxShadow:
              "0 0 60px rgba(212,175,55,0.1), 0 24px 64px rgba(0,0,0,0.5)",
            padding: "2.5rem 2rem",
          }}
        >
          {/* Logo + heading */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5, ease: "backOut" }}
            >
              <VakyomLogo size={72} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="text-center"
            >
              <h1
                className="font-display font-bold text-3xl text-gold mb-1"
                style={{ letterSpacing: "0.01em" }}
              >
                Welcome to Vakyom
              </h1>
              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                Your trusted legal companion
              </p>
            </motion.div>
          </div>

          {/* Role selector */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-6"
          >
            <p
              className="text-xs text-center mb-3"
              style={{
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              I am a
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  data-ocid={`login.${r.id}.toggle`}
                  onClick={() => handleRoleSelect(r.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "0.75rem 0.5rem",
                    borderRadius: 12,
                    border: `1.5px solid ${role === r.id ? "rgba(212,175,55,0.8)" : "rgba(212,175,55,0.2)"}`,
                    background:
                      role === r.id
                        ? "rgba(212,175,55,0.12)"
                        : "rgba(255,255,255,0.04)",
                    color:
                      role === r.id
                        ? "oklch(0.72 0.14 78)"
                        : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow:
                      role === r.id ? "0 0 12px rgba(212,175,55,0.2)" : "none",
                  }}
                >
                  <r.icon size={18} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    {r.label}
                  </span>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    {r.desc}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* User form (only shown when role === "user") */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="mb-5">
              <Label
                htmlFor="login-name"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Full Name
              </Label>
              <input
                id="login-name"
                type="text"
                data-ocid="login.input"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name)
                    setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder="Enter your full name"
                autoComplete="name"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.07)",
                  border: `1.5px solid ${errors.name ? "rgba(220,50,50,0.8)" : "rgba(212,175,55,0.3)"}`,
                  borderRadius: 10,
                  color: "#fff",
                  padding: "0.65rem 1rem",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.85)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(212,175,55,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.name
                    ? "rgba(220,50,50,0.8)"
                    : "rgba(212,175,55,0.3)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {errors.name && (
                <p
                  data-ocid="login.error_state"
                  className="mt-1 text-xs"
                  style={{ color: "rgba(255,100,100,0.9)" }}
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="mb-6">
              <Label
                htmlFor="login-phone"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Phone Number
              </Label>
              <input
                id="login-phone"
                type="tel"
                inputMode="numeric"
                data-ocid="login.input"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder="10-digit mobile number"
                autoComplete="tel"
                maxLength={10}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.07)",
                  border: `1.5px solid ${errors.phone ? "rgba(220,50,50,0.8)" : "rgba(212,175,55,0.3)"}`,
                  borderRadius: 10,
                  color: "#fff",
                  padding: "0.65rem 1rem",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,55,0.85)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(212,175,55,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = errors.phone
                    ? "rgba(220,50,50,0.8)"
                    : "rgba(212,175,55,0.3)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
              {errors.phone && (
                <p
                  data-ocid="login.error_state"
                  className="mt-1 text-xs"
                  style={{ color: "rgba(255,100,100,0.9)" }}
                >
                  {errors.phone}
                </p>
              )}
            </div>

            {submitError && (
              <p
                data-ocid="login.error_state"
                className="mb-4 text-center text-sm px-3 py-2 rounded-lg"
                style={{
                  background: "rgba(220,50,50,0.12)",
                  border: "1px solid rgba(220,50,50,0.3)",
                  color: "rgba(255,120,120,0.95)",
                }}
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              data-ocid="login.submit_button"
              disabled={isSubmitting}
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: 10,
                border: "none",
                background: isSubmitting
                  ? "rgba(212,175,55,0.4)"
                  : "linear-gradient(135deg, #d4af37 0%, #f0d060 50%, #c9942a 100%)",
                color: isSubmitting ? "rgba(10,15,30,0.6)" : "#0a0f1e",
                fontWeight: 700,
                fontSize: "1rem",
                fontFamily: "inherit",
                letterSpacing: "0.04em",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                transition: "opacity 0.2s, transform 0.15s",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 4px 20px rgba(212,175,55,0.35)",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 28px rgba(212,175,55,0.5)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isSubmitting
                  ? "none"
                  : "0 4px 20px rgba(212,175,55,0.35)";
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeDasharray="40 60"
                      strokeLinecap="round"
                    />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Get Started →"
              )}
            </button>
          </motion.form>

          <p
            className="mt-6 text-center text-xs"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            By continuing you agree to receive legal guidance via WhatsApp
          </p>
        </div>
      </motion.div>
    </div>
  );
}
