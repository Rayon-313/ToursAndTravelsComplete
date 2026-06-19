import Header from './header';
import SiteFooter from './SiteFooter';

import hero from '../assets/8d79f0d9-62cf-4237-a351-07d7329955d7.jpg';

function StoriesPage({ stories, onNavigate, onViewItinerary }) {
  const heroImage = hero;
  const safeStories = Array.isArray(stories) ? stories : [];

  const completedAdventures = safeStories.length > 0
    ? safeStories.map((story, idx) => ({
        id: story?._id || idx,
        title: story?.title || 'Untitled Adventure',
        date: story?.date ? new Date(story.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Recent',
        price: story?.price ? `Rs. ${story.price}` : 'Rs. 0',
        description: story?.description || '',
        image: story?.image || '',
        stats: [
          { label: 'Travelers', value: story?.travelers || 'N/A' },
          { label: 'Stay', value: story?.duration || 'N/A' },
          { label: 'Status', value: 'Completed' },
        ]
      }))
    : [];

  return (
    <div className="bookings-page">
      <section className="destination-page-hero bookings-page-hero">
        <img className="destination-page-hero-image" src={heroImage} alt="Hero" />
        <div className="destination-page-hero-overlay" />
        <Header activePage="stories" onNavigate={onNavigate} />
      </section>

      <main className="bookings-page-main" id="bookings">
        <section className="next-adventure" aria-labelledby="recent-adventure-title">
          <div className="booking-section-title">
            <h2 id="recent-adventure-title">Past Adventures</h2>
            <div className="booking-welcome">
               <a href="#destinations" onClick={(e) => { e.preventDefault(); onNavigate('destinations'); }}>
                 Book Your Next Trip
               </a>
            </div>
          </div>

          {completedAdventures.length === 0 && (
            <p className="empty-destination-message">No stories available yet.</p>
          )}

          {completedAdventures.map((trip) => (
            <article className="next-adventure-card completed-card" key={trip.id}>
              <img src={trip.image} alt={trip.title} />
              <div className="next-adventure-body">
                <div>
                  <div className="status-container">
                    <h3>{trip.title}</h3>
                    <span className="completed-badge">✓ Done</span>
                    <p>{trip.description}</p>
                  </div>
                  <ul className="booking-meta">
                    {trip.stats.map((stat) => (
                      <li key={stat.label}>
                        <span>{stat.label}</span>
                        {stat.value}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="booking-progress completed" aria-hidden="true">
                  <div className="progress-line full" style={{ width: '100%', backgroundColor: '#4CAF50' }} />
                </div>

                <button
                  className="view-itinerary-button"
                  type="button"
                  onClick={() =>
                    onViewItinerary?.({
                      title: trip.title || 'Adventure',
                      location: (trip.title || '').split(' ')[0] || 'Destination',
                      price: trip.price,
                      rating: '5.0',
                      label: 'Trip Summary',
                      image: trip.image,
                      source: 'history',
                    })
                  }
                >
                  Book Your Trip
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}

export default StoriesPage;
