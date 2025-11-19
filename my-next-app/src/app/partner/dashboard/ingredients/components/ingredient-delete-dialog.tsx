'use client';

import React from "react";
import DialogModal from "@/app/components/shared/dialog-modal";
interface Props {
  ingredientName?: string;
  onCancel?: () => void;
  onProceed?: () => void;
}

function IngredientDeleteDialog({
  ingredientName,
  onCancel,
  onProceed,
}: Props) {
  return (
    <DialogModal title="Delete Ingredient">
      <p>
        Are you sure you want to delete {ingredientName || "this ingredient"}?
      </p>
      <div>
        <button
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded m-5"
          onClick={onProceed}
        >
          Proceed
        </button>
      </div>
    </DialogModal>
  );
}

export default IngredientDeleteDialog;
