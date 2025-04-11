import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Footer from "../components/common/Footer";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.profile);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Function to update current time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Determine greeting based on current time
    const currentHour = currentTime.getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [currentTime]);

  return (
<>
<div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-lg w-full mx-4 animate__animated animate__fadeInUp">
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <img
              className="h-20 w-20 rounded-full object-cover"
              src={user?.image}
              alt={user?.name}
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">
                {greeting}, {user?.name}
              </h1>
              <p className="text-sm text-gray-600">{user?.email}</p>
              <p className="text-sm text-gray-600">{user?.contactNumber}</p>
              <p className="text-sm text-gray-600">
                Account Type: {user?.accountType}
              </p>
              <p className="text-sm text-gray-600">
                Active: {user?.active ? "Yes" : "No"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <hr className="mx-6 border-t border-gray-300" />
        <div className="p-6 flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a1 1 0 011-1h2a1 1 0 010 2H9a1 1 0 01-1-1zm3.293 2.293a1 1 0 010 1.414l-1.5 1.5a1 1 0 01-1.414-1.414l1.5-1.5a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
</>
  );
};

export default ProfilePage;
