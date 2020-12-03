import React, { useState, useEffect, useContext, Fragment } from "react";
import { Modal, notification, Input, InputNumber, Select, Checkbox  } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import UserContext from "../../contexts/user/UserContext";
import { UserClient } from "../../clients/UserClient";

const { Option } = Select;

const CreateOrEditUser = ({userId, visible, onCancelParent}) => {
    const userClient = new UserClient();

    const {user} = useContext(UserContext);

    const [selectedUser, setSelectedUser] = useState({isAdmin: false});

    useEffect(() => {
        const getUser = async () => {
            var response = await userClient.get(user.token, userId);
            setSelectedUser(response.data);
        };
        if(userId){
            getUser();
        }

    }, [userId]);

    const onCancel = () => {
        setSelectedUser({isAdmin: false});
        onCancelParent();
    };

    const validateAndCreate = () => {
        const save = async () => {
            try {
                await userClient.create(user.token, selectedUser.username, selectedUser.password, selectedUser.isAdmin);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "L'utilisateur a été créé avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en créant l'utilisateur",
                    });
            }
        };

        save();
    }

    const editUser = () => {
        const save = async () => {
            try {
                await userClient.update(user.token, selectedUser.id, selectedUser.password, selectedUser.isAdmin);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "L'utilisateur a été modifié avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en modifiant l'utilisateur",
                    });
            }
        };

        if (selectedUser.password && selectedUser.password.match(/^\s*$/) !== null)
        {
            selectedUser.password = null;
        }
        save();
    }

    return (
        <Modal
            title={selectedUser.id? "Modifier un utilisateur" : "Ajouter un utilisateur"}
            visible={visible}
            onOk={selectedUser.id? editUser : validateAndCreate}
            onCancel={onCancel}>
            { 
                <Fragment>
                    {
                    selectedUser.id == null?
                    <div className={"form-section"}>
                        <div className="label">Nom d'utilisateur: </div>
                        <Input size="large"
                            placeholder="Nom d'utilisateur"
                            value={selectedUser.username}
                            onChange={(event) => setSelectedUser({...selectedUser, username: event.target.value})} />
                    </div>:
                    <div className={"form-section"}>
                        <div className="label">Nom d'utilisateur: {selectedUser.username}</div>
                    </div>
                    }
                    <div className={"form-section"}>
                        <div className="label">Mot de passe: </div>
                        <Input.Password size="large"
                            placeholder="Mot de passe"
                            value={selectedUser.password}
                            onChange={(event) => setSelectedUser({...selectedUser, password: event.target.value})} />
                    </div>
                    <div className="form-section">
                        <Checkbox size="large"
                            checked={selectedUser.isAdmin}
                            onChange={(e) => setSelectedUser({...selectedUser, isAdmin: !selectedUser.isAdmin})} >Admin</Checkbox>
                    </div>
                    {
                    selectedUser.id !== null &&
                    <div className={"form-section"}>
                        <Checkbox size="large"
                            checked={selectedUser.isBlocked}
                            onChange={(e) => setSelectedUser({...selectedUser, isBlocked: !selectedUser.isBlocked})} >Bloqué</Checkbox>
                    </div>
                    }
                </Fragment>
            }
        </Modal>
    );
};

export default CreateOrEditUser;