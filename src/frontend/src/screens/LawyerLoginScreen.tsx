import { VakyomLogo } from "@/components/VakyomLogo";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useActor } from "@/hooks/useActor";
import { motion } from "motion/react";
import { useState } from "react";

interface LawyerLoginScreenProps {
  onSuccess: () => void;
  onBack: () => void;
}

const SPECIALIZATIONS = [
  "Property Law",
  "Criminal Law",
  "Family Law",
  "Corporate Law",
  "Civil Law",
];

export function LawyerLoginScreen({
  onSuccess,
  onBack,
}: LawyerLoginScreenProps) {
  const { actor } = useActor();
  const savedName = localStorage.getItem("vakyom_lawyer_name") || "";
  const [name, setName] = useState(savedName);
  const [phone, setPhone] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required";
    if (!phone.trim() || !/^\d{10}$/.test(phone.trim()))
      e.phone = "10-digit phone required";
    if (!barNumber.trim()) e.barNumber = "Bar Council Number is required";
    if (!specialization) e.specialization = "Specialization is required";
    if (!location.trim()) e.location = "Location is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!actor) {
      setSubmitError("Connecting to backend… please retry.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const ok = await actor.registerLawyer(
        name.trim(),
        phone.trim(),
        barNumber.trim(),
        specialization,
        location.trim(),
      );
      if (ok) {
        localStorage.setItem("vakyom_lawyer_name", name.trim());
        localStorage.setItem("vakyom_role", "lawyer");
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

  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    background: "rgba(255,255,255,0.07)",
    border: `1.5px solid ${hasError ? "rgba(220,50,50,0.8)" : "rgba(212,175,55,0.3)"}`,
    borderRadius: 10,
    color: "#fff",
    padding: "0.65rem 1rem",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });

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
            "radial-gradient(ellipse 70% 50% at 50% 20%, rgba(212,175,55,0.12) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4 my-8"
      >
        <div
          style={{
            background: "rgba(17,25,55,0.72)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212,175,55,0.25)",
            borderRadius: 20,
            boxShadow:
              "0 0 60px rgba(212,175,55,0.1), 0 24px 64px rgba(0,0,0,0.5)",
            padding: "2.5rem 2rem",
          }}
        >
          {/* Back button */}
          <button
            type="button"
            onClick={onBack}
            className="mb-4 text-sm flex items-center gap-1"
            style={{ color: "rgba(212,175,55,0.7)" }}
          >
            ← Back to roles
          </button>

          <div className="flex flex-col items-center gap-3 mb-7">
            <VakyomLogo size={64} />
            <div className="text-center">
              <h1 className="font-display font-bold text-2xl text-gold mb-1">
                Lawyer Registration
              </h1>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Join the Vakyom legal network
              </p>
            </div>
          </div>

          {/* Welcome back banner */}
          {savedName && (
            <div
              className="mb-5 px-4 py-3 rounded-xl text-sm text-center"
              style={{
                background: "rgba(212,175,55,0.1)",
                border: "1px solid rgba(212,175,55,0.35)",
                color: "rgba(212,175,55,0.9)",
              }}
            >
              👋 Welcome back, <strong>{savedName}</strong>! Re-register to
              continue.
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {(
              [
                {
                  id: "lw-name",
                  label: "Full Name",
                  value: name,
                  setter: setName,
                  type: "text",
                  key: "name",
                  placeholder: "Your full legal name",
                },
                {
                  id: "lw-phone",
                  label: "Phone Number",
                  value: phone,
                  setter: (v: string) =>
                    setPhone(v.replace(/\D/g, "").slice(0, 10)),
                  type: "tel",
                  key: "phone",
                  placeholder: "10-digit mobile number",
                },
                {
                  id: "lw-bar",
                  label: "Bar Council Number",
                  value: barNumber,
                  setter: setBarNumber,
                  type: "text",
                  key: "barNumber",
                  placeholder: "e.g. BCI/KAR/2018/1234",
                },
                {
                  id: "lw-loc",
                  label: "Location / City",
                  value: location,
                  setter: setLocation,
                  type: "text",
                  key: "location",
                  placeholder: "City where you practise",
                },
              ] as const
            ).map((field) => (
              <div key={field.key} className="mb-4">
                <Label
                  htmlFor={field.id}
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {field.label}
                </Label>
                <input
                  id={field.id}
                  type={field.type}
                  data-ocid="lawyer_register.input"
                  value={field.value}
                  onChange={(e) =>
                    (field.setter as (v: string) => void)(e.target.value)
                  }
                  placeholder={field.placeholder}
                  style={inputStyle(!!errors[field.key])}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,175,55,0.85)";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(212,175,55,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = errors[field.key]
                      ? "rgba(220,50,50,0.8)"
                      : "rgba(212,175,55,0.3)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                {errors[field.key] && (
                  <p
                    className="mt-1 text-xs"
                    style={{ color: "rgba(255,100,100,0.9)" }}
                  >
                    {errors[field.key]}
                  </p>
                )}
              </div>
            ))}

            {/* Specialization */}
            <div className="mb-5">
              <Label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Specialization
              </Label>
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger
                  data-ocid="lawyer_register.select"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: `1.5px solid ${errors.specialization ? "rgba(220,50,50,0.8)" : "rgba(212,175,55,0.3)"}`,
                    borderRadius: 10,
                    color: specialization ? "#fff" : "rgba(255,255,255,0.4)",
                    padding: "0.65rem 1rem",
                  }}
                >
                  <SelectValue placeholder="Select your specialization" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: "#111933",
                    border: "1px solid rgba(212,175,55,0.3)",
                  }}
                >
                  {SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s} value={s} style={{ color: "#fff" }}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.specialization && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: "rgba(255,100,100,0.9)" }}
                >
                  {errors.specialization}
                </p>
              )}
            </div>

            {submitError && (
              <p
                data-ocid="lawyer_register.error_state"
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
              data-ocid="lawyer_register.submit_button"
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
                transition: "opacity 0.2s",
                boxShadow: isSubmitting
                  ? "none"
                  : "0 4px 20px rgba(212,175,55,0.35)",
              }}
            >
              {isSubmitting ? "Registering…" : "Register as Lawyer →"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
