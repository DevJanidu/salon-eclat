export const SALON_DATA = {
  name: "Éclat Hair & Beauty Salon",
  tagline: "Glow with Éclat! Unveil Your Inner Glow.",
  aboutShort: "Éclat Beauty Salon offers premium hair, skin, and makeup services designed to enhance your natural beauty. With expert care, luxury products, and a warm atmosphere, we help you shine with confidence.",
  contact: {
    whatsapp: "94773049957",
    phone: "+94 777393482",
    email: "saloneclatmatale@gmail.com",
    address: "Matale, Sri Lanka",
    hours: "8.00am – 10.30pm",
  },
  location: {
    lat: 7.4486944,
    lng: 80.615,
    googleMapsLink: "https://www.google.com/maps/place/7%C2%B026'55.3%22N+80%C2%B036'54.0%22E/@7.4486944,80.615,17z/data=!3m1!4b1!4m4!3m3!8m2!3d7.4486944!4d80.615?entry=ttu&g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3956.149615096844!2d80.615!3d7.448694400000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwMjYnNTUuMyJOIDgwwrAzNic1NC4wIkU!5e0!3m2!1sen!2slk!4v1772698240675!5m2!1sen!2slk"
  },
  social: {
    tiktok: "https://www.tiktok.com/@eclat.hair.beauty?_t=ZS-8yot1ffC9s9&_r=1",
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
