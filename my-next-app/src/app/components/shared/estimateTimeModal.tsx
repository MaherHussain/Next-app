'use client'
import {useState} from "react";
import Modal from "./Modal";
import { title } from "process";
type EstimateTimeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (time: number) => void;
};
export default function EstimateTimeModal({ isOpen, onClose, onSelect }: EstimateTimeModalProps) {
  const [estimatedTime, setEstimatedTime] = useState(10);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Estimate Time">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[300px]">
       
        <select
          className="border rounded px-3 py-2 w-full mb-4"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(Number(e.target.value))}
        >
          {[10, 15, 20, 25, 30, 35, 40, 45, 50, 60].map((min) => (
            <option key={min} value={min}>
              {min}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            // Handle the estimated time submission logic here
            onSelect(estimatedTime);
          }}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </div>
    </Modal>
  );
}
