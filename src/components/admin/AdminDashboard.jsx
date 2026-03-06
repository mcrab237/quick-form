import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  RefreshCw,
  Eye,
  X,
  CheckCircle,
  Clock,
  Building2,
  Users,
  FileText,
  Loader2,
  Send,
} from "lucide-react";
import { generateToken } from "../ssn/SSNCompletion";

export function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [resendingFor, setResendingFor] = useState(null);

  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    try {
      const q = query(
        collection(db, "businessSubmissions"),
        orderBy("submittedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        submittedAt: doc.data().submittedAt?.toDate(),
      }));
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSubmissions();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleResendForSSN = async (submission) => {
    setResendingFor(submission.id);
    try {
      const token = generateToken();
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/complete-ssn/${token}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      // Only include defined values - Firestore rejects undefined
      const displayData = {};
      if (submission.legalBusinessName != null)
        displayData.legalBusinessName = submission.legalBusinessName;
      if (submission.ein != null) displayData.ein = submission.ein;
      if (submission.doingBusinessAs != null)
        displayData.doingBusinessAs = submission.doingBusinessAs;
      if (submission.firstName != null) displayData.firstName = submission.firstName;
      if (submission.middleName != null) displayData.middleName = submission.middleName;
      if (submission.lastName != null) displayData.lastName = submission.lastName;
      if (submission.phone != null) displayData.phone = submission.phone;
      if (submission.email != null) displayData.email = submission.email;
      if (submission.homeAddress != null) {
        displayData.homeAddress = [
          submission.homeAddress,
          submission.homeCity,
          submission.homeState,
          submission.homeZip,
        ]
          .filter(Boolean)
          .join(", ");
      }
      if (submission.additionalOwners?.length > 0) {
        displayData.additionalOwners = submission.additionalOwners
          .map((o) => (o.name != null ? { name: o.name } : null))
          .filter(Boolean);
      }

      await setDoc(doc(db, "ssnCompletionLinks", token), {
        submissionId: submission.id,
        displayData,
        expiresAt,
        used: false,
      });

      await updateDoc(doc(db, "businessSubmissions", submission.id), {
        ssnCompletionToken: token,
        ssnTokenExpiresAt: expiresAt,
      });

      await navigator.clipboard.writeText(link);
      alert(
        "Link copied to clipboard! Send this to the submitter so they can enter their full SSN and email.\n\nLink expires in 7 days."
      );
    } catch (err) {
      console.error("Error generating resend link:", err);
      alert("Failed to generate link. Please try again.");
    } finally {
      setResendingFor(null);
    }
  };

  const handleMarkReviewed = async (submissionId) => {
    try {
      await updateDoc(doc(db, "businessSubmissions", submissionId), {
        reviewed: true,
        status: "reviewed",
      });
      await fetchSubmissions();
      if (selectedSubmission?.id === submissionId) {
        setSelectedSubmission((prev) => ({
          ...prev,
          reviewed: true,
          status: "reviewed",
        }));
      }
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatBusinessType = (value) => {
    const types = {
      partnership: "Partnership",
      llc: "LLC",
      corporation: "Corporation",
    };
    return types[value] || value;
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter((s) => !s.reviewed).length,
    reviewed: submissions.filter((s) => s.reviewed).length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Refresh"
              >
                <RefreshCw
                  className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Submissions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Reviewed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.reviewed}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Business Submissions
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No submissions yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Business
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Representative
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="font-medium text-gray-900">
                            {submission.legalBusinessName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {submission.ein}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatBusinessType(submission.businessType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm text-gray-900">
                            {submission.firstName} {submission.lastName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {submission.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            submission.reviewed
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {submission.reviewed ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Reviewed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetail
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onMarkReviewed={handleMarkReviewed}
          onResendForSSN={handleResendForSSN}
          formatDate={formatDate}
          resendingFor={resendingFor}
        />
      )}
    </div>
  );
}

function SubmissionDetail({
  submission,
  onClose,
  onMarkReviewed,
  onResendForSSN,
  formatDate,
  resendingFor,
}) {
  const Section = ({ title, children }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="bg-gray-50 rounded-lg p-4 space-y-2">{children}</div>
    </div>
  );

  const Field = ({ label, value, sensitive = false }) => (
    <div className="flex justify-between py-1">
      <span className="text-sm text-gray-600">{label}:</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
        {sensitive && value ? "••••" + String(value).slice(-4) : value || "-"}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {submission.legalBusinessName}
            </h2>
            <p className="text-sm text-gray-500">ID: {submission.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <Section title="Business Type">
            <Field label="Type" value={submission.businessType} />
            <Field
              label="EIN & Bank in Place"
              value={submission.hasEinAndBankAccount}
            />
          </Section>

          <Section title="Business Information">
            <Field label="Legal Name" value={submission.legalBusinessName} />
            <Field label="EIN" value={submission.ein} />
            <Field label="DBA" value={submission.doingBusinessAs} />
            <Field label="Description" value={submission.businessDescription} />
            <Field
              label="Statement Descriptor"
              value={submission.statementDescriptor}
            />
            <Field label="Industry" value={submission.industry} />
            <Field
              label="Products/Services"
              value={submission.productsServices}
            />
          </Section>

          <Section title="Company Address">
            <Field
              label="Address"
              value={`${submission.address}${
                submission.aptUnit ? ", " + submission.aptUnit : ""
              }`}
            />
            <Field
              label="City, State ZIP"
              value={`${submission.city}, ${submission.state} ${submission.zip}`}
            />
            <Field label="Phone" value={submission.companyPhone} />
          </Section>

          <Section title="Account Representative">
            <Field
              label="Name"
              value={`${submission.firstName} ${submission.middleName || ""} ${
                submission.lastName
              }`.trim()}
            />
            <Field label="Country" value={submission.countryOfResidence} />
            <Field label="DOB" value={submission.dateOfBirth} />
            <Field label="SSN" value={submission.ssn || submission.ssnLast4} />
            <Field
              label="Home Address"
              value={`${submission.homeAddress}, ${submission.homeCity}, ${submission.homeState} ${submission.homeZip}`}
            />
            <Field label="Phone" value={submission.phone} />
            <Field label="Email" value={submission.email} />
            <Field label="Role" value={submission.role} />
            <Field
              label="Significant Responsibility"
              value={submission.hasSignificantResponsibility}
            />
            <Field label="Owns 25%+" value={submission.owns25OrMore} />
          </Section>

          {submission.additionalOwners?.length > 0 && (
            <Section title="Additional Owners">
              {submission.additionalOwners.map((owner, idx) => (
                <div
                  key={owner.id || idx}
                  className="border-b border-gray-200 pb-3 mb-3 last:border-0"
                >
                  <p className="font-medium text-gray-800 mb-2">
                    Owner {idx + 1}
                  </p>
                  <Field label="Name" value={owner.name} />
                  <Field label="DOB" value={owner.dob} />
                  <Field label="Address" value={owner.address} />
                  <Field
                    label="Ownership %"
                    value={`${owner.ownershipPercent}%`}
                  />
                  <Field label="Role" value={owner.role} />
                  <Field label="Phone" value={owner.phone} />
                  {(owner.ssn || owner.ssnLast4) && (
                    <Field label="SSN" value={owner.ssn || owner.ssnLast4} />
                  )}
                </div>
              ))}
            </Section>
          )}

          <Section title="Bank Account">
            <Field label="Routing Number" value={submission.routingNumber} />
            <Field label="Account Number" value={submission.accountNumber} />
          </Section>

          <Section title="Submission Info">
            <Field
              label="Submitted At"
              value={formatDate(submission.submittedAt)}
            />
            <Field
              label="Status"
              value={submission.reviewed ? "Reviewed" : "Pending"}
            />
          </Section>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between flex-wrap gap-3 flex-shrink-0">
          <button
            onClick={() => onResendForSSN(submission)}
            disabled={resendingFor === submission.id}
            className="btn-secondary inline-flex items-center gap-2"
          >
            {resendingFor === submission.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Resend for SSN &amp; Email
          </button>
          <div className="flex gap-3">
            {!submission.reviewed && (
              <button
                onClick={() => onMarkReviewed(submission.id)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark as Reviewed
              </button>
            )}
            <button onClick={onClose} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
