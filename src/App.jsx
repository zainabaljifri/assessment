import { useState, useEffect } from 'react';
import {
  FiSearch, FiBookmark, FiCheckCircle,
  FiSun, FiMoon, FiStar, FiCalendar, FiClock,FiTag
} from 'react-icons/fi';
import { FaFilm, FaBookmark } from 'react-icons/fa';
import './index.css';
import { useRef } from 'react';
import { Listbox } from '@headlessui/react';


function App() {
  const isFirstLoad = useRef(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('movie');
  const [searchResults, setSearchResults] = useState([]);
  // const [bookmarks, setBookmarks] = useState([]);
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [season, setSeason] = useState('');
const [episode, setEpisode] = useState('');
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('movieBookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    const initial = saved ? JSON.parse(saved) : false;
    document.documentElement.classList.toggle('dark', initial);
    return initial;
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'search';
  });

  useEffect(() => {
    isFirstLoad.current = false;
  }, []);
  

  useEffect(() => {
    if (!isFirstLoad.current) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isFirstLoad.current) {
      localStorage.setItem('movieBookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks]);
  
  useEffect(() => {
    if (!isFirstLoad.current) {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [isDarkMode]);

  const searchMovies = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError('');
  
    try {
      let url = '';
  
      if (searchType === 'episode') {
        if (!season) {
          setError('Please enter a season number.');
          setIsLoading(false);
          return;
        }
        if (!episode) {
          // Fetch all episodes for the season
          url = `/api/episode?t=${encodeURIComponent(searchQuery)}&season=${season}`;
        } else {
          // Fetch a specific episode
          url = `/api/episode?t=${encodeURIComponent(searchQuery)}&season=${season}&episode=${episode}`;
        }
      } else {
        url = `/api/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`;
      }
  
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.Response === 'True') {
        setSearchResults(searchType === 'episode' && !episode ? data.Episodes || [] : searchType === 'episode' ? [data] : data.Search || []);
      } else {
        setError(data.Error || 'No results found');
        setSearchResults([]);
      }
    } catch (err) {
      setError('Failed to fetch. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const toggleBookmark = (item) => {
    const isBookmarked = bookmarks.some(b => b.imdbID === item.imdbID);
    setBookmarks(
      isBookmarked
        ? bookmarks.filter(b => b.imdbID !== item.imdbID)
        : [...bookmarks, item]
    );
  };

  const isBookmarked = (id) => bookmarks.some(b => b.imdbID === id);

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies();
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Modern pill-style tab classes
  const tabClass = (active) =>
    `flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none min-w-max
    ${active ? 'bg-primary-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-800 hover:text-primary-700'}
    `;

  // Add a helper to determine if we're showing a whole season
  const isWholeSeason = searchType === 'episode' && !episode;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-2 sm:px-4 py-8">
        {/* Header */}
        <header className="mb-10 bg-white/80 dark:bg-gray-900/80 rounded-xl p-4">
          {/* Top row: logo and theme icon */}
          <div className="flex justify-between items-center w-full mb-4 px-1 sm:px-0">
            <div className="flex items-center space-x-2">
              <FaFilm className="w-8 h-8 text-primary-600" />
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white font-montserrat">
                FavouriteMovie.com
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
              title="Switch theme"
            >
              {isDarkMode ? (
                <FiSun className="text-yellow-500" />
              ) : (
                <FiMoon className="text-gray-800 dark:text-white" />
              )}
            </button>
          </div>

          {/* Bottom row: tabs */}
          <div className="flex justify-center sm:justify-start items-center gap-2 w-full">
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap bg-gray-100 dark:bg-gray-800 p-2 rounded-full max-w-full border border-primary-100 dark:border-primary-900">
              <button
                onClick={() => setActiveTab('search')}
                className={tabClass(activeTab === 'search')}
                aria-label="Search Tab"
              >
                <FiSearch className="inline-block" /> Search
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                className={tabClass(activeTab === 'bookmarks')}
                aria-label="Bookmarks Tab"
              >
                <FiBookmark className="inline-block" /> Bookmarks
              </button>
            </div>
          </div>
        </header>


        {/* Tab: Search */}
        {activeTab === 'search' && (
          <>
            <div className="card mb-10 shadow-none bg-white/90 dark:bg-gray-800/90 rounded-xl">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 w-full">
                  <div className="relative w-full lg:w-44">
                    <Listbox value={searchType} onChange={setSearchType}>
                      {({ open }) => (
                        <>
                          <Listbox.Button className={`relative w-full rounded-full border-2 border-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-base py-2 px-4 pr-10 font-semibold text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary transition-colors flex items-center justify-between ${open ? 'ring-2 ring-primary-500' : ''}`}> 
                            {searchType === 'movie' ? 'Movies' : searchType === 'series' ? 'Series' : 'Episodes'}
                            <svg className="absolute right-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </Listbox.Button>
                          <Listbox.Options className="absolute z-10 mt-2 w-full rounded-xl bg-white dark:bg-gray-800 border border-primary shadow-lg focus:outline-none text-base font-semibold overflow-hidden">
                            <Listbox.Option value="movie" className={({ active, selected }) => `cursor-pointer px-5 py-2 ${active ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200' : ''} ${selected ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200' : 'text-gray-900 dark:text-white'}`}>Movies</Listbox.Option>
                            <Listbox.Option value="series" className={({ active, selected }) => `cursor-pointer px-5 py-2 ${active ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200' : ''} ${selected ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200' : 'text-gray-900 dark:text-white'}`}>Series</Listbox.Option>
                            <Listbox.Option value="episode" className={({ active, selected }) => `cursor-pointer px-5 py-2 ${active ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-200' : ''} ${selected ? 'bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200' : 'text-gray-900 dark:text-white'}`}>Episodes</Listbox.Option>
                          </Listbox.Options>
                        </>
                      )}
                    </Listbox>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchType === 'episode'
                        ? 'Search for series name...'
                        : 'Search for movies, series, or episodes...'
                    }
                    className="input flex-1 text-lg"
                  />
                
                  {searchType === 'episode' && (
                    <>
                      <input
                        type="number"
                        min="1"
                        placeholder="Season"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        className="input w-full lg:w-32 text-lg"
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Episode"
                        value={episode}
                        onChange={(e) => setEpisode(e.target.value)}
                        className="input w-full lg:w-32 text-lg"
                      />
                    </>
                  )}
                  <button type="submit" className="btn-primary text-lg lg:w-auto">Search</button>
                </div>
              </form>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Searching...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
                  Search Results
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
                  {searchResults.map((item) => (
                    <MovieCard
                      key={item.imdbID}
                      item={item}
                      isBookmarked={isBookmarked(item.imdbID)}
                      onToggleBookmark={() => toggleBookmark(item)}
                      isWholeSeason={isWholeSeason}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab: Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div>
            <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">My Bookmarks</h2>
            
            {/* Movies Section */}
            {bookmarks.filter(item => item.Type === 'movie').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <FaFilm className="text-primary-600" />
                  Movies
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
                  {bookmarks.filter(item => item.Type === 'movie').map((item) => (
                    <MovieCard
                      key={item.imdbID}
                      item={item}
                      isBookmarked={true}
                      onToggleBookmark={() => toggleBookmark(item)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Series Section */}
            {bookmarks.filter(item => item.Type === 'series').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <FiBookmark className="text-primary-600" />
                  Series
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
                  {bookmarks.filter(item => item.Type === 'series').map((item) => (
                    <MovieCard
                      key={item.imdbID}
                      item={item}
                      isBookmarked={true}
                      onToggleBookmark={() => toggleBookmark(item)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Episodes Section */}
            {bookmarks.filter(item => item.Type === 'episode').length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <FiCalendar className="text-primary-600" />
                  Episodes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 justify-items-center">
                  {bookmarks.filter(item => item.Type === 'episode').map((item) => (
                    <MovieCard
                      key={item.imdbID}
                      item={item}
                      isBookmarked={true}
                      onToggleBookmark={() => toggleBookmark(item)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {bookmarks.length === 0 && (
              <div className="text-center py-12">
                <FiBookmark className="text-6xl mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-gray-500 dark:text-gray-500">
                  Add movies, series, or episodes to your bookmarks to see them here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function MovieCard({ item, isBookmarked, onToggleBookmark, isWholeSeason }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/details?id=${item.imdbID}`);
        const data = await response.json();
        if (data.Response === 'True') setDetails(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [item.imdbID]);

  return (
    <div className="card group max-w-[240px] mx-auto bg-white/95 dark:bg-gray-800/95 rounded-xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-all duration-200 cursor-pointer p-3 sm:p-0">
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={
            item.Poster !== 'N/A'
              ? item.Poster
              : isWholeSeason
                ? 'https://m.media-amazon.com/images/M/MV5BY2ExMTg4ZmEtZWE5YS00ZGMyLWE4NzgtY2IyODczZjJjODEwXkEyXkFqcGdeQXVyNTY3NjQzNjM@._V1_SX300.jpg'
                : '/placeholder-poster.jpg'
          }
          alt={item.Title}
          className="w-full aspect-[2/3] object-cover rounded-xl mb-3 border border-gray-200 dark:border-gray-700 group-hover:brightness-90 group-hover:scale-105 transition-all duration-200"
          onError={(e) => {
            e.target.src =
              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIFBvc3RlcjwvdGV4dD48L3N2Zz4=';
          }}
        />
        {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none rounded-xl" /> */}
        <button
          onClick={onToggleBookmark}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full transition-all"
          aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
          {isBookmarked ? <FaBookmark className="text-yellow-500" /> : <FiBookmark className="text-gray-800 dark:text-white" />}
        </button>
      </div>

      <div className="space-y-2 pb-2 px-2 pt-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white break-words leading-tight font-montserrat">{item.Title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
  <FiCalendar className="w-4 h-4" />
  <span>{item.Year}</span>
</div>

        {details && (
          <div className="space-y-1">
            {details.imdbRating !== 'N/A' && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiStar className="w-4 h-4 text-yellow-500" />
              <span>{details.imdbRating}/10</span>
            </div>
            )}
            {details.Runtime !== 'N/A' && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiClock className="w-4 h-4" />
              <span>{details.Runtime}</span>
            </div>
            )}
            {details.Genre !== 'N/A' && (
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiTag className="w-4 h-4" /> {/* Optional: use FiTag or FaTags for genre */}
              <span>{details.Genre}</span>
            </div>
            )}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            Loading details...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
