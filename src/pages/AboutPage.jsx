import React from 'react';

const AboutPage = () => {
  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            About <span className="text-brand-600">Wearta.lk</span>
          </h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Your premium destination for discovering and collecting the world's most compelling stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-100 transform -skew-y-6 rounded-3xl z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Library interior" 
              className="relative z-10 rounded-2xl shadow-xl w-full object-cover h-96"
            />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              At Wearta.lk, we believe that books have the power to transform lives. We started this journey with a simple goal: to make reading accessible, enjoyable, and seamless for everyone.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              Our curated collection spans across genres, ensuring that whether you're looking for an academic textbook, a gripping thriller, or a timeless classic, you'll find it here. We pride ourselves on offering competitive prices while supporting authors and publishers.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                10+
              </div>
              <p className="text-slate-700 font-medium">Years of spreading the joy of reading across the country.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
