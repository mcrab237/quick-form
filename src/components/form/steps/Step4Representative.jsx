import { FormInput, FormSelect, FormRadioGroup } from "../FormInput";
import { US_STATES } from "./Step3CompanyAddress";

export function Step4Representative({ formData, updateFormData, errors }) {
  const countryOptions = [{ value: "United States", label: "United States" }];

  const yesNoOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Account Representative
        </h2>
        <p className="text-gray-600">
          Information about the authorized signatory for this account.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormSelect
            label="Country of Residence"
            name="countryOfResidence"
            value={formData.countryOfResidence}
            onChange={updateFormData}
            options={countryOptions}
            error={errors.countryOfResidence}
            required
          />
        </div>

        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={updateFormData}
          error={errors.firstName}
          placeholder="John"
          required
        />

        <FormInput
          label="Middle Name"
          name="middleName"
          value={formData.middleName}
          onChange={updateFormData}
          error={errors.middleName}
          placeholder="(optional)"
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={updateFormData}
          error={errors.lastName}
          placeholder="Doe"
          required
        />

        <FormInput
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={updateFormData}
          error={errors.dateOfBirth}
          helpText="Format: MM/DD/YYYY"
          required
        />

        <div className="md:col-span-2">
          <FormInput
            label="SSN/ITIN (Last 4 digits)"
            name="ssnLast4"
            value={formData.ssnLast4}
            onChange={updateFormData}
            error={errors.ssnLast4}
            placeholder="XXXX"
            maxLength={4}
            helpText="Last 4 digits only. Full SSN may be collected securely later."
            required
          />
        </div>

        <div className="md:col-span-2 border-t pt-4 mt-2">
          <h3 className="font-semibold text-gray-800 mb-4">Home Address</h3>
        </div>

        <div className="md:col-span-2">
          <FormInput
            label="Home Address"
            name="homeAddress"
            value={formData.homeAddress}
            onChange={updateFormData}
            error={errors.homeAddress}
            placeholder="456 Oak Avenue"
            required
          />
        </div>

        <FormInput
          label="City"
          name="homeCity"
          value={formData.homeCity}
          onChange={updateFormData}
          error={errors.homeCity}
          placeholder="New York"
          required
        />

        <FormSelect
          label="State"
          name="homeState"
          value={formData.homeState}
          onChange={updateFormData}
          options={US_STATES}
          error={errors.homeState}
          placeholder="Select a state"
          required
        />

        <FormInput
          label="ZIP Code"
          name="homeZip"
          value={formData.homeZip}
          onChange={updateFormData}
          error={errors.homeZip}
          placeholder="10001"
          maxLength={10}
          required
        />

        <FormInput
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={updateFormData}
          error={errors.phone}
          placeholder="(555) 123-4567"
          required
        />

        <div className="md:col-span-2">
          <FormInput
            label="Role / Job Title"
            name="role"
            value={formData.role}
            onChange={updateFormData}
            error={errors.role}
            placeholder="e.g., Owner, CEO, Managing Partner"
            required
          />
        </div>

        <FormRadioGroup
          label="Do you have significant responsibility for managing the company?"
          name="hasSignificantResponsibility"
          value={formData.hasSignificantResponsibility}
          onChange={updateFormData}
          options={yesNoOptions}
          error={errors.hasSignificantResponsibility}
          required
        />

        <FormRadioGroup
          label="Do you own 25% or more of this company?"
          name="owns25OrMore"
          value={formData.owns25OrMore}
          onChange={updateFormData}
          options={yesNoOptions}
          error={errors.owns25OrMore}
          required
        />
      </div>
    </div>
  );
}
