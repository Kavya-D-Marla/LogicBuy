import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone, ArrowRight, Globe, MessageCircle, Share2, Play } from 'lucide-react';

const footerLinks = {
  'About LogicBuy': [
    { name: 'Our Story', to: '/' },
    { name: 'Careers', to: '/' },
    { name: 'Press', to: '/' },
    { name: 'Blog', to: '/' },
  ],
  'Customer Service': [
    { name: 'Contact Us', to: '/' },
    { name: 'Shipping Info', to: '/' },
    { name: 'Returns & Exchange', to: '/' },
    { name: 'FAQ', to: '/' },
  ],
  'Quick Links': [
    { name: 'New Arrivals', to: '/shop' },
    { name: 'Best Sellers', to: '/shop' },
    { name: 'Sale', to: '/shop' },
    { name: 'Gift Cards', to: '/' },
  ],
};

const socials = [
  { icon: Globe, label: 'Instagram' },
  { icon: MessageCircle, label: 'Twitter' },
  { icon: Share2, label: 'Facebook' },
  { icon: Play, label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-neutral-950 text-neutral-400 mt-auto border-t border-neutral-900">
      {/* Gradient bar */}
      <div className="h-1 gradient-bg" />

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-md">
                <span className="text-white font-heading font-bold text-sm">L</span>
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                Logic<span className="text-pink">Buy</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-6 max-w-sm text-neutral-400">
              Your algorithm-powered fashion destination. Discover trending styles with smart recommendations
              tailored just for you.
            </p>

            {/* Newsletter */}
            <div className="max-w-md">
              <p className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Subscribe to our newsletter</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input w-full pl-9 pr-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:border-pink focus:outline-none transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg gradient-bg text-white text-xs font-semibold hover:shadow-lg hover:opacity-90 transition-all flex items-center gap-1"
                >
                  {subscribed ? '✓ Subscribed!' : <><ArrowRight size={14} /></>}
                </button>
              </form>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-xs mb-4 uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="text-xs hover:text-pink transition-colors">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-neutral-500">
            © 2026 LogicBuy. All rights reserved. Made with <Heart size={10} className="inline text-pink mx-0.5" fill="currentColor" /> by LogicBuy Team
          </p>
          <div className="flex items-center gap-2.5">
            {socials.map(({ icon: Icon, label }) => (
              <button key={label} aria-label={label} className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center hover:border-pink hover:bg-pink/10 hover:text-pink transition-all">
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
