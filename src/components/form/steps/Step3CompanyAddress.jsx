import { FormInput, FormSelect } from "../FormInput";

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

export function Step3CompanyAddress({ formData, updateFormData, errors }) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Company Address
        </h2>
        <p className="text-gray-600">Enter your business's physical address.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormInput
            label="Street Address"
            name="address"
            value={formData.address}
            onChange={updateFormData}
            error={errors.address}
            placeholder="123 Main Street"
            required
          />
        </div>

        <div className="md:col-span-2">
          <FormInput
            label="Apt/Suite/Unit"
            name="aptUnit"
            value={formData.aptUnit}
            onChange={updateFormData}
            error={errors.aptUnit}
            placeholder="Suite 100 (optional)"
          />
        </div>

        <FormInput
          label="City"
          name="city"
          value={formData.city}
          onChange={updateFormData}
          error={errors.city}
          placeholder="New York"
          required
        />

        <FormSelect
          label="State"
          name="state"
          value={formData.state}
          onChange={updateFormData}
          options={US_STATES}
          error={errors.state}
          placeholder="Select a state"
          required
        />

        <FormInput
          label="ZIP Code"
          name="zip"
          value={formData.zip}
          onChange={updateFormData}
          error={errors.zip}
          placeholder="10001"
          maxLength={10}
          required
        />

        <FormInput
          label="Company Phone"
          name="companyPhone"
          type="tel"
          value={formData.companyPhone}
          onChange={updateFormData}
          error={errors.companyPhone}
          placeholder="(555) 123-4567"
          required
        />
      </div>
    </div>
  );
}

export { US_STATES };
