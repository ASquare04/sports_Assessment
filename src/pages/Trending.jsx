import { useState, useEffect } from 'react';
import { fetchNewsData } from '../utility/api';
import Loader from '../components/Loader';
import Navbar from '../components/navbar';


const Trending = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [titleSearch, setTitleSearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [payouts] = useState(() => {

    const savedPayouts = localStorage.getItem('payouts');
    return savedPayouts ? JSON.parse(savedPayouts) : {};
  });


  const fetchNews = async () => {
    setLoading(true);
    try {
      const articles = await fetchNewsData();
      setArticles(articles);
      setFilteredArticles(articles); 
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    let filtered = articles;

    if (titleSearch) {
      filtered = filtered.filter((article) =>
        article.title?.toLowerCase().includes(titleSearch.toLowerCase())
      );
    }

    if (authorSearch) {
      filtered = filtered.filter((article) =>
        article.author?.toLowerCase().includes(authorSearch.toLowerCase())
      );
    }

    if (startDate || endDate) {
      filtered = filtered.filter((article) => {
        const articleDate = new Date(article.publishedAt).toISOString().split('T')[0];
        return (
          (!startDate || articleDate >= startDate) &&
          (!endDate || articleDate <= endDate)
        );
      });
    }

    setFilteredArticles(filtered);
  }, [titleSearch, authorSearch, startDate, endDate, articles]);

  return (
    <>
      <Navbar />
      <div className="m-4 flex md:flex-row flex-col p-4 gap-6 justify-between md:items-start relative">
        <div className="left md:sticky md:top-20 flex flex-col text-justify md:w-1/4">
        <p className='mt-4 md:text-2xl font-semibold mb-6'>Articles, News and More</p>
          <p className="md:mt-6 md:text-3xl font-bold mb-6">Its all what you need.. Latest Releases, at one convenient place.</p>

          <div className="bg-gray-200 dark:bg-black p-8 rounded shadow-md">

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Search by Title</label>
              <input
                type="text"
                value={titleSearch}
                onChange={(e) => setTitleSearch(e.target.value)}
                className="w-full p-2 border rounded bg-white  dark:bg-[#121212] dark:border-black dark:text-white"
                placeholder="Search articles by title..."
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Search by Author</label>
              <input
                type="text"
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full p-2 border rounded bg-white  dark:bg-[#121212] dark:border-black dark:text-white"
                placeholder="Search articles by author..."
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">Filter by Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded w-1/2 bg-white  dark:bg-[#121212] dark:border-black dark:text-white"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded w-1/2 bg-white  dark:bg-[#121212] dark:border-black dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {loading && <Loader />}
        {error && <p className="text-red-500">{error}</p>}
        <div className="right md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((article, index) => (
            <div
              key={index}
              className="p-4 dark:bg-[#121212] rounded shadow-lg hover:shadow-xl transition duration-200"
            >
              <img
                src={article.urlToImage || 'https://via.placeholder.com/150'}
                alt={article.title}
                className="w-full h-40 object-cover rounded-t"
              />
              <div className="p-2">
                <h2 className="font-semibold text-lg mb-2">
                  {article.title.length > 60
                    ? `${article.title.substring(0, 60)}...`
                    : article.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  {article.description?.length > 100
                    ? `${article.description.substring(0, 100)}...`
                    : article.description}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  By {article.author || 'Unknown'} |{' '}
                  {new Date(article.publishedAt).toDateString()}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 text-sm underline mt-2 inline-block"
                >
                  Read More
                </a>

                <div className="mt-4 flex gap-4">
                  <p className="text-md font-medium">Approx Payout:</p>
                  <p className="text-md font-bold">
                    ₹{payouts[index] || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Trending;
