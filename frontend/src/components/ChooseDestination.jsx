import DestinationCard from "./DestinationCard";
import { getDestinationImage } from "./destinationData";

const labels = ["Popular", "Hot Deal", "Cultural", "Popular", "Hot Deal", "Cultural"];
const countryLevelDestinations = new Set(["Vietnam", "Nepal"]);

const buildChoices = (destinations, images) => Array.from(
  new Map(
    destinations
      .filter((destination) => destination.status !== 'inactive' && destination.destinationType !== 'trek')
      .map((destination, index) => {
        const title = destination.title || destination.name;
        const image = destination.mainImage || destination.cardImage || getDestinationImage(destination, images);

        if (countryLevelDestinations.has(destination.region)) {
          return [
            destination.region,
            {
              ...destination,
              title: destination.region,
              duration: "",
              price: "",
              image,
              isCountryLevel: true,
              label: labels[index % labels.length],
            },
          ];
        }

        return [
          destination._id || title,
          {
            ...destination,
            title,
            image,
            label: labels[index % labels.length],
          },
        ];
      })
  ).values()
).slice(0, 6);

function ChooseDestination({ destinations = [], images = [], onViewAll, onSelectRegion, onViewDetails }) {
  const choices = buildChoices(destinations, images);

  return (
    <section className="destination-section choose-section">
      <div className="section-title-row">
        <h2>Choose Your Destinations</h2>
        <button type="button" onClick={onViewAll}>
          View All
        </button>
      </div>

      <div className="destination-grid">
        {choices.map((choice) => (
          <DestinationCard
            key={`${choice.title}-${choice.duration}`}
            onClick={choice.isCountryLevel ? () => onSelectRegion(choice.region) : onViewDetails ? () => onViewDetails({ ...choice, location: choice.region, image: choice.image }) : undefined}
            {...choice}
          />
        ))}
      </div>
    </section>
  );
}

export default ChooseDestination;
