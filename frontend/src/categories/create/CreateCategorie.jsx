import React, { useEffect, useState, useContext } from "react";

import { Modal, notification, Input, Radio, InputNumber } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

import BudgetContext from "../../contexts/budget/BudgetContext";
import UserContext from "../../contexts/user/UserContext";
import { CategoryClient } from "../../clients/CategoryClient";

const CreateCategory = ({visible, onCancel, initialCategory}) => {
    const categoryClient = new CategoryClient();

    const {budget} = useContext(BudgetContext);
    const {user} = useContext(UserContext);

    //Form info
    const defaultCategory = {name : "", type: "expense", orderNumber: 99};
    const [category, setCategory] = useState(defaultCategory);
    
    //Validation
    const [error, setError] = useState({name: false});

    //We have to set it here because the useState doesnt seem to work for an object props
    useEffect(() => {
        if(initialCategory !== null) {
            setCategory(initialCategory);
        }
        else {
            setCategory(defaultCategory);
        }
    }, [initialCategory]);

    useEffect(() => {
        if (category && category.name && category.name !== ""){
            setError({name: false});
        }
    }, [category.name]);

    const cancel = () => {
        setCategory(defaultCategory);
        onCancel();
    }

    const addCategory = () => {
        const save = async () => {
            try {
                await categoryClient.create(user.token, budget.id, category.name, category.type, category.orderNumber);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "La catégorie a été créée avec succès",
                    });
                cancel(); // Closes modal
            }
            catch {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en créant la catégorie",
                    });
            }
        };
        
        if (!category.name || category.name === "")        
        {
            setError({...error, name: true});
        }
        else {
            save();
        }
    };

    const editCategory = () => {
        const save = async () => {
            try {
                await categoryClient.update(user.token, budget.id, category.id, category.name, category.type, category.orderNumber);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "La catégorie a été modifiée avec succès",
                    });
                cancel(); // Closes modal
            }
            catch {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en modifiant la catégorie",
                    });
            }
        };
        
        if (!category.name || category.name === "")        
        {
            setError({...error, name: true});
        }
        else {
            save();
        }
    };

    return (
        <Modal 
            title={category.id ? "Modifier la catégorie" : "Ajouter une catégorie"}
            visible={visible}
            onOk={category.id ? editCategory : addCategory}
            onCancel={cancel} >
            <div className={error.name === false ? "form-section" : "form-section error"}>
                <div className="label">Nom de la catégorie: </div>
                <Input size="large"
                    placeholder="Nom de la catégorie"
                    value={category.name}
                    onChange={(event) => setCategory({...category, name: event.target.value})} />
            </div>
            <div className="form-section">
                <div className="label">Type de catégorie: </div>
                <Radio.Group value={category.type} onChange={(event) => setCategory({...category, type: event.target.value})}>
                    <Radio value="expense">Dépense</Radio>
                    <Radio value="revenue">Revenu</Radio>
                </Radio.Group>
            </div>
            <div className="form-section">
                <div className="label">Ordre: </div>
                <InputNumber size="large"
                    min={1}
                    max={99}
                    placeholder="Ordre"
                    value={category.orderNumber}
                    onChange={(value) => setCategory({...category, orderNumber: value})} />
            </div>
        </Modal>
    );
};

export default CreateCategory;