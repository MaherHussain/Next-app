import Link from "next/link";
export default function Home() {
  return (
    <div className="max-h-[85vh] h-[85vh]">
      <main className=" h-full grid grid-cols-1 md:grid-cols-2 gap-10 p-8 rounded-2xl">
        <div className="flex flex-col items-center justify-center gap-6">
          <Link
            className="w-40 text-center px-10 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            href="/customer"
          >
            Guest
          </Link>
          <Link
            className="w-40 text-center px-10 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            href="/auth/partner/login"
          >
            Partner
          </Link>
        </div>
        <div className="flex items-center justify-center text-4xl font-bold uppercase text-gray-700 border h-full">
          food order logo
        </div>
      </main>
    </div>
  );
}
