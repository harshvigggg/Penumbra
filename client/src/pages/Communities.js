import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/communities')
      .then((res) => res.json())
      .then((data) => {
        setCommunities(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch communities:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="communities-page">
      <div className="communities-header">
        <h2>All Communities</h2>
        <Link to="/create-community">+ Create Community</Link>
      </div>

      {communities.length === 0 && (
        <p>No communities yet. Create the first one!</p>
      )}

      <div className="communities-list">
        {communities.map((community) => (
          <div key={community.id} className="community-card">
            <Link to={`/c/${community.slug}`}>
              <h3>c/{community.name}</h3>
            </Link>
            <p>{community.description}</p>
            <span>{community.member_count} members</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Communities;
