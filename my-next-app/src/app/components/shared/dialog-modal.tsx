import { ReactNode } from "react";
type Props = {
  title?: string;
  children: ReactNode;
};

function DialogModal({ children, title }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export default DialogModal;
