const BrandSidebar = () => {
  const brands = [
    'Allin Cue',
    'Wolf Cue',
    'ShengDao',
    'TY',
    'Rhino',
    'Peri',
    'Fury',
    'MIT',
    'Cuetec',
    'Unicues'
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="bg-xbilliard-red text-white p-4 font-bold uppercase text-center">
        Các thương hiệu
      </div>
      <ul className="divide-y">
        {brands.map((brand, idx) => (
          <li 
            key={idx}
            className="p-3 hover:bg-red-50 cursor-pointer transition-all font-semibold text-gray-700 hover:text-xbilliard-red"
          >
            {brand}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BrandSidebar;
