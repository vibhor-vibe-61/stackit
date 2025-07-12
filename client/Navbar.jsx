import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        StackIt
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/ask" className="text-sm font-medium hover:underline">
          Ask Question
        </Link>
        <Link to="/stats" className="text-sm font-medium hover:underline">
          Stats
        </Link>
        <NotificationBell />
      </div>
    </nav>
  );
}