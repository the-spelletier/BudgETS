import React, { useState, useEffect, useContext, Fragment } from "react";
import moment from "moment";
import { Modal, notification, Input, InputNumber, Select, Switch  } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import UserContext from "../../contexts/user/UserContext";
import { EntryStatusClient } from "../../clients/EntryStatusClient";

const { Option } = Select;

const CreateStatus = ({statusId, visible, onCancelParent}) => {
    const statusClient = new EntryStatusClient();

    const {user} = useContext(UserContext);

    const [status, setStatus] = useState({});
    const [error, setError] = useState({name: false}); 

    useEffect(() => {
        const getStatus = async () => {
            var response = await statusClient.get(user.token, statusId);
            setStatus(response.data);
        };
        if(statusId){
            getStatus();
        }

    }, [statusId]);

    const onCancel = () => {
        setStatus({});
        onCancelParent();
    };

    const validateAndCreate = () => {
        const save = async () => {
            try {
                await statusClient.create(user.token, status.name, status.position);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "Le statut a été créé avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en créant le statut",
                    });
            }
        };

        save();
    }

    const editStatus = () => {
        const save = async () => {
            try {
                await statusClient.update(user.token, status.id, status.name, status.position);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "Le statut a été modifié avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en modifiant le statut",
                    });
            }
        };

        save();
    }

    return (
        <Modal
            title={status.id? "Modifier un statut" : "Ajouter un statut"}
            visible={visible}
            onOk={status.id? editStatus : validateAndCreate}
            onCancel={onCancel}>
            { 
                <Fragment>
                    <div className={"form-section"}>
                        <div className="label">Nom du statut: </div>
                        <Input size="large"
                            placeholder="Nom du statut"
                            value={status.name}
                            onChange={(event) => setStatus({...status, name: event.target.value})} />
                    </div>
                    <div className="form-section">
                        <div className="label">Numéro: </div>
                        <InputNumber size="large"
                        min={1}
                        max={99}
                        placeholder="Numéro"
                        value={status.position}
                        onChange={(value) => setStatus({...status, position: value})} />
                    </div>
                </Fragment>
            }
        </Modal>
    );
};

export default CreateStatus;