import { CheckCircle2, Edit3, AlertTriangle } from "lucide-react";

export function Step7Review({ formData, goToStep }) {
  const formatYesNo = (value) =>
    value === "yes" ? "Yes" : value === "no" ? "No" : "-";

  const formatBusinessType = (value) => {
    const types = {
      partnership: "Partnership",
      llc: "LLC (Limited Liability Company)",
      corporation: "Corporation",
    };
    return types[value] || value;
  };

  const Section = ({ title, stepNumber, children }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <button
          type="button"
          onClick={() => goToStep(stepNumber)}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center gap-1"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </button>
      </div>
      <div className="p-4 space-y-2">{children}</div>
    </div>
  );

  const Field = ({ label, value, sensitive = false }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between py-1">
      <span className="text-gray-600 text-sm">{label}:</span>
      <span className="font-medium text-gray-900 text-sm sm:text-right">
        {sensitive && value ? "••••" + value.slice(-4) : value || "-"}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Information
        </h2>
        <p className="text-gray-600">
          Please review all your information before submitting.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mb-6">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-amber-800 text-sm">
          Please verify all information is accurate. Once submitted, you may
          need to contact support to make changes.
        </p>
      </div>

      <Section title="Business Type" stepNumber={1}>
        <Field
          label="Business Type"
          value={formatBusinessType(formData.businessType)}
        />
        <Field
          label="EIN & Bank Account in Place"
          value={formatYesNo(formData.hasEinAndBankAccount)}
        />
      </Section>

      <Section title="Business Information" stepNumber={2}>
        <Field label="Legal Business Name" value={formData.legalBusinessName} />
        <Field label="EIN" value={formData.ein} />
        <Field label="DBA" value={formData.doingBusinessAs} />
        <Field
          label="Business Description"
          value={formData.businessDescription}
        />
        <Field
          label="Statement Descriptor"
          value={formData.statementDescriptor}
        />
        <Field label="Industry" value={formData.industry} />
        <Field label="Products/Services" value={formData.productsServices} />
      </Section>

      <Section title="Company Address" stepNumber={3}>
        <Field
          label="Address"
          value={`${formData.address}${
            formData.aptUnit ? ", " + formData.aptUnit : ""
          }`}
        />
        <Field
          label="City, State ZIP"
          value={`${formData.city}, ${formData.state} ${formData.zip}`}
        />
        <Field label="Company Phone" value={formData.companyPhone} />
      </Section>

      <Section title="Account Representative" stepNumber={4}>
        <Field label="Country" value={formData.countryOfResidence} />
        <Field
          label="Name"
          value={`${formData.firstName} ${formData.middleName} ${formData.lastName}`
            .replace(/\s+/g, " ")
            .trim()}
        />
        <Field label="Date of Birth" value={formData.dateOfBirth} />
        <Field label="SSN/ITIN (Last 4)" value={formData.ssnLast4} sensitive />
        <Field
          label="Home Address"
          value={`${formData.homeAddress}, ${formData.homeCity}, ${formData.homeState} ${formData.homeZip}`}
        />
        <Field label="Phone" value={formData.phone} />
        <Field label="Role" value={formData.role} />
        <Field
          label="Significant Responsibility"
          value={formatYesNo(formData.hasSignificantResponsibility)}
        />
        <Field
          label="Owns 25% or More"
          value={formatYesNo(formData.owns25OrMore)}
        />
      </Section>

      {formData.additionalOwners.length > 0 && (
        <Section title="Additional Owners" stepNumber={5}>
          {formData.additionalOwners.map((owner, index) => (
            <div
              key={owner.id}
              className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0"
            >
              <p className="font-medium text-gray-800 mb-2">
                Owner {index + 1}
              </p>
              <Field label="Name" value={owner.name} />
              <Field label="DOB" value={owner.dob} />
              <Field label="Address" value={owner.address} />
              <Field label="Ownership %" value={`${owner.ownershipPercent}%`} />
              <Field label="Role" value={owner.role} />
              <Field label="Phone" value={owner.phone} />
              {owner.ssnLast4 && (
                <Field label="SSN (Last 4)" value={owner.ssnLast4} sensitive />
              )}
            </div>
          ))}
        </Section>
      )}

      <Section title="Payout Bank Account" stepNumber={6}>
        <Field label="Routing Number" value={formData.routingNumber} />
        <Field
          label="Account Number"
          value={formData.accountNumber}
          sensitive
        />
      </Section>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
        <p className="text-green-800 text-sm">
          <strong>Ready to submit?</strong> Click the "Submit" button below to
          securely send your information.
        </p>
      </div>
    </div>
  );
}
