import { useState, useCallback } from "react";

const useUser = (initialUser) => {
        const [user, setUser] = useState(initialUser ? initialUser : 
        {
            username: null, 
            token: null
        });

    const setCurrentUser = useCallback((currentUser) => setUser(currentUser));

    return {user, setCurrentUser};
};

export default useUser;