import { useState, useEffect } from "react";
import Modal from "../shared/Modal";
import { ContactData } from "@/app/types";
import InputTextField from "../shared/input-text-fied";
type Props = {
  onClose: () => void;
  isOpen: boolean;
  onSave: (payload: ContactData) => void;
  contactData: ContactData | null;
};

function CustomerDetailsModal({ onClose, isOpen, onSave, contactData }: Props) {
  const [formData, setFormData] = useState<ContactData>({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [isDisabled, setIsDisabled] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    phone: false,
  });
  useEffect(() => {
    if (contactData) {
      setFormData({ ...contactData });
    }
  }, [contactData]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value) ? "" : "Invalid email format",
      }));
    }
    if (name === "phone") {
      const isOnlyDigits = /^[0-9]*$/.test(value);
      setErrors((prev) => ({
        ...prev,
        phone: isOnlyDigits ? "" : "Phone must be numeric",
      }));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const isFormValid =
      !!formData.name &&
      !!formData.phone &&
      !!formData.email &&
      errors.email === "" &&
      errors.phone === "";
    setIsDisabled(!isFormValid);
  }, [formData, errors]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };
  if (!isOpen) return null;

  return (
    <Modal title={"Customer details"} isOpen={isOpen} onClose={onClose}>
      <form className="space-y-4">
        <InputTextField
          type="text"
          value={formData.name}
          placeholder="Your name"
          label="Name"
          isRequired
          onChange={handleChange}
          inputName="name"
        />
        <InputTextField
          type="tel"
          value={formData.phone}
          placeholder="your phone"
          label="Phone number"
          isRequired
          onChange={handleChange}
          inputName="phone"
          error={touched.phone ? errors.phone : ""}
          onBlur={handleBlur}
        />

        <InputTextField
          type="email"
          value={formData.email}
          placeholder="your email"
          label="Email"
          isRequired
          onChange={handleChange}
          inputName="email"
          error={touched.email ? errors.email : ""}
          onBlur={handleBlur}
        />

        <InputTextField
          type="text"
          value={formData.address}
          placeholder="your address"
          label="Address"
          isRequired={false}
          onChange={handleChange}
          inputName="address"
        />
        <button
          disabled={isDisabled}
          onClick={handleSave}
          className={`w-full py-3 mt-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-black 
      transition ${
        isDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
      }`}
        >
          Save
        </button>
      </form>
    </Modal>
  );
}

export default CustomerDetailsModal;
