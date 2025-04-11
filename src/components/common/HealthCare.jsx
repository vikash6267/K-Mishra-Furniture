import React from 'react';
import { BadgePercent, UtensilsCrossed, BedDouble } from 'lucide-react';

const FurnitureOffers = () => {
  const offers = [
    {
      id: 1,
      title: "50% Off Sofas",
      description: "Comfortable and modern sofas at half the price!",
      icon: <BadgePercent className="h-8 w-8 text-pink-500" />,
      bg: "bg-pink-100",
    },
    {
      id: 2,
      title: "Dining Sets Offer",
      description: "Get a complete set at unbelievable price.",
      icon: <UtensilsCrossed className="h-8 w-8 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      id: 3,
      title: "Bedroom Essentials",
      description: "Upgrade your bedroom with stylish pieces.",
      icon: <BedDouble className="h-8 w-8 text-indigo-500" />,
      bg: "bg-indigo-100",
    },
  ];

  return (
    <section className="py-14 px-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-2xl w-11/12 mx-auto shadow-md">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">🎁 Exciting Offers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`p-6 rounded-xl shadow-md transform transition duration-300 hover:scale-105 hover:bg-white ${offer.bg}`}
          >
            <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full shadow mb-4 mx-auto">
              {offer.icon}
            </div>
            <h3 className="text-lg font-bold text-center text-gray-800 mb-2">{offer.title}</h3>
            <p className="text-sm text-center text-gray-600">{offer.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FurnitureOffers;
