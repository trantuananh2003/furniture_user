import React, { useState } from "react";

function FavoriteUser() {
  const [favorites, setFavorites] = useState([
    { id: 1, name: "Sản phẩm 1", image: "https://via.placeholder.com/150", brand: "Hãng A", category: "Danh mục X" },
    { id: 2, name: "Sản phẩm 2", image: "https://via.placeholder.com/150", brand: "Hãng B", category: "Danh mục Y" },
    { id: 3, name: "Sản phẩm 3", image: "https://via.placeholder.com/150", brand: "Hãng A", category: "Danh mục X" },
  ]);

  const [filterBrand, setFilterBrand] = useState("Tất cả");
  const [filterCategory, setFilterCategory] = useState("Tất cả");

  const handleRemoveFavorite = (id: number) => {
    setFavorites(favorites.filter((item) => item.id !== id));
  };

  const filteredFavorites = favorites.filter((item) => {
    const matchesBrand = filterBrand === "Tất cả" || item.brand === filterBrand;
    const matchesCategory = filterCategory === "Tất cả" || item.category === filterCategory;
    return matchesBrand && matchesCategory;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Danh mục yêu thích</h1>

      {/* Bộ lọc */}
      <div className="flex space-x-4 mb-4">
        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Tất cả">Tất cả hãng</option>
          <option value="Hãng A">Hãng A</option>
          <option value="Hãng B">Hãng B</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Tất cả">Tất cả danh mục</option>
          <option value="Danh mục X">Danh mục X</option>
          <option value="Danh mục Y">Danh mục Y</option>
        </select>
      </div>

      {/* Danh sách sản phẩm */}
      {filteredFavorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-cover rounded-md mb-4"
              />
              <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
              <button
                onClick={() => handleRemoveFavorite(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Hủy yêu thích
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">Không có sản phẩm phù hợp với bộ lọc.</p>
      )}
    </div>
  );
}

export default FavoriteUser;
