import React, { useContext, useState } from "react";
import { Card, Input, Button } from "antd";
import { AuthClient } from "../clients/AuthClient";
import UserContext from "../contexts/user/UserContext";
import { notification } from 'antd';

import "./auth.scss";

const Auth = () => {
    const authClient = new AuthClient();

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const [error, setError] = useState({username: false, password: false});

    const {setCurrentUser} = useContext(UserContext);

    const submit = () => {
        const login = async() => {
            try {
                var loggedUser = await authClient.login(username, password);
                //Set usercontext
                setCurrentUser({username: username, token: loggedUser.data})
            }
            catch (e) { 
                notification.open({
                message: "Erreur",
                description:
                  "Il est impossible de se connecter à l'application",
                })
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
        <Card title={<h2>Se connecter</h2>} className="connexion-card">
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
                <Button size="large" 
                    type="primary"
                    onClick={submit}>
                        Se connecter
                </Button>
            </div>
        </Card>
    );
};

export default Auth;