function Sidebar({ selectedCategory, setSelectedCategory }) {
  const categories = ['All', 'Travel', 'Food', 'Lifestyle', 'Tech'];

  return (
    <div
      className="p-3 border-end"
      style={{ width: '200px', height: '100vh' }}
    >
      <h5
        className="fw-bold mb-3"
        style={{ color: '#25b6acff' }}
      >
        Categories
      </h5>

      {categories.map((cat) => (
        <button
          key={cat}
          className={`btn btn-secondary w-100 mb-2 ${
            selectedCategory === cat ? 'btn-secondary' : 'btn-light'
          }`}
          onClick={() => setSelectedCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;
