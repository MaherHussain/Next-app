import { useState, useEffect } from "react";
import Modal from "../Modal";
type ContactData = {
  name: string;
  phone: string;
  email: string;
  address?: string;
};

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

  useEffect(() => {
    if (contactData) {
      setFormData({ ...contactData });
    }
  }, [contactData]);
  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <Modal
      isDisabled={!(!!formData?.name && !!formData?.email && !!formData?.phone)}
      title={"Customer details"}
      isOpen={isOpen}
      onClose={onClose}
      handleSave={handleSave}
    >
      <div className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-lg"
        />
        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-lg"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded-lg"
        />
        <input
          name="address"
          type="text"
          placeholder="Address (optional)"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg"
        />
      </div>
    </Modal>
  );
}

export default CustomerDetailsModal;
