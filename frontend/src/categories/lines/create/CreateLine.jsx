import React, { useEffect, useState, useContext } from "react";

import { Modal, notification, Input, InputNumber, Alert } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

import BudgetContext from "../../../contexts/budget/BudgetContext";
import { LineClient } from "../../../clients/LineClient";
import UserContext from "../../../contexts/user/UserContext";
import TextArea from "antd/lib/input/TextArea";

const CreateLine = ({visible, onCancel, categoryId}) => {
    const lineClient = new LineClient();

    const {budget} = useContext(BudgetContext);
    const {user} = useContext(UserContext);

    //Form info
    const [line, setLine] = useState({name: "", description: "", estimate: 0});
    //Validation
    const [error, setError] = useState({name: false});

    useEffect(() => {
        if(line && line.name && line.name !== ""){
            setError({...error, name: false});
        }
    }, [line.name]);

    const addLine = () => {
        const save = async () => {
            try {
                await lineClient.create(user.token, line.name, line.description, line.estimate, categoryId);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "La ligne a été créé avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en créant la ligne",
                    });
            }
        };

        if(!line.name || line.name === "") {
            setError({...error, name: true});
        }
        else {
            save();
        }
    }

    return (
        <Modal 
            title="Ajouter une ligne"
            visible={visible}
            onOk={addLine}
            onCancel={onCancel}>
                <Alert showIcon type="warning" message="Attention! L'estimé est toujours une valeur positive. La catégorie détermine s'il s'agit d'une entrée ou d'une sortie." />
                <div className={error.name === false ? "form-section" : "form-section error"}>
                <Input size="large"
                    placeholder="Nom de la ligne"
                    value={line.name}
                    onChange={(event) => setLine({...line, name: event.target.value})} />
                </div>
                <div className="form-section">
                    <TextArea size="large"
                        placeholder="Description"
                        rows={3}
                        value={line.description}
                        onChange={(event) => setLine({...line, description: event.target.value})} />
                </div>
                <div className="form-section">
                    <span className="label">Estimé : </span>
                    <InputNumber size="large"
                        min={0}
                        placeholder="Estimé"
                        value={line.estimate}
                        onChange={(value) => setLine({...line, estimate: value})} />
                </div>
        </Modal>
    );
};

export default CreateLine;