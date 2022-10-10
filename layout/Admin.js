import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Admin = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Admin;
