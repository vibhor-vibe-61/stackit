import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <main className="flex justify-center items-center min-h-screen p-4">
        <Outlet />
      </main>
    </div>
  );
}
import NotificationBell from "../components/NotificationBell";

export default function Layout() {
  return (
    <div>
      <nav className="flex justify-end p-4 shadow bg-white">
        <NotificationBell />
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
<Link to="/stats" className="hover:underline text-blue-600">📈 Stats</Link>
