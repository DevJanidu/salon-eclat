import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Navigation,
  Send,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SALON_DATA, getWhatsAppLink, getEmailLink } from "@/config/constants";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 bg-bg">
      {/* Header */}
      <section className="px-6 mb-12 md:mb-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-text-primary mb-6"
          >
            Get in <span className="text-salon-gold italic">Touch</span>
          </motion.h1>
          <p className="text-text-secondary max-w-2xl mx-auto font-light text-lg">
            We're here to help you unveil your inner glow. Reach out for
            appointments, inquiries, or just to say hello.
          </p>
        </div>
      </section>

      <section className="px-6 mb-16 md:mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            {/* Contact Info */}
            <div className="space-y-12">
              <div data-aos="fade-right">
                <h3 className="text-3xl font-serif font-bold text-text-primary mb-8">
                  Contact Information
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-salon-gold" />
                    </div>
                    <div>
                      <p className="text-text-primary font-bold mb-1">
                        Our Location
                      </p>
                      <p className="text-text-secondary font-light">
                        {SALON_DATA.contact.address}
                      </p>
                      <a
                        href={SALON_DATA.location.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-salon-gold text-sm font-bold uppercase tracking-widest mt-2 inline-flex items-center hover:underline"
                      >
                        <Navigation className="w-3 h-3 mr-1" /> Get Directions
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-salon-gold" />
                    </div>
                    <div>
                      <p className="text-text-primary font-bold mb-1">
                        Phone Number
                      </p>
                      <p className="text-text-secondary font-light">
                        {SALON_DATA.contact.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center shrink-0">
                      <MessageSquare className="w-6 h-6 text-salon-gold" />
                    </div>
                    <div>
                      <p className="text-text-primary font-bold mb-1">
                        WhatsApp
                      </p>
                      <p className="text-text-secondary font-light">
                        +{SALON_DATA.contact.whatsapp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-salon-gold" />
                    </div>
                    <div>
                      <p className="text-text-primary font-bold mb-1">
                        Email Address
                      </p>
                      <p className="text-text-secondary font-light">
                        {SALON_DATA.contact.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-salon-gold/10 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-salon-gold" />
                    </div>
                    <div>
                      <p className="text-text-primary font-bold mb-1">
                        Opening Hours
                      </p>
                      <p className="text-text-secondary font-light">
                        {SALON_DATA.contact.hours}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-6 md:p-10 bg-secondary-bg rounded-3xl border border-border-color"
                data-aos="fade-up"
              >
                <h4 className="text-2xl font-serif font-bold text-text-primary mb-6">
                  Quick Actions
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link to="/book">
                    <Button className="w-full bg-salon-gold hover:bg-salon-gold-hover text-white shadow-lg shadow-salon-gold/20 tracking-wide">
                      <Calendar className="w-5 h-5 mr-2" /> Book Now
                    </Button>
                  </Link>
                  <a href={getEmailLink()}>
                    <Button className="w-full bg-surface hover:bg-secondary-bg text-text-primary border border-border-color tracking-wide">
                      <Send className="w-5 h-5 mr-2" /> Email Us
                    </Button>
                  </a>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div
              className="h-72 md:h-[600px] rounded-3xl md:rounded-[3rem] overflow-hidden border border-border-color shadow-2xl"
              data-aos="fade-left"
            >
              <iframe
                src={SALON_DATA.location.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Salon Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ / Note */}
      <section className="px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-text-secondary font-light italic">
            Note: For bridal bookings and special events, we recommend
            contacting us at least 2-3 months in advance to ensure availability.
          </p>
        </div>
      </section>
    </div>
  );
}
