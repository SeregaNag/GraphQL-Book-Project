import { useState } from "react";
import BusinessResults from "./BusinessResults";
import { gql, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";
import "./BusinessSearch.css"

function BusinessSearch() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const {loginWithRedirect, logout, isAuthenticated} = useAuth0();

  const GET_BUSINESS_QUERY = gql`
query BusiessesByCategory($selectedCategory: String!){
  businesses(where: {categories_SOME: {name_CONTAINS: $selectedCategory}}) {
    businessId
    name
    city
    address
    categories {
      name
    }
    ${isAuthenticated ? "averageStars" : ""}
    isStarred @client
  }
}
 
`

  const {loading, error, data, refetch} = useQuery(GET_BUSINESS_QUERY, {variables: {selectedCategory}});

  if(error) return <p>error</p>
  if(loading) return <p>Loading...</p>

  return (
    <div>
      {!isAuthenticated && (<button onClick={() => loginWithRedirect()}>Log in</button>)}
      {isAuthenticated && (<button onClick={() => logout()}>Log out</button>)}
      <Profile/>
      <h1>Business Search</h1>
      <form>
        <label>
          Select Business Category:
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)} 
          >
            <option value="">All</option>
            <option value="Library">Library</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Car Wash">Car Wash</option>
          </select>
        </label>

        <input type="submit" value="Refetch" onClick={() => refetch()}/>
      </form>

      <BusinessResults
        businesses={data.businesses}
      />
    </div>
  );
}

export default BusinessSearch;
