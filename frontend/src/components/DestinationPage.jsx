import { useEffect, useMemo, useState } from 'react'
import Header from './header'
import SiteFooter from './SiteFooter'
import {
  baseDestinations,
  budgetMax,
  budgetMin,
  getDestinationImage,
  getDestinationTripDetails,
  regions,
  sortByCountryAndDuration,
} from './destinationData'

function DestinationPage({
  activePage = 'destinations',
  destinations = [],
  destinationsLoading = false,
  images = [],
  onNavigate,
  onViewDetails,
  searchQuery = '',
  selectedRegion = '',
  title = 'Curated experiences across 4 continents',
  eyebrow = 'Explore Destinations',
}) {
  const [heroImage] = images

  // Use API destinations if available, otherwise fallback to empty
  const destinationData = destinations.length > 0 ? destinations : baseDestinations

  // Extract unique regions and budget info from destinations
  const uniqueRegions = [...new Set(destinationData.map(d => d.region || d.title))].filter(Boolean)
  const availableRegions = uniqueRegions.length > 0 ? uniqueRegions : regions
  const maxPrice = destinationData.length > 0 
    ? Math.max(...destinationData.map(d => d.priceValue || parseInt(String(d.price || '').replace(/\D/g, '')) || 0))
    : budgetMax
  const budgetMaxValue = maxPrice > budgetMax ? maxPrice : budgetMax

  const [selectedRegions, setSelectedRegions] = useState(() =>
    selectedRegion && availableRegions.includes(selectedRegion) ? [selectedRegion] : [],
  )
  const [maxBudget, setMaxBudget] = useState(budgetMaxValue)
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()

  useEffect(() => {
    setMaxBudget(budgetMaxValue)
  }, [budgetMaxValue])

  const destinationPool = useMemo(
    () =>
      destinationData.map((destination, index) => ({
        ...destination,
        key: `dest-${destination._id || destination.region}-${index}`,
        reviewIndex: index,
      })),
    [destinationData],
  )

  const filteredDestinations = destinationPool
    .filter((destination) => {
      const destRegion = destination.region || destination.title
      const regionMatches = selectedRegions.length === 0 || selectedRegions.includes(destRegion)
      const searchMatches =
        normalizedSearchQuery.length === 0 ||
        `${destination.title} ${destination.region} ${destination.duration}`.toLowerCase().includes(normalizedSearchQuery)
      const price = destination.priceValue || parseInt(String(destination.price || '').replace(/\D/g, '')) || 0
      return regionMatches && price <= maxBudget && searchMatches
    })
    .sort(sortByCountryAndDuration)

  const toggleRegion = (region) => {
    setSelectedRegions((currentRegions) =>
      currentRegions.includes(region)
        ? currentRegions.filter((currentRegion) => currentRegion !== region)
        : [...currentRegions, region],
    )
  }

  const clearFilters = () => {
    setSelectedRegions([])
    setMaxBudget(budgetMaxValue)
  }

  return (
    <div className="destination-page">
      <section className="destination-page-hero">
        <img className="destination-page-hero-image" src={heroImage} alt="" />
        <div className="destination-page-hero-overlay" />
        <Header activePage={activePage} onNavigate={onNavigate} />
      </section>

      <main className="destination-page-main">
        <aside className="destination-filter-panel" aria-label="Destination filters">
          <div className="filter-title-row">
            <h2>Filters</h2>
            <button type="button" onClick={clearFilters}>
              Clear all
            </button>
          </div>

          <section>
            <h3>Places & Experiences</h3>
            {availableRegions.map((region) => (
              <label className="filter-check" key={region}>
                <input
                  type="checkbox"
                  checked={selectedRegions.includes(region)}
                  onChange={() => toggleRegion(region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </section>

          <section>
            <h3>Budget Range</h3>
            <div className="budget-control">
              <input
                type="range"
                min={budgetMin}
                max={budgetMaxValue}
                step="100"
                value={maxBudget}
                onChange={(event) => {
                  setMaxBudget(Number(event.target.value))
                }}
                aria-label="Maximum budget"
              />
              <span>Up to Rs. {maxBudget.toLocaleString('en-IN')}</span>
            </div>
          </section>
        </aside>

        <section className="destination-results" aria-labelledby="destination-page-title">
          <div className="destination-results-heading">
            <p>{eyebrow}</p>
            <h1 id="destination-page-title">
              {searchQuery ? `Search results for "${searchQuery}"` : title}
            </h1>
          </div>

          <div className="destination-results-grid">
            {filteredDestinations.map((destination) => {
              const destinationImage = destination.mainImage || destination.cardImage || getDestinationImage(destination, images)
              const tripDetails = destination._id 
                ? { ...destination, image: destinationImage }
                : getDestinationTripDetails(destination, images)
              return (
                <article className="destination-result-card" key={destination.key}>
                  <img src={destinationImage} alt="" />
                  <div className="result-card-body">
                    <div className="result-card-title">
                      <h2>{destination.title}</h2>
                      <span>{destination.rating || '4.5'}</span>
                    </div>
                    <p>{destination.duration}</p>
                  </div>
                  <div className="result-card-action">
                    <div>
                      <span>Starting from</span>
                      <strong>{destination.price}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => onViewDetails(tripDetails)}
                    >
                      Details
                    </button>
                  </div>
                </article>
              )
            })}
          </div>

          {filteredDestinations.length === 0 && !destinationsLoading && (
            <p className="empty-destination-message">No destinations match those filters.</p>
          )}
          {destinationsLoading && (
            <p className="empty-destination-message">Loading destinations...</p>
          )}
        </section>
      </main>

      <SiteFooter onNavigate={onNavigate} />
    </div>
  )
}

export default DestinationPage

