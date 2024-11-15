import { starredVar } from ".";

function BusinessResults(props) {
    const {businesses} = props;
    const starredItems = starredVar();

    return (
        <div>
        <h2>Results</h2>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                {businesses.map((b,i) => (
                  <tr key={i}>
                    <td><button
                          onClick={() => {
                            if (b.isStarred) {
                              starredVar(
                                starredItems.filter((i) => {
                                  return i !== b.businessId;
                                })
                              );
                            } else {
                              starredVar([...starredItems, b.businessId]);
                            }
                          }}
                        >
                          Star
                        </button></td>
                    <td style={b.isStarred ? {fontWeight: "bold"} : null}>{b.name}</td>
                    <td>{b.address}</td>
                    <td>{b.city}</td>
                    <td>{b.categories.reduce((acc, c, i) => acc + (i === 0 ? " ": ", ") + c.name, '')}</td>
                  </tr>
                ))}
                </tbody>
              </table>
              </div>
              )
}

export default BusinessResults;
