import React, { Fragment, useContext, useState } from "react";
import { Menu } from 'antd';
import { Link, useHistory, useLocation } from 'react-router-dom';
import UserContext from "./contexts/user/UserContext";
import { BarsOutlined, BarChartOutlined, SolutionOutlined, UserOutlined, FieldTimeOutlined, 
        SettingOutlined, PieChartOutlined, FallOutlined, RiseOutlined, ReconciliationOutlined } from '@ant-design/icons';

const Sidebar = () => {
    const history = useHistory();
    const storedJwt = localStorage.getItem('token');
    const storedIsAdmin = localStorage.getItem('isAdmin');

    const {user, setCurrentUser} = useContext(UserContext);
    user.token = storedJwt || null;
    user.isAdmin = storedIsAdmin || null;

    const logout = () => {
        //Call to logout
        localStorage.removeItem('token');
        setCurrentUser({username: null, token: null});
        return history.push("/auth");
    };

    const location = useLocation();
    const {pathname} = location;
    
    return (
        <Menu className="menu" selectedKeys={[pathname]}>
            {
                user.token && 
                user.isAdmin &&
                <Menu.Item key="/admin">
                    <ReconciliationOutlined />
                    <Link to="/admin">Admin</Link>
                </Menu.Item> 
            }
            {
                user.token && 
                <Fragment>
                    <Menu.Item key="/budget/summary">
                        <PieChartOutlined />
                        <Link to="/budget/summary">Sommaire</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/details">
                        <SettingOutlined />
                        <Link to="/budget/details">Détails</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/expenses">
                        <FallOutlined />
                        <Link to="/budget/expenses">Dépenses</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/revenues">
                        <RiseOutlined />
                        <Link to="/budget/revenues">Revenus</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/cat-and-lines">
                        <BarsOutlined />
                        <Link to="/budget/cat-and-lines">Lignes et catégories</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/entries">
                        <SolutionOutlined />
                        <Link to="/budget/entries">Entrées budgétaires</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/cashflows">
                        <BarChartOutlined />
                        <Link to="/budget/cashflows">Cashflows</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/statuses">
                        <FieldTimeOutlined />
                        <Link to="/budget/statuses">Statuts</Link>
                    </Menu.Item>
                    <Menu.Item key="/budget/members">
                        <UserOutlined />
                        <Link to="/budget/members">Membres</Link>
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