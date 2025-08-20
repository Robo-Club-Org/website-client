// ShippingInfo.tsx
// Page for Shipping Information

import React from "react";

const ShippingInfo = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 opacity-90"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Shipping
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Information
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Learn about our shipping policies, delivery times, and costs for your orders.
          </p>
          <div className="max-w-2xl mx-auto mb-8 bg-white/90 rounded-xl p-8 shadow-lg backdrop-blur-sm">
            <ul className="space-y-4 text-left text-blue-900 text-lg">
              <li><strong>Delivery Times:</strong> Most orders ship within 1-2 business days.</li>
              <li><strong>Shipping Costs:</strong> Calculated at checkout based on location and order size.</li>
              <li><strong>Tracking:</strong> You will receive a tracking number once your order ships.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingInfo;
