import { Home, BedDouble, Truck, Sparkles } from "lucide-react";

export default function FurnitureHighlights() {
  const highlights = [
    {
      icon: <Home className="h-8 w-8 text-pink-500" />,
      title: "Premium Craftsmanship",
      description: "Beautifully designed and expertly crafted furniture pieces.",
      bg: "bg-pink-100",
    },
    {
      icon: <BedDouble className="h-8 w-8 text-indigo-500" />,
      title: "Durable Materials",
      description: "Made from long-lasting wood and high-quality finishes.",
      bg: "bg-indigo-100",
    },
    {
      icon: <Truck className="h-8 w-8 text-emerald-500" />,
      title: "Hassle-Free Delivery",
      description: "On-time delivery with careful packaging and installation.",
      bg: "bg-emerald-100",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
      title: "Timeless Designs",
      description: "Stylish and functional furniture to elevate your space.",
      bg: "bg-yellow-100",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-gray-100 via-white to-gray-100 w-11/12 mx-auto rounded-2xl shadow-md">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-white ${item.bg}`}
            >
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-md mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
