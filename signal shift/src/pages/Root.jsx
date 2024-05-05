import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="flex items-center justify-center">
      <Outlet />
    </div>
  );
}
