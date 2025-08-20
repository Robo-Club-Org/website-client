// Returns.tsx
// Page for Returns information

import React from "react";

const Returns = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 opacity-90"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Returns
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              & Refunds
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Read about our return policy, how to initiate a return, and related FAQs.
          </p>
          <div className="max-w-2xl mx-auto mb-8 bg-white/90 rounded-xl p-8 shadow-lg backdrop-blur-sm">
            <ul className="space-y-4 text-left text-blue-900 text-lg">
              <li><strong>Return Policy:</strong> Returns accepted within 14 days of delivery.</li>
              <li><strong>How to Return:</strong> Contact support to initiate a return and receive instructions.</li>
              <li><strong>Refunds:</strong> Processed within 5 business days after receiving returned items.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Returns;
