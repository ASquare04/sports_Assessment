import { useState, useEffect } from "react";
import { fetchNewsData } from "../utility/api";
import Navbar from "../components/navbar";
import Loader from "../components/Loader";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { CSVLink } from "react-csv";
import "jspdf-autotable";
import { jsPDF } from "jspdf";
import { FaSearch, FaFileCsv, FaFilePdf, FaNewspaper, FaMoneyBillWave, FaFilter } from "react-icons/fa";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [setAuthors] = useState({});
  const [loading, setLoading] = useState(true);
  const [authorSearch, setAuthorSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [payouts] = useState(() => {
    const savedPayouts = localStorage.getItem("payouts");
    return savedPayouts ? JSON.parse(savedPayouts) : {};
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const data = await fetchNewsData();
        setArticles(data);
        processAuthorsData(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const filterArticles = () => {
      let filtered = articles;
      if (authorSearch) {
        filtered = filtered.filter((article) =>
          article.author?.toLowerCase().includes(authorSearch.toLowerCase())
        );
      }
      if (startDate || endDate) {
        filtered = filtered.filter((article) => {
          const articleDate = new Date(article.publishedAt).toISOString().split("T")[0];
          return (!startDate || articleDate >= startDate) && (!endDate || articleDate <= endDate);
        });
      }
      setFilteredArticles(filtered);
    };

    filterArticles();
  }, [authorSearch, startDate, endDate, articles]);

  const processAuthorsData = (data) => {
    const authorsCount = {};
    data.forEach((article) => {
      const author = article.author || "Unknown";
      authorsCount[author] = (authorsCount[author] || 0) + 1;
    });
    setAuthors(authorsCount);
  };

  const totalPayout = filteredArticles.reduce((total, article, index) => {
    const payout = payouts[index] || 0;
    return total + payout;
  }, 0);

  const chartData = {
    labels: filteredArticles.map((article) => article.title),
    datasets: [
      {
        label: "Payout",
        data: filteredArticles.map((article, index) => payouts[index] || 0),
        backgroundColor: "#379fa1",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: "Authors" },
        ticks: {
          callback: (value, index) => filteredArticles[index]?.author || "Unknown",
        },
        grid: { color: "gray", lineWidth: 0.5 },
      },
      y: {
        title: { display: true, text: "Article Titles" },
        grid: { color: "gray", lineWidth: 0.5 },
      },
    },
    elements: { bar: { borderWidth: 1 } },
    plugins: {
      legend: {
        position: "top",
        labels: { font: { size: 14 } },
      },
    },
    layout: { padding: 20 },
    barThickness: 15,
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Articles Data", 14, 22);

    const tableColumn = ["Title", "Author", "Payout"];
    const tableRows = filteredArticles.map((article, index) => [
      article.title,
      article.author || "Unknown",
      payouts[index] || 0,
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("articles-data.pdf");
  };

  return (
    <>
      <Navbar />
      <div className="h-cover md:p-8 p-4">
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className="m-6 flex md:flex-row flex-col-reverse justify-between gap-4 mb-6">
              <div className="flex gap-4 justify-around md:w-1/4">
                <CSVLink
                  data={filteredArticles.map((article, index) => [
                    article.title,
                    article.author || "Unknown",
                    payouts[index] || 0,
                  ])}
                  filename={"articles-data.csv"}
                  className="p-2 bg-purple-500 text-white w-36 font-semibold rounded mb-4 text-center hover:bg-purple-600 flex items-center gap-2"
                >
                  <FaFileCsv /> Export CSV
                </CSVLink>
                <button
                  onClick={exportPDF}
                  className="p-2 bg-yellow-400 text-white w-36 font-semibold rounded mb-4 text-center hover:bg-yellow-500 flex items-center gap-2"
                >
                  <FaFilePdf /> Export PDF
                </button>
              </div>
              <p className="text-2xl font-semibold">Information At Glance</p>
              <div className="flex md:flex-row flex-col gap-6">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-3" />
                  <input
                    type="text"
                    value={authorSearch}
                    onChange={(e) => setAuthorSearch(e.target.value)}
                    placeholder="Search by Author"
                    className="p-2 pl-10 border rounded mb-4 dark:bg-black"
                  />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded mb-4 dark:bg-black"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded mb-4 dark:bg-black"
                />
              </div>
            </div>

            <div className="md:py-6 md:p-12 md:gap-6 gap-4 flex flex-col md:flex-row text-center w-full md:justify-between mb-6">
              <div className="flex flex-col items-center justify-center border-2 rounded p-6 md:text-xl w-full md:w-1/3 dark:border-none shadow-md">
                <FaNewspaper className="text-4xl text-blue-600 mb-2" />
                <p className="font-semibold text-lg">Total Articles</p>
                <span className="text-xl font-bold text-blue-600">{articles.length}</span>
              </div>

              <div className="flex flex-col items-center justify-center border-2 rounded p-6 md:text-xl w-full md:w-1/3 dark:border-none shadow-md">
                <FaMoneyBillWave className="text-4xl text-green-500 mb-2" />
                <p className="font-semibold text-lg">Total Payout</p>
                <span className="text-xl font-bold text-green-500">₹{totalPayout}</span>
              </div>

              <div className="flex flex-col items-center justify-center border-2 rounded p-6 md:text-xl w-full md:w-1/3 dark:border-none shadow-md">
                <FaFilter className="text-4xl text-orange-500 mb-2" />
                <p className="font-semibold text-lg">Filtered Articles</p>
                <span className="text-xl font-bold text-orange-500">{filteredArticles.length}</span>
              </div>
            </div>

            <div className="md:px-24 flex flex-col bg-white text-black dark:text-white dark:bg-black p-6 rounded-lg shadow-lg">
              <div className="flex justify-center items-center">
                <div className="w-full">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
