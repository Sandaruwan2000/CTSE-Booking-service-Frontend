import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getBookById } from '../services/api';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await getBookById(id);
        setBook(data.book);
      } catch (err) {
        setError(err.response?.data?.message || 'Book not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (!book || book.stock === 0) return;
    addToCart(book, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="relative w-24 h-24">
           <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin"></div>
           <div className="absolute inset-2 rounded-full border-r-2 border-gold-400 animate-ping"></div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center bg-white">
         <svg className="w-20 h-20 text-slate-300 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
         </svg>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Volume Missing</h1>
        <p className="max-w-md text-lg text-slate-500 mb-8">{error}</p>
        <button type="button" onClick={() => navigate('/books')} className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-full font-bold transition-transform hover:scale-105 shadow-lg shadow-brand-500/30">
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top minimal nav */}
      <div className="w-full px-6 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
         <button onClick={() => navigate('/books')} className="group flex items-center text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK TO COLLECTION
         </button>
         <span className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${book.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            {book.stock > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
         </span>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Visual Panel */}
        <div className="w-full lg:w-5/12 xl:w-1/2 bg-brand-50/50 p-8 lg:p-20 flex items-center justify-center lg:sticky lg:top-[88px] lg:h-[calc(100vh-88px)]">
           <div className="relative group w-full max-w-sm xl:max-w-md perspective-1000">
              <div className="absolute -inset-4 bg-gradient-to-tr from-brand-300 to-gold-300 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-700"></div>
              <img 
                 src={book.image} 
                 alt={book.title} 
                 className="relative z-10 w-full h-auto object-cover rounded-2xl shadow-2xl transform transition-transform duration-700 hover:scale-105" 
              />
           </div>
        </div>

        {/* Right Info Panel */}
        <div className="w-full lg:w-7/12 xl:w-1/2 px-6 py-12 lg:p-20 xl:p-24 bg-white">
            <div className="mb-6 flex gap-3 flex-wrap">
               <span className="px-4 py-1.5 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-widest rounded-full bg-brand-50">
                  {book.category}
               </span>
               <span className="px-4 py-1.5 border border-slate-200 text-slate-500 text-xs font-mono tracking-wider rounded-full bg-slate-50">
                  ID: {book._id.slice(-6)}
               </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4">
               {book.title}
            </h1>
            <p className="text-xl sm:text-2xl text-slate-500 font-medium mb-10 flex items-center gap-3">
               <span className="w-8 h-[2px] bg-gold-400"></span>
               {book.author}
            </p>

            <div className="flex items-end gap-4 mb-12">
               <span className="text-5xl sm:text-6xl font-extrabold text-brand-600 tracking-tighter">
                  Rs. {Number(book.price).toLocaleString()}
               </span>
            </div>

            <div className="prose prose-lg text-slate-600 mb-14 leading-relaxed">
               <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-wide uppercase">Synopsis</h3>
               <p>{book.description}</p>
            </div>

            {/* Sticky/Floating Purchase Bar */}
            <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 lg:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
               
               <div className="flex-1 w-full">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center sm:text-left">Quantity</p>
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-full p-1.5 w-full sm:w-40 shadow-inner">
                     <button
                        type="button"
                        disabled={quantity <= 1 || book.stock === 0}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        onClick={() => setQuantity((q) => q - 1)}
                     >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" /></svg>
                     </button>
                     <span className="text-lg font-bold text-slate-800 w-10 text-center">{quantity}</span>
                     <button
                        type="button"
                        disabled={quantity >= book.stock || book.stock === 0}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        onClick={() => setQuantity((q) => q + 1)}
                     >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                     </button>
                  </div>
               </div>

               <div className="flex-1 w-full flex flex-col gap-3">
                  <button
                     type="button"
                     onClick={handleAddToCart}
                     disabled={book.stock === 0}
                     className={`w-full py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 transform shadow-xl flex justify-center items-center gap-3 ${
                        book.stock === 0 
                           ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                           : added 
                              ? 'bg-emerald-500 text-white shadow-emerald-500/40 scale-105'
                              : 'bg-slate-900 text-white hover:bg-brand-600 hover:shadow-brand-500/30'
                     }`}
                  >
                     {added ? (
                        <>
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                           Secured!
                        </>
                     ) : book.stock === 0 ? (
                        'Sold Out'
                     ) : (
                        <>
                           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                           Bag it
                        </>
                     )}
                  </button>
                  
                  {added && (
                     <div className="text-center animate-fade-in-up">
                        <Link to="/cart" className="text-sm font-bold text-brand-600 hover:text-brand-800 underline underline-offset-4 decoration-2 transition-colors">
                           Proceed to Checkout →
                        </Link>
                     </div>
                  )}
               </div>

            </div>
            
            <p className={`mt-6 text-center text-sm font-semibold tracking-wide ${book.stock > 0 && book.stock <= 5 ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`}>
               {book.stock > 0 && book.stock <= 5 ? `Hurry! Only ${book.stock} copies left.` : book.stock > 0 ? `${book.stock} units physically available.` : ''}
            </p>

        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
