import React, { Fragment, useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Card, Input, Button, Form } from "antd";
import { CloseCircleTwoTone } from '@ant-design/icons';
import { AuthClient } from "../clients/AuthClient";
import UserContext from "../contexts/user/UserContext";
import { notification } from 'antd';

import "./auth.scss";

const Auth = () => {
    const history = useHistory();
    const authClient = new AuthClient();

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [error, setError] = useState({username: false, password: false});

    const {user, setCurrentUser} = useContext(UserContext);

    const submit = () => {
        const login = async() => {
            try {
                var loggedUser = await authClient.login(username, password);
                if (loggedUser.data.message == "Authentication failed") {
                    throw loggedUser.data;
                }
                localStorage.setItem('token', loggedUser.data.token);
                setCurrentUser({username: username, token: loggedUser.data.token});
                return history.push("/budget/summary");
            }
            catch (e) { 
                if(e.message = "Authentication failed") {
                    notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Les informations fournies ne sont pas valides",
                    })
                }
                else {
                    notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Il est impossible de se connecter à l'application",
                    })
                }
            }
        };

        if (username && username !== null && username !== "" && password && password !== ""){
            login();
        }
        else {
            setError({
                username: username && username !== null && username !== "" ? false : true, 
                password: password && password !== null && password !== "" ? false : true
            });
        }
    };

    return (
        <Fragment>
            {
                !user.token && 
                <Card title={<h2>Se connecter</h2>} className="connexion-card">
                    <Form>
                        <div className={error.username ? "connexion-input error" : "connexion-input"}>
                            <Input size="large" 
                                placeholder="Nom d'utilisateur" 
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}/>
                        </div>
                        <div className={error.password ? "connexion-input error" : "connexion-input"}>
                            <Input.Password  size="large"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}/>
                        </div>
                        <div className="connexion-button">
                            <Button size="large" htmlType="submit"
                                type="primary"
                                onClick={submit}>
                                    Se connecter
                            </Button>
                        </div>
                    </Form>
                </Card>
            }
        </Fragment>
    );
};

export default Auth;