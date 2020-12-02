import React from 'react';
import { Layout, Button } from 'antd';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import FooterToolbar from 'ant-design-pro/lib/FooterToolbar';
import AppRouter from "./AppRouter";
import Sidebar from "./Sidebar";
import UserContextProvider from "./contexts/user/UserContextProvider";
import logo from './styles/logo.png';

import 'antd/dist/antd.css';
import './App.scss';
import 'ant-design-pro/dist/ant-design-pro.css';

const { Content, Sider, Footer } = Layout;

const App = () => {
    return (
        <Layout className="app">                        
        <UserContextProvider>
            <Router>
                <Layout className="content">
                    <Sider className="sidebar">
                    <div className="logo">
                        <img src={logo} alt="Logo" />
                        BudgETS</div>
                        <Sidebar />
                    </Sider>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                <AppRouter/>
                        </div>
                    </Content>
                    <FooterToolbar className="footbar">
                        <Link to="/help">Aide</Link>
                        <Link to="/about">À propos</Link>
                    </FooterToolbar>
                </Layout>
            </Router>                    
        </UserContextProvider>
        </Layout>
    );
}

export default App;
