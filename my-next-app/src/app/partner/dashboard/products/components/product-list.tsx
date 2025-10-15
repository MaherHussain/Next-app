import React, { useEffect, useState } from "react";
import {useGetProducts} from "@/app/queries/products";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import { LiaPenSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { useDeleteProduct } from "@/app/queries/products";
import { ProductDeleteDialog } from "./";

interface Product {
  _id: string;
  name: string;
  price: number;
}

const PAGE_SIZE = 10;

const ProductList: React.FC = () => {
  const { data, isLoading, error } = useGetProducts();
  const [page, setPage] = useState(1);
  const { mutate: deleteMutate } = useDeleteProduct();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] =
    useState<Product | null>(null);

  if (isLoading)
    return (
      <div className="flex flex-row justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  if (error)
    return <div className="text-red-500 p-4">Error loading products.</div>;
  if (!data || !data.data?.length)
    return (
      <div className="text-gray-500 p-4">
        No products have been added yet, click add button to start.
      </div>
    );

  // Sort products by createdAt descending
  const products = [...data.data].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });
  // Pagination logic
  // TODO : change pagination to clickable page numbers
  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paginatedProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="p-4 bg-white  max-h-screen overflow-y-auto ">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left font-semibold w-1/2">Name</th>
            <th className="py-2 px-4 text-left font-semibold w-1/3">Price</th>
            <th className="py-2 px-4 text-left font-semibold "></th>
          </tr>
        </thead>
        <tbody>
          {paginatedProducts.map((product: Product) => (
            <tr key={product._id} className="border-t">
              <td className="py-2 px-4">{product.name}</td>
              <td className="py-2 px-4">{PriceFormatter(product.price)}</td>
              <td className="py-2 px-4 space-x-2">
                <button
                  disabled
                  className="bg-blue-200 text-blue-700 px-3 py-1 rounded cursor-not-allowed"
                >
                  <LiaPenSolid />
                </button>
                <button
                  onClick={() => {
                    setIsDeleteDialogOpen(true);
                    setSelectedProductToDelete(product);
                  }}
                  className="bg-red-200 text-red-700 px-3 py-1 rounded cursor-not-allowed"
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-2">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
      {isDeleteDialogOpen && (
        <ProductDeleteDialog
          productName={selectedProductToDelete?.name}
          isOpen={isDeleteDialogOpen}
          onCancel={() => setIsDeleteDialogOpen(false)}
          onProceed={() => {
            if (selectedProductToDelete) {
              deleteMutate(selectedProductToDelete._id);
            }
            setIsDeleteDialogOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
