import React, { useState, useEffect } from 'react';
import { ApiClient } from './clients/ApiClient';
import { Layout } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from "./AppRouter";
import Sidebar from "./Sidebar";
import UserContextProvider from "./contexts/user/UserContextProvider";

import 'antd/dist/antd.css';
import './App.scss';

const { Content, Sider } = Layout;

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
        <UserContextProvider>
            <Router>
                <Sider className="sidebar">
                <div className="logo">BudgETS</div>
                    <Sidebar />
                </Sider>
                <Layout className="content">
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                <AppRouter/>
                        </div>
                    </Content>
                </Layout>
            </Router>                    
        </UserContextProvider>
        </Layout>
    );
}

export default App;
