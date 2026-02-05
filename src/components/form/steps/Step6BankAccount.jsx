import { FormInput } from "../FormInput";
import { AlertCircle, Shield } from "lucide-react";

export function Step6BankAccount({ formData, updateFormData, errors }) {
  const accountsMatch =
    formData.accountNumber &&
    formData.confirmAccountNumber &&
    formData.accountNumber === formData.confirmAccountNumber;

  const accountsMismatch =
    formData.accountNumber &&
    formData.confirmAccountNumber &&
    formData.accountNumber !== formData.confirmAccountNumber;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payout Bank Account
        </h2>
        <p className="text-gray-600">
          Enter your business bank account details for receiving payouts.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-green-800 text-sm font-medium">
            Your information is secure
          </p>
          <p className="text-green-700 text-sm mt-1">
            All data is encrypted and stored securely. We use industry-standard
            security measures to protect your banking information.
          </p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-amber-800 text-sm font-medium">
            Business account required
          </p>
          <p className="text-amber-700 text-sm mt-1">
            Please enter a business bank account, not a personal account. The
            account must be in the name of your registered business.
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <FormInput
          label="Routing Number"
          name="routingNumber"
          value={formData.routingNumber}
          onChange={updateFormData}
          error={errors.routingNumber}
          placeholder="9 digits (e.g., 021000021)"
          maxLength={9}
          helpText="9-digit routing number found on your checks"
          required
        />

        <FormInput
          label="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          onChange={updateFormData}
          error={errors.accountNumber}
          placeholder="Enter account number"
          helpText="Your business bank account number"
          required
        />

        <div className="relative">
          <FormInput
            label="Confirm Account Number"
            name="confirmAccountNumber"
            value={formData.confirmAccountNumber}
            onChange={updateFormData}
            error={
              errors.confirmAccountNumber ||
              (accountsMismatch ? "Account numbers do not match" : "")
            }
            placeholder="Re-enter account number"
            required
          />
          {accountsMatch && (
            <div className="absolute right-3 top-9 text-green-500">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mt-6">
        <h4 className="font-medium text-gray-800 mb-2">
          Where to find your bank details:
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check the bottom of your business checks</li>
          <li>• Log into your online banking portal</li>
          <li>• Contact your bank directly</li>
        </ul>
      </div>
    </div>
  );
}
