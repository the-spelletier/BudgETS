import React from "react";
import PropTypes from "prop-types";

import UserContext from "./UserContext";
import useUser from "./useUser";

const UserContextProvider = ({children, initialUser}) => {
    var user = useUser(initialUser);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};

UserContextProvider.propTypes = {
    children: PropTypes.node, 
    initialUser: PropTypes.object
};

export default UserContextProvider;