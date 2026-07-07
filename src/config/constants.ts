export const SALON_DATA = {
  name: "Éclat Hair & Beauty Salon New York",
  tagline: "Glow with Éclat! Unveil Your Inner Glow.",
  aboutShort: "Éclat Beauty Salon offers premium hair, skin, and makeup services designed to enhance your natural beauty. With expert care, luxury products, and a warm atmosphere, we help you shine with confidence.",
  contact: {
    whatsapp: "12125550199",
    phone: "+1 (212) 555-0199",
    email: "hello@eclatsalonnyc.com",
    address: "Manhattan, New York, NY 10001",
    hours: "8.00am – 10.30pm",
  },
  location: {
    lat: 40.7580,
    lng: -73.9855,
    googleMapsLink: "https://www.google.com/maps/place/Times+Square/@40.7580,-73.9855,15z",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280010994!2d-74.14482937965902!3d40.69766374859258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
  },
  social: {
    tiktok: "#",
    instagram: "#",
    facebook: "#",
  },
  serviceCategories: [
    "Hair",
    "Beauty",
    "Herbal spa",
    "Massaging Therapy",
    "Manicure & Pedicure",
    "Gel Nails",
    "Makeup",
    "Waxing",
    "Threading"
  ]
};

export const getWhatsAppLink = (service?: string) => {
  const base = `https://wa.me/${SALON_DATA.contact.whatsapp}?text=`;
  const message = `Hi Éclat Hair & Beauty Salon, I’d like to book an appointment.
Name: 
Service: ${service || ''}
Preferred Date: 
Preferred Time: 
Notes: `;
  return base + encodeURIComponent(message);
};

export const getEmailLink = () => {
  const subject = encodeURIComponent("Appointment Request – Éclat Hair & Beauty Salon");
  const body = encodeURIComponent(`Hi Éclat Hair & Beauty Salon, I’d like to book an appointment.
Name: 
Service: 
Preferred Date: 
Preferred Time: 
Notes: `);
  return `mailto:${SALON_DATA.contact.email}?subject=${subject}&body=${body}`;
};

