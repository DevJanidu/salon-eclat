import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, MessageSquare, Mail, Calendar, MapPin, Scissors, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookingSuccessPage() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="pt-32 pb-24 px-6 text-center">
        <h1 className="text-2xl font-serif font-bold mb-4">No Booking Found</h1>
        <Link to="/book">
          <Button>Go to Booking</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-bg min-h-screen">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-salon-gold rounded-full flex items-center justify-center mx-auto mb-8 text-white"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4"
        >
          Booking Confirmed!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary mb-12"
        >
          Thank you for choosing Salon Premium. We've received your request and look forward to seeing you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-3xl border border-border-color p-8 text-left mb-12 shadow-sm"
        >
          <h3 className="font-serif font-bold text-xl mb-6 border-b border-border-color pb-4">Booking Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-text-secondary">
              <MapPin className="w-5 h-5 text-salon-gold" />
              <span><span className="font-bold text-text-primary">Branch:</span> {booking.branch.toUpperCase()} Branch</span>
            </div>
            <div className="flex items-start gap-4 text-text-secondary">
              <Scissors className="w-5 h-5 text-salon-gold shrink-0 mt-1" />
              <div>
                <p className="font-bold text-text-primary">Services:</p>
                <ul className="list-disc list-inside text-sm mt-1">
                  {booking.services.map((s: string) => (
                    <li key={s}>{s.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-4 text-text-secondary">
              <Calendar className="w-5 h-5 text-salon-gold" />
              <span><span className="font-bold text-text-primary">Date & Time:</span> {booking.date} at {booking.time}</span>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <Link to="/" className="w-full max-w-xs">
            <Button variant="outline" className="w-full">
              Return to Home <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
