export function validateStep(step, formData) {
  const errors = {};

  switch (step) {
    case 1:
      if (!formData.businessType) {
        errors.businessType = "Please select a business type";
      }
      if (!formData.hasEinAndBankAccount) {
        errors.hasEinAndBankAccount = "Please answer this question";
      }
      break;

    case 2:
      if (!formData.legalBusinessName?.trim()) {
        errors.legalBusinessName = "Legal business name is required";
      }
      if (!formData.ein?.trim()) {
        errors.ein = "EIN is required";
      } else if (!/^\d{2}-?\d{7}$/.test(formData.ein.replace(/-/g, ""))) {
        errors.ein = "EIN must be in format XX-XXXXXXX";
      }
      if (!formData.businessDescription?.trim()) {
        errors.businessDescription = "Business description is required";
      }
      if (!formData.statementDescriptor?.trim()) {
        errors.statementDescriptor = "Statement descriptor is required";
      } else if (
        formData.statementDescriptor.length < 5 ||
        formData.statementDescriptor.length > 19
      ) {
        errors.statementDescriptor =
          "Statement descriptor must be 5-19 characters";
      }
      if (!formData.industry) {
        errors.industry = "Please select an industry";
      }
      if (!formData.productsServices?.trim()) {
        errors.productsServices = "Products/services description is required";
      } else if (formData.productsServices.length < 10) {
        errors.productsServices = "Must be at least 10 characters";
      }
      break;

    case 3:
      if (!formData.address?.trim()) {
        errors.address = "Street address is required";
      }
      if (!formData.city?.trim()) {
        errors.city = "City is required";
      }
      if (!formData.state) {
        errors.state = "Please select a state";
      }
      if (!formData.zip?.trim()) {
        errors.zip = "ZIP code is required";
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
        errors.zip = "Please enter a valid ZIP code";
      }
      if (!formData.companyPhone?.trim()) {
        errors.companyPhone = "Company phone is required";
      }
      break;

    case 4:
      if (!formData.countryOfResidence) {
        errors.countryOfResidence = "Country is required";
      }
      if (!formData.firstName?.trim()) {
        errors.firstName = "First name is required";
      }
      if (!formData.lastName?.trim()) {
        errors.lastName = "Last name is required";
      }
      if (!formData.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required";
      }
      const ssnDigits = formData.ssn?.replace(/-/g, "");
      if (!formData.ssn?.trim()) {
        errors.ssn = "SSN/ITIN is required";
      } else if (!/^\d{9}$/.test(ssnDigits)) {
        errors.ssn = "SSN must be 9 digits (e.g. XXX-XX-XXXX)";
      }
      if (!formData.homeAddress?.trim()) {
        errors.homeAddress = "Home address is required";
      }
      if (!formData.homeCity?.trim()) {
        errors.homeCity = "City is required";
      }
      if (!formData.homeState) {
        errors.homeState = "Please select a state";
      }
      if (!formData.homeZip?.trim()) {
        errors.homeZip = "ZIP code is required";
      }
      if (!formData.phone?.trim()) {
        errors.phone = "Phone is required";
      }
      if (!formData.email?.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
      }
      if (!formData.role?.trim()) {
        errors.role = "Role/job title is required";
      }
      if (!formData.hasSignificantResponsibility) {
        errors.hasSignificantResponsibility = "Please answer this question";
      }
      if (!formData.owns25OrMore) {
        errors.owns25OrMore = "Please answer this question";
      }
      break;

    case 5:
      // Validate each additional owner if any exist
      formData.additionalOwners?.forEach((owner) => {
        if (!owner.name?.trim()) {
          errors[`owner-${owner.id}-name`] = "Name is required";
        }
        if (!owner.dob) {
          errors[`owner-${owner.id}-dob`] = "Date of birth is required";
        }
        if (!owner.address?.trim()) {
          errors[`owner-${owner.id}-address`] = "Address is required";
        }
        if (!owner.ownershipPercent) {
          errors[`owner-${owner.id}-ownership`] =
            "Ownership percentage is required";
        } else if (
          owner.ownershipPercent < 25 ||
          owner.ownershipPercent > 100
        ) {
          errors[`owner-${owner.id}-ownership`] = "Must be between 25 and 100";
        }
        if (!owner.role?.trim()) {
          errors[`owner-${owner.id}-role`] = "Role is required";
        }
        if (!owner.phone?.trim()) {
          errors[`owner-${owner.id}-phone`] = "Phone is required";
        }
        if (owner.ssn?.trim()) {
          const ownerSsnDigits = owner.ssn.replace(/-/g, "");
          if (!/^\d{9}$/.test(ownerSsnDigits)) {
            errors[`owner-${owner.id}-ssn`] =
              "SSN must be 9 digits (e.g. XXX-XX-XXXX)";
          }
        }
      });
      break;

    case 6:
      if (!formData.routingNumber?.trim()) {
        errors.routingNumber = "Routing number is required";
      } else if (!/^\d{9}$/.test(formData.routingNumber)) {
        errors.routingNumber = "Routing number must be 9 digits";
      }
      if (!formData.accountNumber?.trim()) {
        errors.accountNumber = "Account number is required";
      }
      if (!formData.confirmAccountNumber?.trim()) {
        errors.confirmAccountNumber = "Please confirm your account number";
      } else if (formData.accountNumber !== formData.confirmAccountNumber) {
        errors.confirmAccountNumber = "Account numbers do not match";
      }
      break;

    default:
      break;
  }

  return errors;
}
