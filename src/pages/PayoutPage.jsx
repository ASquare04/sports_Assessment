import { useState, useEffect } from 'react';
import Loader from '../components/Loader'; 
import { fetchNewsData } from '../utility/api'; 
import Navbar from '../components/navbar';

const PayoutPage = () => {
  const [articles, setArticles] = useState([]); 
  const [payouts, setPayouts] = useState({}); 
  const [totalPayout, setTotalPayout] = useState(0); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [globalPayout, setGlobalPayout] = useState(); 

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await fetchNewsData(); 
        setArticles(data);

        const storedPayouts = JSON.parse(localStorage.getItem('payouts')) || {};
        
        const initialPayouts = {};
        data.forEach((article, index) => {
          initialPayouts[index] = storedPayouts[index] || 0; 
        });
        setPayouts(initialPayouts);

        const total = Object.values(initialPayouts).reduce((acc, curr) => acc + curr, 0);
        setTotalPayout(total);

      } catch (error) {
        setError(error.message); 
      } finally {
        setLoading(false); 
      }
    };

    fetchArticles();
  }, []); 


  useEffect(() => {
    if (Object.keys(payouts).length > 0) {

      localStorage.setItem('payouts', JSON.stringify(payouts)); 
      const total = Object.values(payouts).reduce((acc, curr) => acc + curr, 0);
      setTotalPayout(total);
    }
  }, [payouts]); 


  const handlePayoutChange = (index, value) => {
    const updatedPayouts = { ...payouts, [index]: Number(value) };
    setPayouts(updatedPayouts); 
  };

  const applyGlobalPayout = () => {
    const updatedPayouts = {};
    articles.forEach((_, index) => {
      updatedPayouts[index] = Number(globalPayout);
    });
    setPayouts(updatedPayouts);
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="p-4 md:p-16">
        <h1 className="text-2xl font-bold mb-4">Manage Payout</h1>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">Calculated Payout : <span className='text-green-600'>₹{totalPayout}</span></h2>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <input
            type="number"
            value={globalPayout}
            onChange={(e) => setGlobalPayout(e.target.value)}
            placeholder="Common Payout for all Articles"
            className="p-2 border rounded w-1/3 dark:bg-black"
          />
          <button
            onClick={applyGlobalPayout}
            className="px-4 py-2 bg-black font-semibold dark:bg-white text-white dark:text-black rounded"
          >
            Apply to All
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {articles.map((article, index) => (
            <div
              key={index}
              className="py-8 p-4 dark:bg-[#121212] rounded shadow-lg hover:shadow-xl transition duration-200 flex flex-col sm:flex-row sm:items-center justify-between"
            >

              <div className="flex-1 md:border-r border-gray-400">
                <h2 className="font-semibold text-lg mb-2">
                  {article.title.length > 60
                    ? `${article.title.substring(0, 60)}...`
                    : article.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">By {article.author || 'Unknown'}</p>
              </div>


              <div className="flex flex-col sm:ml-4 sm:w-1/4">
                <label className="block text-sm font-medium mb-2">
                  Set Payout ₹
                </label>
                <input
                  type="number"
                  value={payouts[index] || ''} 
                  onChange={(e) => handlePayoutChange(index, e.target.value)}
                  className="p-2 dark:border-none border rounded dark:bg-black"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PayoutPage;
