export const regions = ['Indonesia', 'Vietnam', 'Thailand', 'Singapore', 'Dubai', 'Bhutan', 'Nepal', 'Trek']

export const baseDestinations = []

export const budgetMin = 0
export const budgetMax = 50000

export const sortByCountryAndDuration = (firstDestination, secondDestination) => {
  const regionDifference = regions.indexOf(firstDestination.region) - regions.indexOf(secondDestination.region)
  if (regionDifference !== 0) return regionDifference
  return (firstDestination.title || '').localeCompare(secondDestination.title || '')
}

export const getDestinationImage = (destination, images = []) => {
  if (destination.image) return destination.image
  if (!images.length) return ''
  return images[(destination.imageIndex || 0) % images.length]
}

export const getDestinationTripDetails = (destination, images = []) => ({
  title: destination.title,
  location: destination.region,
  price: destination.price,
  rating: destination.rating,
  duration: destination.duration,
  language: 'English',
  description: destination.description,
  itinerary: destination.itinerary,
  image: getDestinationImage(destination, images),
  reviewIndex: destination.reviewIndex ?? 0,
  source: 'destination',
})
