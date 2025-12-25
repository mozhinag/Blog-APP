import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PublicPosts from '../components/PublicPosts';

function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <>
      <Navbar />

      <div className="d-flex">
        <Sidebar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        <div className="flex-grow-1 p-4">
          {/* <h4 className="fw-bold mb-4">All Blog Posts</h4> */}

          {/* Only READ-ONLY posts */}
          <PublicPosts selectedCategory={selectedCategory} />
        </div>
      </div>
    </>
  );
}

export default Home;
