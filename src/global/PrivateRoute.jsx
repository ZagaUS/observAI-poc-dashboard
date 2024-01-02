import { useKeycloak } from "@react-keycloak/web";

import NotAuthMessage from "./NotAuthMessage";

const PrivateRoute = ({ children }) => {
 const { keycloak } = useKeycloak();

 const isLoggedIn = keycloak.authenticated;

 return isLoggedIn ? children : <NotAuthMessage/>;
};

export default PrivateRoute;