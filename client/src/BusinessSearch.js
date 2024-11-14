import { useState } from "react";
import BusinessResults from "./BusinessResults";

const businesses = [
  {
    businessId: "b1",
    name: "San Mateo Public Library",
    address: "55 W 3rd Ave",
    city: "San Mateo",
    category: "Library",
  },
  {
    businessId: "b2",
    name: "Ducky's Car Wash",
    address: "716 N San Mateo Dr",
    city: "Santa Clara",
    category: "Car Wash",
  },
  {
    businessId: "b3",
    name: "Hanabi",
    address: "723 California Dr",
    city: "Burlingame",
    category: "Restaurant",
  },
];

function BusinessSearch() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");

  const filterBusinesses = () => {
    const categoryFiltered = 
        selectedCategory === "All"
        ? businesses
        : businesses.filter((b) => {
            return b.category === selectedCategory;
        })

        const cityFiltered =
        selectedCity === "All"
          ? categoryFiltered
          : categoryFiltered.filter((b) => {
              return b.city === selectedCity;
            });
  
      return cityFiltered;
  }

  return (
    <div>
      <h1>Business Search</h1>
      <form>
        <label>
          Select Business Category:
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)} 
          >
            <option value="All">All</option>
            <option value="Library">Library</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Car Wash">Car Wash</option>
          </select>
        </label>

        <label>
          Select Business City:
          <select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
          >
            <option value="All">All</option>
            <option value="San Mateo">San Mateo</option>
            <option value="Santa Clara">Santa Clara</option>
            <option value="Burlingame">Burlingame</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>

      <BusinessResults
        businesses={filterBusinesses()}
      />
    </div>
  );
}

export default BusinessSearch;
