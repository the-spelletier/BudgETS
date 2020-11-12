import React, { useState, useEffect, useContext, Fragment } from "react";
import moment from "moment";
import { Modal, notification, Input, InputNumber, Select, Switch  } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import UserContext from "../../contexts/user/UserContext";
import { MemberClient } from "../../clients/MemberClient";

const { Option } = Select;

const CreateMember = ({memberId, visible, onCancelParent}) => {
    const memberClient = new MemberClient();

    const {user} = useContext(UserContext);

    const [member, setMember] = useState({});
    const [error, setError] = useState({name: false}); 

    useEffect(() => {
        const getMember = async () => {
            var response = await memberClient.get(user.token, memberId);
            setMember(response.data);
        };
        if(memberId){
            getMember();
        }

    }, [memberId]);

    const onCancel = () => {
        setMember({});
        onCancelParent();
    };

    const validateAndCreate = () => {
        const save = async () => {
            try {
                await memberClient.create(user.token, member.name, member.code, member.email, member.active);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "Le membre a été créé avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en créant le membre",
                    });
            }
        };

        save();
    }

    const editMember = () => {
        const save = async () => {
            try {
                await memberClient.update(user.token, member.id, member.name, member.code, member.email, member.active);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "Le membre a été modifié avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en modifiant le membre",
                    });
            }
        };

        save();
    }

    return (
        <Modal
            title={member.id? "Modifier un membre" : "Ajouter un membre"}
            visible={visible}
            onOk={member.id? editMember : validateAndCreate}
            onCancel={onCancel}>
            { 
                <Fragment>
                    <div className={"form-section"}>
                        <div className="label">Nom du membre: </div>
                        <Input size="large"
                            placeholder="Nom du membre"
                            value={member.name}
                            onChange={(event) => setMember({...member, name: event.target.value})} />
                    </div>
                    <div className="form-section">
                        <div className="label">Code: </div>
                        <Input size="large"
                            placeholder="Code"
                            value={member.code}
                            onChange={(event) => setMember({...member, code: event.target.value})} />
                    </div>
                    <div className="form-section">
                        <div className="label">Adresse courriel: </div>
                        <Input size="large"
                            type="email"
                            placeholder="E-mail"
                            value={member.email}
                            onChange={(event) => setMember({...member, email: event.target.value})} />
                    </div>
                    <div className="form-section">
                        <div className="label">Actif: 
                            <Switch  size="large"
                                className="check-box"
                                checked={member.active}
                                onChange={(event) => setMember({...member, active: event})} />
                        </div>
                    </div>
                </Fragment>
            }
        </Modal>
    );
};

export default CreateMember;