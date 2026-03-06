import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { FormInput } from "../form/FormInput";
import { CheckCircle, Loader2, AlertCircle, Lock } from "lucide-react";

function generateToken() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return [...Array(32)]
    .map(() => Math.random().toString(36)[2])
    .join("");
}

export function SSNCompletion() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [linkData, setLinkData] = useState(null);
  const [ssn, setSsn] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchLink() {
      if (!token) {
        setError("Invalid link. Missing token.");
        setLoading(false);
        return;
      }
      try {
        const linkRef = doc(db, "ssnCompletionLinks", token);
        const linkSnap = await getDoc(linkRef);
        if (!linkSnap.exists()) {
          setError("This link is invalid or has expired.");
          setLoading(false);
          return;
        }
        const data = linkSnap.data();
        if (data.expiresAt?.toDate?.() < new Date()) {
          setError("This link has expired. Please request a new one.");
          setLoading(false);
          return;
        }
        if (data.used) {
          setError("This link has already been used.");
          setLoading(false);
          return;
        }
        setLinkData({ id: linkSnap.id, ...data });
        setEmail(data.displayData?.email || "");
      } catch (err) {
        console.error("Error fetching SSN completion link:", err);
        setError("Failed to load. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchLink();
  }, [token]);

  const validate = () => {
    const errs = {};
    const ssnDigits = ssn.replace(/-/g, "");
    if (!ssn.trim()) errs.ssn = "SSN/ITIN is required";
    else if (!/^\d{9}$/.test(ssnDigits))
      errs.ssn = "SSN must be 9 digits (e.g. XXX-XX-XXXX)";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Please enter a valid email address";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !linkData) return;
    setSubmitting(true);
    try {
      await updateDoc(
        doc(db, "businessSubmissions", linkData.submissionId),
        {
          ssn: ssn.replace(/-/g, "").length === 9 ? ssn : ssn.replace(/-/g, ""),
          email,
          ssnTokenUsedAt: serverTimestamp(),
          __tokenVerify: token,
        }
      );
      setSubmitted(true);
    } catch (err) {
      console.error("Error updating submission:", err);
      setErrors({ submit: "Failed to save. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const Field = ({ label, value }) => (
    <div className="flex justify-between py-1">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
        {value || "-"}
      </span>
    </div>
  );

  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">{children}</div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Unable to Load</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            Contact support if you need a new link.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Thank You
          </h1>
          <p className="text-gray-600">
            Your SSN and email have been securely saved. You can close this page.
          </p>
        </div>
      </div>
    );
  }

  const d = linkData?.displayData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Information
            </h1>
            <p className="text-gray-600">
              Please enter your full SSN and email below. Your SSN will be
              masked for security.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="font-semibold text-gray-800 mb-4">
              Your submitted information
            </h2>
            <Section title="Business">
              <Field label="Legal Name" value={d.legalBusinessName} />
              <Field label="EIN" value={d.ein} />
              <Field label="DBA" value={d.doingBusinessAs} />
            </Section>
            <Section title="Account Representative">
              <Field
                label="Name"
                value={[d.firstName, d.middleName, d.lastName]
                  .filter(Boolean)
                  .join(" ")}
              />
              <Field label="Phone" value={d.phone} />
              <Field label="Address" value={d.homeAddress} />
            </Section>
            {d.additionalOwners?.length > 0 && (
              <Section title="Additional Owners">
                {d.additionalOwners.map((o, i) => (
                  <div key={i} className="border-b border-gray-200 pb-2 mb-2 last:border-0">
                    <Field label={`Owner ${i + 1}`} value={o.name} />
                  </div>
                ))}
              </Section>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-t border-gray-200 pt-6">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Secure information
              </h2>
              <div className="space-y-4">
                <FormInput
                  label="Full SSN/ITIN"
                  name="ssn"
                  type="password"
                  value={ssn}
                  onChange={(_, v) => setSsn(v)}
                  error={errors.ssn}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  helpText="Enter 9 digits. Your input is hidden for security."
                  required
                />
                <FormInput
                  label="Account Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(_, v) => setEmail(v)}
                  error={errors.email}
                  placeholder="you@company.com"
                  helpText="Used for account login and receiving payments"
                  required
                />
              </div>
            </div>

            {errors.submit && (
              <p className="input-error">{errors.submit}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export { generateToken };
