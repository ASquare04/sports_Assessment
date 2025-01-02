export const fetchNewsData = async () => {
    const API_KEY = '5c9d3d8aed7a4a1690ec758a167088de';
    const API_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
  
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.status === 'ok') {
        return data.articles;
      } else {
        throw new Error('Failed to fetch news');
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  