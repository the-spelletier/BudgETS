import { useState, useCallback } from "react";

const useUser = (initialUser) => {
    //TODO: reset to null instead of "null" to deal with permissions properly. 
    const [user, setUser] = useState(initialUser ? initialUser : 
        {
            username: null, 
            token: null
        });

    const setCurrentUser = useCallback((currentUser) => setUser(currentUser));

    return {user, setCurrentUser};
}

export default useUser;