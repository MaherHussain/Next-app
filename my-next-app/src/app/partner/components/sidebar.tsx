"use client";
import { useRouter, usePathname } from "next/navigation";
import {
  AiOutlineHome,
  AiOutlineFileText,
  AiOutlineShopping,
  AiOutlineUser,
} from "react-icons/ai";

interface SidebarProps {
  restaurantName?: string;
}

export default function Sidebar({ restaurantName }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/partner/dashboard", icon: AiOutlineHome },
    { name: "Orders", href: "/partner/orders", icon: AiOutlineFileText },
    { name: "Products", href: "/partner/products", icon: AiOutlineShopping },
    { name: "Profile", href: "/partner/profile", icon: AiOutlineUser },
  ];

  return (
    <aside className="w-18 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <nav className="mt-4">
        <div className="px-2">
          {/* Restaurant Logo/Initial */}
          <div className="mb-6 flex justify-center">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {restaurantName?.charAt(0) || "R"}
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <button
                    onClick={() => router.push(item.href)}
                    className={`w-full flex flex-col items-center justify-center p-2 text-xs font-medium rounded-md transition-colors group relative ${
                      isActive
                        ? "bg-orange-50 text-orange-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    title={item.name}
                  >
                    <item.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{item.name}</span>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-full bg-orange-700 rounded-r-full"></div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
