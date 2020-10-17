import React, { Fragment, useContext } from "react";
import { Menu } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import UserContext from "./contexts/user/UserContext";

const Sidebar = () => {
    const history = useHistory();
    const {user, setCurrentUser} = useContext(UserContext);

    const logout = () => {
        //Call to logout
        setCurrentUser({username: null, token: null});
        return history.push("/auth");

    };

    const location = useLocation();
    const {pathname} = location;
    
    return (
        <Menu className="menu" selectedKeys={[pathname]}>
            {
                user.token && 
                <Fragment>
                    <Menu.Item key="/budget/summary">
                        <Link to="/budget/summary">Sommaire</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/details">
                        <Link to="/budget/details">Détails</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/cat-and-lines">
                        <Link to="/budget/cat-and-lines">Lignes et catégories</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/revenues">
                        <Link to="/budget/revenues">Revenus</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/spending">
                        <Link to="/budget/spending">Dépenses</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/entries">
                        <Link to="/budget/entries">Entrées budgétaires</Link>
                    </Menu.Item>
                </Fragment>
            }
            <Menu.Item key="6">
                <Link to="/help">Aide</Link>
            </Menu.Item>
            <Menu.Item className="bottom login" key="/auth">
                { !user.token && <Link to="/auth">Se connecter</Link> }
                { user.token && <span className="logout" onClick={logout}>Se déconnecter</span> }
            </Menu.Item>
        </Menu>
    )
}

export default Sidebar;