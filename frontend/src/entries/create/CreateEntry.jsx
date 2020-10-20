import React, { useState, useEffect, useContext, Fragment } from "react";
import moment from "moment";
import {Modal, notification, Input, DatePicker, InputNumber, Select} from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import UserContext from "../../contexts/user/UserContext";
import BudgetContext from "../../contexts/budget/BudgetContext";
import { CategoryClient } from "../../clients/CategoryClient";
import { LineClient } from "../../clients/LineClient";
import TextArea from "antd/lib/input/TextArea";
import { EntryClient } from "../../clients/EntryClient";

const { Option } = Select;

const CreateEntry = ({entryId, visible, onCancelParent}) => {
    const categoryClient = new CategoryClient();
    const lineClient = new LineClient();
    const entryClient = new EntryClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [entry, setEntry] = useState({categoryId : null});
    const [error, setError] = useState({name: false});
    
    const [statuses, setStatuses] = useState([{id: 1, name: "Envoyé"}]);
    const [categories, setCategories] = useState(null);
    //Get according to selected category
    const [lines, setLines] = useState(null);

    useEffect(() => {
        const getEntry = async () => {
            var response = await entryClient.get(user.token, entryId);
            setEntry(response.data);
        };

        const fetchCategories = async() => {
            var response = await categoryClient.getList(user.token, budget.id);
            setCategories(response.data);
            
            if(response.data){
                setEntry({...entry, categoryId: response.data[0].id});
            }
        };

        const fetchStatuses = async() => {
            // TODO : get all statuses into const statuses
        }

        fetchCategories();
        
        if(entryId){
            getEntry();
        }

    }, [entryId]);

    useEffect(() => {
        const fetchLines = async() => {
            var response = await lineClient.getAll(user.token, entry.categoryId);
            
            if(response.data && response.data.length > 0){
                setLines(response.data);
                setEntry({...entry, lineId: response.data[0].id});
            }
            else {
                setLines([]);
                setEntry({...entry, lineId: null});
            }
        }
    
        if(entry.categoryId){
            fetchLines();
        }
    }, [entry.categoryId]);

    const onCancel = () => {
        setEntry({categoryId: null});
        onCancelParent();
    };

    const validateAndCreate = () => {
        const save = async () => {
            try {
                await entryClient.create(user.token, entry.lineId, entry.member, entry.description, moment(entry.date).format("YYYY-MM-DD HH:mm:ss"), entry.amount, 1);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "L'entrée a été créée avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en créant l'entrée",
                    });
            }
        };

        if(!entry.member || entry.member === "") {
            setError({...error, name: true});
        }
        else {
            save();
        }
    }

    const editEntry = () => {
        const save = async () => {
            try {
                await entryClient.update(user.token, entry.id, entry.lineId, entry.member, entry.description, moment(entry.date).format("YYYY-MM-DD HH:mm:ss"), entry.amount, 1);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "L'entrée a été modifiée avec succès",
                    });
                onCancel(); // Closes modal
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en modifiant l'entrée",
                    });
            }
        };

        if(!entry.member || entry.member === "") {
            setError({...error, name: true});
        }
        else {
            save();
        }
    }

    return (
        <Modal
            title={entry.id? "Modifier une entrée" : "Ajouter une entrée"}
            visible={visible}
            onOk={entry.id? editEntry : validateAndCreate}
            onCancel={onCancel}>
            {
                categories && categories.length > 0 && lines && statuses && 
                <Fragment>
                    <div className={"form-section"}>
                        <Select 
                            value={entry.categoryId ? entry.categoryId : categories[0].id} 
                            onChange={(id) => setEntry({...entry, categoryId: id})}>
                            { 
                                categories.map((category) => <Option key={category.id} value={category.id}>{category.name}</Option>) 
                            }                            
                        </Select>    
                    </div>
                    <div className={"form-section"}>
                        <Select value={entry.lineId} 
                            onChange={(id) => setEntry({...entry, lineId: id})}>
                            { 
                                lines.map((line) => <Option key={line.id} value={line.id}>{line.name}</Option>) 
                            }                            
                        </Select>    
                    </div>
                    <div className={"form-section"}>
                        <Input size="large"
                            placeholder="Nom du membre"
                            value={entry.member}
                            onChange={(event) => setEntry({...entry, member: event.target.value})} />
                    </div>
                    <div className="form-section">
                        <TextArea size="large"
                            placeholder="Description"
                            rows={3}
                            value={entry.description}
                            onChange={(event) => setEntry({...entry, description: event.target.value})} />
                    </div>
                    <div className="form-section">
                        <span className="label">Montant : </span>
                        <InputNumber size="large"
                            min={0}
                            placeholder="Montant"
                            value={entry.amount}
                            onChange={(value) => setEntry({...entry, amount: value})} />
                    </div>
                    <div className="form-section">                
                        <DatePicker 
                            value={moment(entry.date)}
                            onChange={(value) => setEntry({...entry, date: value})} />
                    </div>
                    <div className="form-section">
                        <Select value={1}>
                            {
                                statuses.map((status) => <Option key={status.id} value={status.id}>{status.name}</Option>) 
                            }
                        </Select>
                    </div>
                    </Fragment>
            }
        </Modal>
    );
};

export default CreateEntry;