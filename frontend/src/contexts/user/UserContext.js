import React from "react";

const UserContext = React.createContext({
    user: Object,
    setUser: () => {}
});

export default UserContext;