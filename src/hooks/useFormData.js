import { useState } from "react";

const initialFormData = {
  // Business Type
  businessType: "",
  hasEinAndBankAccount: "",

  // Business Information
  legalBusinessName: "",
  ein: "",
  doingBusinessAs: "",
  businessDescription: "",
  statementDescriptor: "",
  industry: "",
  productsServices: "",

  // Company Address
  address: "",
  aptUnit: "",
  city: "",
  state: "",
  zip: "",
  companyPhone: "",

  // Account Representative
  countryOfResidence: "United States",
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  ssn: "",
  homeAddress: "",
  homeCity: "",
  homeState: "",
  homeZip: "",
  phone: "",
  email: "",
  role: "",
  hasSignificantResponsibility: "",
  owns25OrMore: "",

  // Additional Owners
  additionalOwners: [],

  // Payout Bank Account
  routingNumber: "",
  accountNumber: "",
  confirmAccountNumber: "",
};

export function useFormData() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addOwner = () => {
    setFormData((prev) => ({
      ...prev,
      additionalOwners: [
        ...prev.additionalOwners,
        {
          id: Date.now(),
          name: "",
          dob: "",
          address: "",
          ownershipPercent: "",
          role: "",
          phone: "",
          ssn: "",
        },
      ],
    }));
  };

  const updateOwner = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      additionalOwners: prev.additionalOwners.map((owner) =>
        owner.id === id ? { ...owner, [field]: value } : owner
      ),
    }));
  };

  const removeOwner = (id) => {
    setFormData((prev) => ({
      ...prev,
      additionalOwners: prev.additionalOwners.filter(
        (owner) => owner.id !== id
      ),
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    updateFormData,
    errors,
    setErrors,
    addOwner,
    updateOwner,
    removeOwner,
    resetForm,
  };
}
