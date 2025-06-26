import CartIcon from "../components/Cart";
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="flex justify-between items-center p-4">
        <h1 className="text-xl font-bold">My Food App</h1>
        <CartIcon />
      </header>
      <main>{children}</main>
    </div>
  );
}
