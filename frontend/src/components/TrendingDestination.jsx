import DestinationCard from './DestinationCard'
import { getDestinationImage } from './destinationData'

const labels = ['Popular', 'Hot Deal', 'Popular', 'Cultural', 'Hot Deal', 'Popular']

const normalizeDestination = (destination, index, images) => ({
  ...destination,
  title: destination.title || destination.name,
  image: destination.mainImage || destination.cardImage || getDestinationImage(destination, images),
  label: labels[index],
  featured: index === 2,
})

function TrendingDestination({ destinations = [], images = [], onViewAll, onViewDetails }) {
  const trendingDestinations = destinations
    .filter((destination) => destination.status !== 'inactive')
    .slice(0, 6)
    .map((destination, index) => normalizeDestination(destination, index, images))

  return (
    <section className="destination-section" id="destinations">
      <div className="section-title-row">
        <h2>Trending Destinations</h2>
        <button type="button" onClick={onViewAll}>View All</button>
      </div>

      <div className="destination-grid">
        {trendingDestinations.map((destination) => (
          <DestinationCard
            key={destination._id || `${destination.title}-${destination.duration}`}
            onClick={onViewDetails ? () => onViewDetails({ ...destination, location: destination.region, image: destination.image }) : undefined}
            {...destination}
          />
        ))}
      </div>
    </section>
  )
}

export default TrendingDestination
