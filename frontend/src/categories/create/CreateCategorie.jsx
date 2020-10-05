import React from "react";
import { Modal, notification, Input, Radio } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { useState } from "react";
import { useContext } from "react";
import BudgetContext from "../../contexts/budget/BudgetContext";
import UserContext from "../../contexts/user/UserContext";
import { CategoryClient } from "../../clients/CategoryClient";
import { useEffect } from "react";

const CreateCategory = ({visible, onCancel}) => {
    const categoryClient = new CategoryClient();

    const {budget} = useContext(BudgetContext);
    const {user} = useContext(UserContext);

    //Form info
    const [category, setCategory] = useState({name: "", type: "expense"});
    //Validation
    const [error, setError] = useState({name: false})

    useEffect(() => {
        if (category && category.name && category.name !== ""){
            setError({name: false});
        }
    }, [category.name])

    const addCategory = () => {
        const save = async () => {
            try {
                await categoryClient.create(user.token, budget.id, category.name, category.type);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "La catégorie a été créé avec succès",
                    });
                onCancel(); // Closes modal
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
    }

    return (
        <Modal 
            title="Ajouter une catégorie"
            visible={visible}
            onOk={addCategory}
            onCancel={onCancel} >
            <div className={error.name === false ? "form-section" : "form-section error"}>
                <Input size="large"
                    placeholder="Nom de la catégorie"
                    value={category.name}
                    onChange={(event) => setCategory({...category, name: event.target.value})} />
            </div>
            <div className="form-section">
                <div>Type de catégorie: </div>
                <Radio.Group value={category.type} onChange={(event) => setCategory({...category, type: event.target.value})}>
                    <Radio value="expense">Dépense</Radio>
                    <Radio value="revenue">Revenu</Radio>
                </Radio.Group>
            </div>
        </Modal>
    );
};

export default CreateCategory;