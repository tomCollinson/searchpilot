import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="Layout">
      <header><h1>Search Pilot</h1></header>
      <Outlet/>
    </div>
  );
}

export default Layout;
