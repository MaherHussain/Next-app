import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { IoMdContact } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { TbHandClick } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { FcOk } from "react-icons/fc";
import CustomerDetailsModal from "./customer-details-modal";
import TimeSelectModal from "./time-select-modal";
import { ContactData } from "@/app/types";
import { usePlaceOrder } from "@/app/queries/orders";
import { useCart } from "@/hooks/useCart";
import DialogModal from "@/app/components/shared/dialog-modal";
import LoadingSpinner from "@/app/components/shared/loading-spinner";
import { useGetRestaurant } from "@/app/queries/restaurant";
import { useSocket } from "@/hooks/useSocket";
import { calculateFinalPickupTime } from "@/app/utils/helpers/helpers";

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
    options: ["ASAP", "custom time"],
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

  const { mutate, isPending, data, isSuccess } = usePlaceOrder();
  const { items, total, clearCart } = useCart();
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
  const params = useParams();
  const restaurantId = params.restaurantId as string;
  function onPlaceOrder() {
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

  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    if (isSuccess && data?.data?._id) {
      const orderId = data.data._id;
      let socketCleanup: (() => void) | undefined;

      // 1. Socket Logic
      if (socket) {
        socket.emit('join-order', orderId);

        const handleUpdate = (update: any) => {
          if (update.status) setOrderStatus(update.status);
          if (update.estimatedTime) setEstimatedTime(update.estimatedTime);
          if (update.rejectionReason) setRejectionReason(update.rejectionReason);

          if (update.status === 'confirmed') {
            clearCart();
          }
        };

        socket.on('order-status-updated', handleUpdate);

        socketCleanup = () => {
          socket.off('order-status-updated', handleUpdate);
        };
      }

      // 2. Polling Fallback Logic (Poll every 5 seconds)
      const pollInterval = setInterval(async () => {
        if (orderStatus === 'confirmed' || orderStatus === 'rejected') {
          clearInterval(pollInterval);
          return;
        }

        try {
          const response = await fetch(`/api/orders/${orderId}`);
          const result = await response.json();
          if (result.success && (result.data.status === 'confirmed' || result.data.status === 'rejected')) {
            setOrderStatus(result.data.status);
            if (result.data.estimatedTime) {
              setEstimatedTime(result.data.estimatedTime);
            }
            if (result.data.rejectionReason) {
              setRejectionReason(result.data.rejectionReason);
            }
            if (result.data.status === 'confirmed') {
              clearCart();
            }
          }

        } catch (err) {
          console.error('[OrderDetails] Polling error:', err);
        }
      }, 5000);

      return () => {
        if (socketCleanup) socketCleanup();
        clearInterval(pollInterval);
      };
    }
  }, [isSuccess, data?.data?._id, socket, orderStatus]);



  return (
    <div className="border-b p-5 bg-gray-50 rounded-md">
      {sections.map((section, index) => {
        const isModalTrigger =
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

            {isModalTrigger ? (
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
        disabled={!isDisabled(pickupData) || isPending}
        className={`w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-500 to-black 
      transition ${
          !isDisabled(pickupData) || isPending
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
        <DialogModal title={orderStatus === 'confirmed' ? "Order Confirmed!" : orderStatus === 'rejected' ? "Order Cancelled" : "Order Placed"}>
          <div className="space-y-4">
            {orderStatus === 'confirmed' ? (
              <>
                <div className="flex flex-col items-center text-center space-y-3 py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <FcOk className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-green-700">The restaurant accepted your order!</h3>
                  <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">Final Pickup Time:</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {calculateFinalPickupTime(pickupData.selectedTime, estimatedTime || '', data?.data?.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600">You can pick up your order once it's ready.</p>
                </div>
              </>
            ) : orderStatus === 'rejected' ? (
              <div className="flex flex-col items-center text-center space-y-3 py-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-red-700">The restaurant could not fulfill your order.</h3>

                <p className="text-gray-600 mt-4">Please try again later or contact the restaurant.</p>
              </div>
            ) : (
              <>
                <p className="text-center text-gray-700">{data?.message}</p>
                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-orange-800 font-medium italic">Status: {orderStatus || 'Waiting for restaurant...'}</p>
                </div>

              </>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
            >
              {orderStatus === 'confirmed' || orderStatus === 'rejected' ? "Close" : "Check Status"}
            </button>
          </div>
        </DialogModal>
      )}
    </div>
  );
}

export default OrderDetails;
