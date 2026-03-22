import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">Contact Us</h1>
          <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
            Have a question about an order or a book request? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="lg:col-span-1 bg-brand-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-brand-50">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-gold-400 mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <div>
                    <p className="font-semibold text-brand-50">Head Office</p>
                    <p className="text-brand-200 mt-1">123 Book Lane,<br />Colombo 03,<br />Sri Lanka</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-gold-400 mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  <div>
                    <p className="font-semibold text-brand-50">Phone</p>
                    <p className="text-brand-200 mt-1">+94 11 234 5678</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-gold-400 mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <div>
                    <p className="font-semibold text-brand-50">Email</p>
                    <p className="text-brand-200 mt-1">support@wearta.lk</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <p className="text-sm text-brand-200">
                Business Hours: Mon-Fri, 9am - 5pm.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-fade-in-up">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Message Sent!</h3>
                <p className="text-slate-500">Thank you for reaching out to us. We will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="label">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="input-field" 
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="label">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="input-field" 
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="label">Message</label>
                  <textarea 
                    id="message" 
                    rows="5" 
                    required
                    className="input-field resize-none" 
                    placeholder="How can we help you today?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary w-full md:w-auto">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
