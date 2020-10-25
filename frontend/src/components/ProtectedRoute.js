import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { notification } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    var token = localStorage.getItem('token');
    if (token === null){
        notification.open({
            message: "Erreur",
            icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
            description:
                "Votre session a expiré",
        })
        return <Redirect to={{
            pathname: "/login",
            error: { message: "Vous avez été déconnecté" }
        }} />
    }
    return (
        <Route {...rest} render={
            props => {
                return <Component {...rest} {...props} />
            }
        } />
    )
}

export default ProtectedRoute;