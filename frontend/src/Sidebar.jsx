import React, { Fragment, useContext, useState } from "react";
import { Menu } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import UserContext from "./contexts/user/UserContext";

const Sidebar = () => {
    const history = useHistory();
    const storedJwt = localStorage.getItem('token');

    const {user, setCurrentUser} = useContext(UserContext);
    user.token = storedJwt || null;

    const logout = () => {
        //Call to logout
        localStorage.removeItem('token');
        setCurrentUser({username: null, token: null});
        return history.push("/auth");
    };

    const location = useLocation();
    const {pathname} = location;
    
    //TODO: Hide Admin page if user is not admin
    return (
        <Menu className="menu" selectedKeys={[pathname]}>
            {
                user.token && 
                <Menu.Item key="/admin">
                    <Link to="/admin">Admin</Link>
                </Menu.Item> 
            }
            {
                user.token && 
                <Fragment>
                    <Menu.Item key="/budget/summary">
                        <Link to="/budget/summary">Sommaire</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/details">
                        <Link to="/budget/details">Détails</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/expenses">
                        <Link to="/budget/expenses">Dépenses</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/revenues">
                        <Link to="/budget/revenues">Revenus</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/cat-and-lines">
                        <Link to="/budget/cat-and-lines">Lignes et catégories</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/entries">
                        <Link to="/budget/entries">Entrées budgétaires</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/cashflows">
                        <Link to="/budget/cashflows">Cashflows</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/members">
                        <Link to="/budget/members">Membres</Link>
                    </Menu.Item>
                    <Menu.Item key="/statuses">
                        <Link to="/statuses">Statuts</Link>
                    </Menu.Item>
                </Fragment>
            }
            <Menu.Item className="bottom login" key="/auth">
                { !user.token && <Link to="/auth">Se connecter</Link> }
                { user.token && <span className="logout" onClick={logout}>Se déconnecter</span> }
            </Menu.Item>
        </Menu>
    )
}

export default Sidebar;