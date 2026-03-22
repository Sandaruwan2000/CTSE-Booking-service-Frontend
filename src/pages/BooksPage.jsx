import { useEffect, useState } from 'react';
import BookCard from '../components/books/BookCard';
import { getBooks } from '../services/api';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await getBooks();
        setBooks(data.books);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch the library.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const categories = ['All', ...new Set(books.map((book) => book.category))];
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
    const matchesSearch = !normalizedSearch
      || book.title.toLowerCase().includes(normalizedSearch)
      || book.author.toLowerCase().includes(normalizedSearch)
      || book.description.toLowerCase().includes(normalizedSearch);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimalist Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
              The Collection
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl">
              Curated reading materials for every mind. Discover the latest arrivals and all-time classics.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0 w-full md:w-96 relative group z-10">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm placeholder-slate-400 outline-none ring-2 ring-transparent focus:border-brand-500 focus:ring-brand-500/20 shadow-sm transition-all"
              placeholder="Search author, title, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pills Row */}
        <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-8 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30 transform -translate-y-0.5'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-300 hover:text-brand-700 hover:bg-slate-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-medium animate-pulse tracking-wide">Curating your library...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50/80 backdrop-blur border-l-4 border-red-500 p-6 rounded-r-xl shadow-sm max-w-3xl mx-auto mt-12">
            <h3 className="text-red-800 font-bold text-lg mb-1 flex items-center gap-2">
               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
               Display Error
            </h3>
            <p className="text-red-700 ml-7">{error}</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
               <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
               </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3">No volumes found</h2>
            <p className="text-slate-500 text-lg max-w-md">We couldn't find any books matching "{searchTerm}" in the {activeCategory} category.</p>
            <button 
              onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
              className="mt-8 px-6 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-full hover:bg-slate-200 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => (
              <div key={book._id} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-400 to-gold-400 rounded-3xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <div className="relative h-full transform transition duration-500 group-hover:-translate-y-1">
                  <BookCard book={book} />
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default BooksPage;
