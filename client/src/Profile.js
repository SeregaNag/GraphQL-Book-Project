import { useAuth0 } from "@auth0/auth0-react";
import "./Profile.css"

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
      <div style={{ padding: "10px" }}>
        <img src={user.picture} alt="User avatar" style={{ width: "40px" }} />
        <strong>{user.name}</strong>
      </div>
    )
  );
};

export default Profile;