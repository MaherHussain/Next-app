import { useState, useEffect } from "react";
import Modal from "../Modal";

type Props = {
  onClose: () => void;
  isOpen: boolean;
  onSave: (selectedTime: string | null) => void;
  selectedTime: string | null;
};

export default function TimeSelectModal({
  onClose,
  isOpen,
  onSave,
  selectedTime,
}: Props) {
  const [selectedOption, setSelectedOption] = useState<"ASAP" | "custom">(
    "ASAP"
  );
  const [customTime, setCustomTime] = useState<string | null>("");

  useEffect(() => {
    if (selectedTime && selectedTime !== "ASAP") {
      setCustomTime(selectedTime);
      setSelectedOption("custom");
    }
  }, [selectedTime]);

  const handleChange = () => {
    const selectedTime = selectedOption === "ASAP" ? "ASAP" : customTime;
    onSave(selectedTime);
    onClose();
  };
  return (
    <Modal
      isDisabled={selectedOption === "custom" && !customTime}
      title="Select Time"
      isOpen={isOpen}
      onClose={onClose}
      handleSave={handleChange}
    >
      <div>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="time"
            value="ASAP"
            checked={selectedOption === "ASAP"}
            onChange={() => setSelectedOption("ASAP")}
            className=" accent-orange-500"
          />
          <span>ASAP</span>
        </label>
        <label className="flex items-start flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="time"
              value="custom"
              checked={selectedOption === "custom"}
              onChange={() => setSelectedOption("custom")}
              className=" accent-orange-500"
            />
            <span>Custom Time</span>
          </div>
          <input
            type="time"
            disabled={selectedOption !== "custom"}
            value={selectedOption === "custom" ? (customTime as string) : ""}
            onChange={(e) => setCustomTime(e.target.value)}
            className="border rounded-md p-2 w-full mt-1 disabled:bg-gray-100"
          />
        </label>
      </div>
    </Modal>
  );
}
