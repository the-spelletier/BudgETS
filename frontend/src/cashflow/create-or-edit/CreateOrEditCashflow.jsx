import React, { useState, useEffect, useContext, Fragment } from "react";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

import UserContext from "../../contexts/user/UserContext";
import { MONTHS } from "../cashflowUtils";
import { Modal, notification, InputNumber } from "antd";
import { CashflowClient } from "../../clients/CashflowClient";

const CreateOrEditCashflow = ({visible, onCancel, initialCashflow}) => {
    const cashflowClient = new CashflowClient();

    const {user} = useContext(UserContext);

    const [cashflow, setCashflow] = useState(null);

    useEffect(() => {
        if (initialCashflow !== null){
            var dividedDate = initialCashflow.name.split("-");
            setCashflow({
                id: initialCashflow.id, 
                year: dividedDate[0], 
                month: dividedDate[1], 
                estimate: initialCashflow.estimate
            });
        }

        console.log(initialCashflow);
    }, [initialCashflow]);

    const cancel = () => {
        setCashflow(null);
        onCancel();
    };

    const editCashflow = () => {
        const save = async () => {
            try {
                await cashflowClient.update(user.token, cashflow.id, cashflow.estimate);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "Le cashflow a été modifié avec succès",
                    });
                cancel();
            }
            catch {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en modifiant le cashflow",
                    });
            }
        };

        save();
    };

    const createCashflow = () => {
        const save = async () => {
            try {
                await cashflowClient.create(user.token, Number(cashflow.year), Number(cashflow.month), cashflow.estimate, initialCashflow.categoryId);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "Le cashflow a été modifié avec succès",
                    });
                cancel();
            }
            catch {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en modifiant le cashflow",
                    });
            }
        };

        save();
    };

    return (
        <Fragment>
        {
            cashflow && 
            <Modal
                title={"Modifier le cashflow de " + MONTHS[Number(cashflow.month) - 1] + " " + cashflow.year}
                visible={visible}
                onOk={cashflow.id ? editCashflow : createCashflow}
                onCancel={cancel} >
                    <div className="form-section">
                        Catégorie: {initialCashflow.categoryName}
                    </div>
                    <div className="form-section">
                        <div className="label">Valeur présente: </div>
                        <InputNumber size="large"
                            disabled
                            value={initialCashflow.estimate} />
                    </div>
                    <div className="form-section">
                        <div className="label">Nouvelle valeur: </div>
                        <InputNumber size="large"
                            required
                            placeholder="Valeur"
                            value={cashflow.estimate}
                            onChange={(value) => setCashflow({...cashflow, estimate: value})} />
                    </div>
            </Modal>
        }
        </Fragment>
    );
};

export default CreateOrEditCashflow;