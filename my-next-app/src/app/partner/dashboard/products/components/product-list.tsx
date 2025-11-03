"use client";
import { useState } from "react";
import {
  useGetProducts,
  useDeleteProduct,
  useSearchProducts,
} from "@/app/queries/products";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { PriceFormatter } from "@/app/utils/helpers/helpers";
import { LiaPenSolid } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { ProductModal, ProductDeleteDialog } from "./";
import SearchInput from "@/app/components/shared/Searchinput";
import useDebounce from "@/hooks/useDebounce";
import { useUser } from "@/app/utils/providers/UserContext";
interface Product {
  _id: string;
  name: string;
  price: number;
  createdAt?: string;
}

const limit = 10;

const ProductList: React.FC = () => {
  const [page, setPage] = useState(1);
  const { mutate: deleteMutate } = useDeleteProduct();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | undefined>(
    undefined
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProductToDelete, setSelectedProductToDelete] =
    useState<Product | null>(null);

  const { user } = useUser();

  
  const restaurantId = typeof user?.restaurantId === 'string' 
  ? user.restaurantId 
  : user?.restaurantId?._id ?? "";


  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, error } = useGetProducts({
    limit,
    page,
    restaurantId
  });

  const {
    data: searchData,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchProducts({ query: debouncedSearchTerm, limit, page, restaurantId });

  // Raw products from main query
  const rawProducts: Product[] = data?.data || [];

  // Choose search results when there is a debounced search term
  const productsToUse: Product[] =
    debouncedSearchTerm && debouncedSearchTerm.trim().length > 0
      ? searchData?.data || []
      : rawProducts;

  const totalPages = Math.max(
    1,
    Math.ceil(
      (debouncedSearchTerm
        ? searchData?.meta?.total ?? 0
        : data?.meta?.total ?? 0) / limit
    )
  );

  function handleSearch(value: string) {
    setSearchTerm(value);
    setPage(1);
  }

  return (
    <div className="p-4 bg-white max-h-screen overflow-y-auto ">
      <SearchInput onSearch={handleSearch} />

      {/* Loading state */}
      {isLoading || (debouncedSearchTerm && searchLoading) ? (
        <div className="flex flex-row justify-center mt-6">
          <LoadingSpinner size="large" />
        </div>
      ) : error || searchError ? (
        <div className="text-red-500 p-4">Error loading products.</div>
      ) : !data || (!rawProducts?.length && !debouncedSearchTerm) ? (
        <div className="text-gray-500 p-4">
          No products have been added yet, click add button to start.
        </div>
      ) : productsToUse.length === 0 ? (
        <div className="text-gray-500 p-4">
          No products found
          {debouncedSearchTerm ? " for your search." : ", add one to start."}
        </div>
      ) : (
        <div>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left font-semibold w-1/2">
                  Name
                </th>
                <th className="py-2 px-4 text-left font-semibold w-1/3">
                  Price
                </th>
                <th className="py-2 px-4 text-left font-semibold "></th>
              </tr>
            </thead>
            <tbody>
              {productsToUse.map((product: Product) => (
                <tr key={product._id} className="border-t">
                  <td className="py-2 px-4">{product.name}</td>
                  <td className="py-2 px-4">{PriceFormatter(product.price)}</td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      onClick={() => {
                        setIsEditModalOpen(true);
                        setProductToEdit(product);
                      }}
                      className="bg-blue-200 text-blue-700 px-3 py-1 rounded "
                    >
                      <LiaPenSolid />
                    </button>
                    <button
                      onClick={() => {
                        setIsDeleteDialogOpen(true);
                        setSelectedProductToDelete(product);
                      }}
                      className="bg-red-200 text-red-700 px-3 py-1 rounded"
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
        </div>
      )}

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
      {isEditModalOpen && (
        <ProductModal
          isOpen={isEditModalOpen}
          isEditAction={true}
          productToEdit={productToEdit}
          onClose={() => {
            setIsEditModalOpen(false);
            setProductToEdit(undefined);
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
