import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Send, CheckCircle2, MessageSquare, Trash2 } from 'lucide-react';
import { personalInfo } from '../data';

interface ContactProps {
  onClose?: () => void;
  isModal?: boolean;
}

interface LocalMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
}

export default function Contact({ onClose, isModal = false }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedMessages, setSavedMessages] = useState<LocalMessage[]>([]);

  // Load saved messages from LocalStorage to make it highly interactive
  useEffect(() => {
    try {
      const stored = localStorage.getItem('portfolio_messages');
      if (stored) {
        setSavedMessages(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load local messages:', e);
    }
  }, []);

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!formData.name.trim()) tempErrors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email format.';
    }
    if (!formData.subject.trim()) tempErrors.subject = 'Subject heading is required.';
    if (!formData.message.trim()) tempErrors.message = 'Please write a message content.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate standard network delivery delay (1.2 seconds)
    setTimeout(() => {
      try {
        const newMessage: LocalMessage = {
          id: Date.now().toString(),
          ...formData,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updated = [newMessage, ...savedMessages];
        localStorage.setItem('portfolio_messages', JSON.stringify(updated));
        setSavedMessages(updated);

        setIsSubmitting(false);
        setIsSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });

        // Auto transition back to form after 3.5 seconds
        setTimeout(() => {
          setIsSuccess(false);
        }, 3500);

      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
      }
    }, 1200);
  };

  const clearMessages = () => {
    try {
      localStorage.removeItem('portfolio_messages');
      setSavedMessages([]);
    } catch (e) {
      console.error(e);
    }
  };

  const formContent = (
    <div className="space-y-6">
      <div className="text-left">
        <h3 className="text-2xl font-extrabold text-white">Let's connect!</h3>
        <p className="text-sm text-slate-400 font-sans mt-1">
          Have an exciting project or integration in mind? Drop me a message and I'll get back to you within 24 hours.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form
            key="contact-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4 text-left"
            id="form-contact-fields"
          >
            {/* Name Input */}
            <div>
              <label htmlFor="name-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Full Name
              </label>
              <input
                id="name-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm font-sans text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-slate-850'
                }`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-xxs text-red-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Email Address
              </label>
              <input
                id="email-input"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm font-sans text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-slate-850'
                }`}
                placeholder="john.doe@company.com"
              />
              {errors.email && <p className="text-xxs text-red-500 mt-1 font-semibold">{errors.email}</p>}
            </div>

            {/* Subject Input */}
            <div>
              <label htmlFor="subject-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Subject Heading
              </label>
              <input
                id="subject-input"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm font-sans text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors ${
                  errors.subject ? 'border-red-500' : 'border-slate-850'
                }`}
                placeholder="Collaboration, consulting request, etc."
              />
              {errors.subject && <p className="text-xxs text-red-500 mt-1 font-semibold">{errors.subject}</p>}
            </div>

            {/* Message Textarea */}
            <div>
              <label htmlFor="message-input" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Your Message
              </label>
              <textarea
                id="message-input"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm font-sans text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors resize-none ${
                  errors.message ? 'border-red-500' : 'border-slate-850'
                }`}
                placeholder="Describe your goals, tech stack preferences, or general questions..."
              />
              {errors.message && <p className="text-xxs text-red-500 mt-1 font-semibold">{errors.message}</p>}
            </div>

            {/* Submit CTA Button */}
            <button
              id="contact-submit-button"
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-500 transition-all duration-300 shadow-md shadow-indigo-600/10 flex items-center justify-center space-x-2 cursor-pointer ${
                isSubmitting ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying & Sending...</span>
                </>
              ) : (
                <>
                  <span>Send Message</span>
                  <Send className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-indigo-500/10 rounded-2xl p-6 border border-indigo-500/20"
            id="contact-success-screen"
          >
            <div className="p-3 bg-indigo-600 text-white rounded-full shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
            <p className="text-sm text-slate-300 max-w-sm font-sans leading-relaxed">
              Thank you for reaching out! Your message was delivered successfully to Shukurillokh Mamarasulov. It has also been stored below in your browser's local state.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const localLogContent = (
    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <span className="font-extrabold text-sm">Local Transmission Log</span>
          </div>
          {savedMessages.length > 0 && (
            <button
              id="clear-messages-btn"
              onClick={clearMessages}
              className="text-xxs font-bold text-red-400 hover:text-red-300 bg-red-500/10 px-2 py-1 rounded-md transition-all flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
        
        <p className="text-xs text-slate-400 font-sans text-left">
          Because this is a serverless frontend build, sent messages are stored instantly in client <strong>localStorage</strong>. Try typing a test message to see it appear live in the database console below!
        </p>

        {/* Local messages display */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto pt-2" id="local-messages-scroller">
          {savedMessages.length === 0 ? (
            <div className="py-12 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center text-slate-500 p-4">
              <MessageSquare className="w-8 h-8 opacity-30 mb-2" />
              <p className="text-xs font-mono font-medium">Log is currently empty</p>
              <p className="text-xxs font-sans text-slate-500 mt-0.5">Send a form submission to populate.</p>
            </div>
          ) : (
            savedMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-slate-950 border border-slate-850 rounded-xl p-4 shadow-sm text-left space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200"
                id={`local-msg-${msg.id}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-bold text-white">{msg.name}</h4>
                    <p className="text-xxs text-indigo-400 font-mono font-bold leading-none mt-0.5">{msg.email}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{msg.timestamp}</span>
                </div>
                <div className="border-t border-slate-900 pt-2">
                  <div className="text-xxs font-bold text-slate-400">SUB: {msg.subject}</div>
                  <p className="text-xs text-slate-300 font-sans mt-1 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info card footer */}
      <div className="pt-4 border-t border-slate-850 flex items-center space-x-3 text-left mt-6 relative z-10">
        <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Direct Contact</h4>
          <p className="text-xxs text-slate-400 font-mono">{personalInfo.email}</p>
        </div>
      </div>
    </div>
  );

  // If this component is being rendered inside a popup/modal dialog
  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" id="contact-overlay-modal">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="relative bg-slate-900 rounded-2xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl z-10 p-6 sm:p-8 border border-slate-800"
        >
          {/* Close button top right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close dialog"
            id="close-contact-modal-btn"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Grid dual layout in modal */}
          <div className="overflow-y-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 p-1">
              <div>{formContent}</div>
              <div>{localLogContent}</div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Otherwise, default standard view (e.g. scrollable footer section)
  return (
    <section id="contact" className="py-28 bg-slate-950 text-white border-t border-slate-900 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none animate-pulse duration-8000" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Grid Dual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-none">
              Let's craft something remarkable together
            </h2>
            <p className="text-base text-slate-400 font-sans">
              Whether you want to build a fully featured real-time collaborative system, migrate database architectures, or implement clean pixel-perfect frontends, I'm ready to collaborate.
            </p>

            {formContent}
          </div>

          <div className="lg:col-span-7 h-full w-full">
            {localLogContent}
          </div>
        </div>

      </div>
    </section>
  );
}

