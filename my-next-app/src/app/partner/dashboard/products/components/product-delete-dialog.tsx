import React from 'react'
import DialogModal from '@/app/components/shared/dialog-modal'
interface Props {
  productName?: string;
  isOpen?: boolean;
  onCancel?: () => void;
  onProceed?: () => void;
}   

function ProductDeleteDialog({ productName, isOpen, onCancel, onProceed }: Props) {
  return (
    <DialogModal title="Delete Product">
      <p>Are you sure you want to delete {productName || "this product"}?</p>
      <div>
        <button className='bg-gray-200 text-gray-700 px-4 py-2 rounded' onClick={onCancel}>Cancel</button>
        <button className='bg-red-500 text-white px-4 py-2 rounded m-5' onClick={onProceed}>Proceed</button>
      </div>
    </DialogModal>
  );
}

export default ProductDeleteDialog