import { useEffect, useState } from "react";
import { IoMdContact } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { TbHandClick } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { FcOk } from "react-icons/fc";
import CustomerDetailsModal from "./customer-details-modal";
import TimeSelectModal from "./time-select-modal";
import { ContactData } from "@/app/types";
import { usePlaceOrder, useGetOrderById } from "@/app/queries/order";
import { useCart } from "@/hooks/useCart";
import DialogModal from "../shared/dialog-modal";
import LoadingSpinner from "../shared/loading-spinner";
import { useGetRestaurant } from "@/app/queries/restaurant";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

const sections = [
  {
    id: "contact",
    heading: "Contact",
    headingIcon: <IoMdContact className="w-6 h-6" />,
    buttonText: "Add details",
  },
  {
    id: "order-method",
    heading: "Order method",
    headingIcon: <TbHandClick className="w-6 h-6" />,
    buttonText: "Select order method",
    options: ["pick up"],
  },
  {
    id: "time",
    heading: "Select time",
    headingIcon: <IoTimeOutline className="w-6 h-6" />,
    buttonText: "Select time",
    options: ["ASAP", "custome time"],
  },
  {
    id: "payment",
    heading: "Payment method",
    headingIcon: <MdPayment className="w-6 h-6" />,
    buttonText: "Select payment method",
    options: ["Cash"],
  },
];

type PickupData = {
  contactData: ContactData;
  selectedTime: string;
  orderMethod: string;
  paymentMethod: string;
};

function OrderDetails() {
  const [isOpen, setIsOpen] = useState(false);
  const [openModal, setOpenModal] = useState<string | null>(null);

  const initialpickupData = {
    contactData: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    selectedTime: "",
    orderMethod: "pickup",
    paymentMethod: "cash",
  };
  const [pickupData, setPickupData] = useState<PickupData>(initialpickupData);
  const { push } = useRouter();

  const { mutate, isPending, data, isSuccess } = usePlaceOrder(() =>
    setPickupData(initialpickupData)
  );
  const {
    isPending: isAcceptedOrderPending,
    data: acceptedOrderData,
    refetch,
  } = useGetOrderById(data?.data?._id);
  const { items, total } = useCart();
  const { data: restaurantData } = useGetRestaurant();

  // TODO: we need to add more options for order method and payment method
  function onSaveContactData(data: ContactData) {
    setPickupData((prev) => ({
      ...prev,
      contactData: { ...data },
    }));
  }

  function isSectionComplete(id: string, data: PickupData): boolean {
    if (id === "contact") {
      const c = data.contactData;
      return !!(c?.name && c?.phone && c?.email);
    }
    if (id === "time") {
      return !!data.selectedTime;
    }
    if (id === "order-method") {
      return !!data.orderMethod;
    }
    if (id === "payment") {
      return !!data.paymentMethod;
    }
    return false;
  }
  function isDisabled(data: PickupData): boolean {
    const c = data.contactData;
    return (
      !!(c?.name && c?.phone && c?.email) &&
      !!data.selectedTime &&
      !!data.orderMethod &&
      !!data.paymentMethod
    );
  }
  function onSaveTime(selectedTime: string) {
    setPickupData((prev) => {
      return {
        ...prev,
        selectedTime: selectedTime,
      };
    });
  }

  function onPlaceOrder() {
    const restaurantId = restaurantData?.data?._id;
    const payload = {
      items: items,
      contactData: pickupData.contactData,
      total: total,
      selectedTime: pickupData.selectedTime,
      orderMethod: pickupData.orderMethod,
      paymentMethod: pickupData.paymentMethod,
      restaurantId, // include restaurantId in the payload
    };
    mutate(payload);
  }

  return (
    <div className="border-b p-5 bg-gray-50 rounded-md">
      {sections.map((section, index) => {
        const isModalTirgger =
          (section.options && section.options?.length > 1) || !section.options;
        return (
          <div
            className="border-b last:border-b-0 p-5 bg-gray-50 rounded-md"
            key={index}
          >
            <div className="flex flex-row gap-2">
              {section.headingIcon}
              <h1>{section.heading}</h1>
              {isSectionComplete(section.id, pickupData) && (
                <FcOk className="w-5 h-5" />
              )}
            </div>

            {isModalTirgger ? (
              <div
                onClick={() => {
                  setIsOpen(true);
                  setOpenModal(section.id);
                }}
                className="flex flex-row border p-2 mt-3 gap-3 justify-center rounded-md cursor-pointer"
              >
                <MdOutlineEdit className="w-6 h-6" />
                <p>{section.buttonText}</p>
              </div>
            ) : (
              section.options && <p className="p-3">{section.options[0]}</p>
            )}
          </div>
        );
      })}
      {openModal === "contact" && (
        <CustomerDetailsModal
          contactData={pickupData.contactData}
          onSave={(payload) => {
            onSaveContactData(payload);
          }}
          onClose={() => {
            setOpenModal(null);
            setIsOpen(false);
          }}
          isOpen={isOpen}
        />
      )}
      {openModal === "time" && (
        <TimeSelectModal
          selectedTime={pickupData.selectedTime}
          onSave={(payload) => {
            onSaveTime(payload);
          }}
          onClose={() => {
            setOpenModal(null);
            setIsOpen(false);
          }}
          isOpen={isOpen}
        />
      )}
      <button
        onClick={onPlaceOrder}
        disabled={!isDisabled(pickupData)}
        className={`w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-black 
      transition ${
        !isDisabled(pickupData || isPending)
          ? "opacity-50 cursor-not-allowed"
          : "hover:opacity-90"
      }`}
      >
        <div className="flex items-center justify-center">
          {isPending && <LoadingSpinner />}
          <span>Place Order</span>
        </div>
      </button>
      {isSuccess && (
        <DialogModal title="Order Confirmation">
          {isAcceptedOrderPending || acceptedOrderData?.state === "pending" ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-gray-600">Your order is being processed.</p>
              <LoadingSpinner />
            </div>
          ) : (
            <div>
              <p className="font-semibold text-green-600">
                Your order is confirmed!
              </p>
              <p>
                Estimated ready time:{" "}
                <span className="font-bold">
                  {acceptedOrderData.estimatedTime}
                </span>
              </p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  push("customer");
                }}
              >
                ok
              </button>
            </div>
          )}
        </DialogModal>
      )}
    </div>
  );
}

export default OrderDetails;
