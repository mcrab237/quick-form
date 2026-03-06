import { Plus, Trash2, Users } from "lucide-react";
import { FormInput } from "../FormInput";

export function Step5AdditionalOwners({
  formData,
  updateFormData,
  addOwner,
  updateOwner,
  removeOwner,
  errors,
}) {
  const handleOwnerChange = (ownerId, field, value) => {
    updateOwner(ownerId, field, value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Additional Owners
        </h2>
        <p className="text-gray-600">
          Add any additional owners who own 25% or more of the company, or are
          key managers.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> You only need to add owners who hold 25% or
          more equity, or who have significant management responsibilities. If
          there are no additional owners, you can skip this step.
        </p>
      </div>

      {formData.additionalOwners.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No additional owners added yet</p>
          <button
            type="button"
            onClick={addOwner}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Owner
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {formData.additionalOwners.map((owner, index) => (
            <div
              key={owner.id}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">
                  Owner {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeOwner(owner.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove owner"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Full Name"
                  name={`owner-${owner.id}-name`}
                  value={owner.name}
                  onChange={(_, value) =>
                    handleOwnerChange(owner.id, "name", value)
                  }
                  error={errors[`owner-${owner.id}-name`]}
                  placeholder="Full legal name"
                  required
                />

                <FormInput
                  label="Date of Birth"
                  name={`owner-${owner.id}-dob`}
                  type="date"
                  value={owner.dob}
                  onChange={(_, value) =>
                    handleOwnerChange(owner.id, "dob", value)
                  }
                  error={errors[`owner-${owner.id}-dob`]}
                  required
                />

                <div className="md:col-span-2">
                  <FormInput
                    label="Address"
                    name={`owner-${owner.id}-address`}
                    value={owner.address}
                    onChange={(_, value) =>
                      handleOwnerChange(owner.id, "address", value)
                    }
                    error={errors[`owner-${owner.id}-address`]}
                    placeholder="Full address (street, city, state, zip)"
                    required
                  />
                </div>

                <FormInput
                  label="Ownership Percentage"
                  name={`owner-${owner.id}-ownership`}
                  type="number"
                  value={owner.ownershipPercent}
                  onChange={(_, value) =>
                    handleOwnerChange(owner.id, "ownershipPercent", value)
                  }
                  error={errors[`owner-${owner.id}-ownership`]}
                  placeholder="e.g., 25"
                  helpText="Enter percentage (25-100)"
                  required
                />

                <FormInput
                  label="Role / Title"
                  name={`owner-${owner.id}-role`}
                  value={owner.role}
                  onChange={(_, value) =>
                    handleOwnerChange(owner.id, "role", value)
                  }
                  error={errors[`owner-${owner.id}-role`]}
                  placeholder="e.g., Partner, Director"
                  required
                />

                <FormInput
                  label="Phone"
                  name={`owner-${owner.id}-phone`}
                  type="tel"
                  value={owner.phone}
                  onChange={(_, value) =>
                    handleOwnerChange(owner.id, "phone", value)
                  }
                  error={errors[`owner-${owner.id}-phone`]}
                  placeholder="(555) 123-4567"
                  required
                />

                <FormInput
                  label="SSN/ITIN (Full)"
                  name={`owner-${owner.id}-ssn`}
                  value={owner.ssn}
                  onChange={(_, value) =>
                    handleOwnerChange(owner.id, "ssn", value)
                  }
                  error={errors[`owner-${owner.id}-ssn`]}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  helpText="9 digits. Enter as XXX-XX-XXXX or 9 digits."
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addOwner}
            className="btn-secondary w-full inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Another Owner
          </button>
        </div>
      )}
    </div>
  );
}
