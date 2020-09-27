import React, { useState, useEffect } from 'react';
import { ApiClient } from './clients/ApiClient';
import { Layout, Menu } from 'antd';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AppRouter from "./AppRouter";

import 'antd/dist/antd.css';
import './App.scss';

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
    const [testString, setTestString] = useState("");
    const [pathName, setPathName] = useState("");
    const apiClient = new ApiClient();

    useEffect(() => {
        const testEndpoint = async() => {
        var response = await apiClient.get();
        setTestString(response.data.message);
        }

        testEndpoint();
        setPathName(window.location.pathname);
    }, []);

    return (
        <Layout className="app">
        <Router>
            <Sider className="sidebar">
            <div className="logo">BudgETS</div>
            <Menu className="menu" defaultSelectedKeys={["/budget-summary"]}>
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
                <Menu.Item key="6">
                    <a href="">Aide</a>
                </Menu.Item>
                <Menu.Item className="bottom" key="/auth">
                    <Link to="/auth">Connection</Link>
                </Menu.Item>
            </Menu>
            </Sider>
            <Layout className="content">
                <Content style={{ margin: '24px 16px 0' }}>
                    <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                        <AppRouter/>
                    </div>
                </Content>
            </Layout>
        </Router>
        </Layout>
    );
}

export default App;
