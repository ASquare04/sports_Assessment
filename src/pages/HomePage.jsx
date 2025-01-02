import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { auth } from "../utility/firebase"; 
import { FaArrowCircleRight } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    if (auth.currentUser) {
      navigate("/trending");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />
      <div className="h-cover p-4 md:px-12 py-12 md:py-24 text-center">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-black dark:text-white md:text-5xl lg:text-6xl">
          Get the content over{" "}
          <span className="text-blue-600 dark:text-blue-500">#Dashline</span>{" "}
          at your ease
        </h1>
        <p className="text-md font-normal text-gray-500 lg:text-xl">
          We bring you the latest updates, where real-time news, insights, and
          trends drive informed decisions and keep you ahead of the curve.
        </p>

        <h1 className="mt-12 mb-4 text-2xl font-extrabold leading-none tracking-tight text-yellow-400 md:text-5xl lg:text-6xl">
          Discover the News & Article.
        </h1>
        <p className="mb-6 text-sm font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48">
          Stay updated with the latest news, articles, and trending topics from
          around the world.
          Get real-time insights and stay informed on whats happening.
          Streamine the process with - Dashline
        </p>

        <div className="mt-12 flex justify-center space-x-6">
          <button
            onClick={handleExploreClick}
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center rounded-full text-white bg-black dark:text-black dark:bg-white"
          >
            Explore Now
            <FaArrowCircleRight className="ml-2" />
          </button>
        </div>
      </div>
    </>
  );
};

export default HomePage;
