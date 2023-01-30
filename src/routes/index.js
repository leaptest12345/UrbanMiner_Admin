import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PrivateSection from 'routes/PrivateSection';
import PublicRoutes from 'routes/PublicRoutes';
import { UserContext } from 'util/userContext';

function Routes() {
    const { pathname } = useLocation();
    const [user, setUser] = useState(null);
    const authContext = useMemo(() => ({
        signIn1: (id, permission) => {
            setTimeout(() => {
                setUser(id);
            }, 1000);
            localStorage.setItem('userID', id + '');
            localStorage.setItem('permission', JSON.stringify(permission));
        },
        signOut1: () => {
            localStorage.removeItem('userID');
            localStorage.removeItem('permission');
            setUser(null);
        }
    }));
    useEffect(() => {
        window.scrollTo(0, 0);
        const items = localStorage.getItem('userID');
        setUser(items);
    }, [pathname]);

    return (
        <UserContext.Provider value={authContext}>
            {user ? <PrivateSection /> : <PublicRoutes />}
        </UserContext.Provider>
    );
}

export default Routes;
