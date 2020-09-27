import React, { Fragment, useContext } from "react";
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import UserContext from "./contexts/user/UserContext";

const Sidebar = () => {
    const {user, setCurrentUser} = useContext(UserContext);

    const logout = () => {
        //Call to logout
        setCurrentUser({username: null, token: null});
    };

    return (
        <Menu className="menu">
            {
                user.token && 
                <Fragment>
                    <Menu.Item key="/budget-summary">
                    <Link to="/budget-summary">Sommaire</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget-details">
                        <Link to="/budget-details">Détails</Link>
                    </Menu.Item>
                    <Menu.Item key="/revenues">
                        <Link to="/revenues">Revenus</Link>
                    </Menu.Item>
                    <Menu.Item key="/spending">
                        <Link to="/spending">Dépenses</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget-entries">
                        <Link to="/budget-entries">Entrées budgétaires</Link>
                    </Menu.Item>
                </Fragment>
            }
            <Menu.Item key="6">
                <a href="">Aide</a>
            </Menu.Item>
            <Menu.Item className="bottom login" key="/auth">
                { !user.token && <Link to="/auth">Se connecter</Link> }
                { user.token && <span onClick={logout}>Se déconnecter</span> }
            </Menu.Item>
        </Menu>
    )
}

export default Sidebar;