// ContactUs.tsx
// Page for Contact Us information

import React from "react";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-jsonld";
import { Navigation } from "@/components/home/Navigation";
import { Footer } from "@/components/home/Footer";

const ContactUs = () => {
  return (
    <>
      <Navigation />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact-us" },
        ]}
      />
    <section className="relative bg-white">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            Contact
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Us
            </span>
          </h1>
          <p className="text-xl text-blue-900/70 mb-8 max-w-3xl mx-auto">
            If you have any questions or need support, please contact us using the information below or email us at <strong>roboclub.main@gmail.com</strong>.
          </p>
          <div className="max-w-2xl mx-auto mb-8 bg-white rounded-xl p-8 shadow-lg">
            <ul className="space-y-4 text-left text-blue-900/90 text-lg">
              <li><strong>Email:</strong> roboclub.main@gmail.com</li>
              <li><strong>Phone:</strong> +94729557537</li>
              <li><strong>Hours:</strong> Mon-Fri 9AM-6PM EST</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default ContactUs;
