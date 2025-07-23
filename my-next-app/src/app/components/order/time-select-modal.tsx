import { useState, useEffect } from "react";
import Modal from "../shared/Modal";
import {
  currentTimeRounded,
  generateTimeOptions,
} from "@/app/utils/helpers/helpers";
type Props = {
  onClose: () => void;
  isOpen: boolean;
  onSave: (selectedTime: string) => void;
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
  const [customTime, setCustomTime] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    if (selectedTime && selectedTime !== "ASAP") {
      setCustomTime(selectedTime);
      setSelectedOption("custom");
    }
  }, [selectedTime]);

  useEffect(() => {
    const disabled = selectedOption === "custom" && !customTime;
    setIsDisabled(disabled);
  }, [selectedOption, customTime]);

  const handleSave = () => {
    const selectedTime =
      selectedOption === "ASAP" ? currentTimeRounded() : customTime;
    onSave(selectedTime);
    onClose();
  };

  const timeOptions = generateTimeOptions(5, "16:00", "21:00");
  return (
    <Modal title="Select Time" isOpen={isOpen} onClose={onClose}>
      <div>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="time"
            value={`ASAP`}
            checked={selectedOption === "ASAP"}
            onChange={() => setSelectedOption("ASAP")}
            className=" accent-orange-500"
          />
          <span>ASAP ({currentTimeRounded()})</span>
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
          <select
            disabled={selectedOption !== "custom"}
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            className="border rounded-md p-2 w-full disabled:bg-gray-100"
          >
            <option value="">Select time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>
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
      </div>
    </Modal>
  );
}
