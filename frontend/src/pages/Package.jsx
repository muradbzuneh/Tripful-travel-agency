import PackageCard from "../componets/packageCard";
import city from ".././assets/Dubia.jpg";

export default function Packages() {
  const packages = [
    {
      id: 1,
      title: "Dubai Getaway",
      description: "5 days, flight + hotel",
      price: 1200,
      image: city,
    },
  ];

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}
