import "../styles/card.css";

export default function PackageCard({ pkg }) {
  return (
    <div className="card">
      <img src={pkg.image} alt={pkg.title} />
      <h3>{pkg.title}</h3>
      <p>{pkg.description}</p>
      <strong>${pkg.price}</strong>
    </div>
  );
}
