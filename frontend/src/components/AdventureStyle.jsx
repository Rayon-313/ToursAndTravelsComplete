const getUniqueGalleryImages = (galleryItems) => Array.from(
  new Set(galleryItems.map((item) => item.image).filter(Boolean))
).slice(0, 5);

function AdventureStyle({ galleryItems = [], onViewAll }) {
  const images = getUniqueGalleryImages(galleryItems);

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="adventure-section">
      <div className="section-title-row">
        <h2>Different Adventure Styles For You</h2>
        <button type="button" onClick={onViewAll}>View All</button>
      </div>

      <div className="adventure-gallery">
        {images.map((image, index) => (
          <img className={index === 0 ? 'adventure-large' : undefined} src={image} alt="" key={image} />
        ))}
      </div>

    </section>
  )
}

export default AdventureStyle
