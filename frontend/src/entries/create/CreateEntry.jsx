import React, { useState, useEffect, useContext, Fragment } from "react";
import moment from "moment";
import {Modal, notification, Input, DatePicker, InputNumber, Select} from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import UserContext from "../../contexts/user/UserContext";
import BudgetContext from "../../contexts/budget/BudgetContext";
import { CategoryClient } from "../../clients/CategoryClient";
import { LineClient } from "../../clients/LineClient";
import { MemberClient } from "../../clients/MemberClient";
import TextArea from "antd/lib/input/TextArea";
import { EntryClient } from "../../clients/EntryClient";

const { Option } = Select;

const CreateEntry = ({entryId, visible, onCancelParent}) => {
    const categoryClient = new CategoryClient();
    const lineClient = new LineClient();
    const entryClient = new EntryClient();
    const memberClient = new MemberClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [entry, setEntry] = useState({categoryId : null});
    const [error, setError] = useState({name: false});
    
    const [statuses, setStatuses] = useState([{id: 1, name: "Envoyé"}]);
    const [categories, setCategories] = useState(null);
    const [members, setMembers] = useState(null);
    //Get according to selected category
    const [lines, setLines] = useState(null);
    // Wether entry.lineId should change when entry.categoryId changes
    const [KeepLineId, setKeepLineId] = useState(false);

    useEffect(() => {
        const getEntry = async () => {
            var response = await entryClient.get(user.token, entryId);
            setEntry(response.data);
        };

        const fetchCategories = async() => {
            var response = await categoryClient.getList(user.token, budget.id);
            setCategories(response.data);
            
            if(response.data && response.data.length > 0 && entryId == null){
                setEntry({...entry, categoryId: response.data[0].id});
            }
        };

        const fetchMembers = async() => {
            var response = await memberClient.getAll(user.token);
            setMembers(response.data);
        };

        const fetchStatuses = async() => {
            // TODO : get all statuses into const statuses
        }

        if(visible){
            fetchCategories();
            fetchMembers();

            if(entryId){
                getEntry();
                setKeepLineId(true);
            }
            else{
                setKeepLineId(false);
            }
        }
    }, [visible]);

    useEffect(() => {
        const fetchLines = async() => {
            var response = await lineClient.getAll(user.token, entry.categoryId);
            
            if(response.data && response.data.length > 0){
                setLines(response.data);
                if(KeepLineId == false){
                    setEntry({...entry, lineId: response.data[0].id});
                }
            }
            else {
                setLines([]);
                setEntry({...entry, lineId: null});
            }
        }
    
        if(entry.categoryId){
            fetchLines();
            setKeepLineId(false);
        }
    }, [entry.categoryId]);

    const onCancel = () => {
        setEntry({categoryId: null});
        onCancelParent();
    };

    const validateAndCreate = () => {
        const save = async () => {
            try {
                await entryClient.create(user.token, entry.lineId, entry.description, 
                    moment(entry.date).format("YYYY-MM-DD HH:mm:ss"), entry.amount, 1, entry.memberId);
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
        
        save();
    }

    const editEntry = () => {
        const save = async () => {
            try {
                await entryClient.update(user.token, entry.id, entry.lineId, entry.description, 
                    moment(entry.date).format("YYYY-MM-DD HH:mm:ss"), entry.amount, 1, entry.memberId);
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

        save();
    }

    return (
        <Modal
            title={entry.id? "Modifier une entrée" : "Ajouter une entrée"}
            visible={visible}
            onOk={entry.id? editEntry : validateAndCreate}
            onCancel={onCancel}>
            {
                (categories && categories.length > 0 && lines && lines.length > 0 && statuses && members &&
                <Fragment>
                    <div className={"form-section"}>
                        <div className="label">Catégorie: </div>
                        <Select 
                            placeholder="Catégorie"
                            dropdownMatchSelectWidth={false}
                            value={entry.categoryId ? entry.categoryId : categories[0].id} 
                            onChange={(id) => setEntry({...entry, categoryId: id})}>
                            { 
                                categories
                                .sort(function (a, b){
                                    return a.displayName > b.displayName;
                                })
                                .map((category) => 
                                    <Option key={category.id} value={category.id}>
                                        {category.displayName}
                                    </Option>
                                )
                            }
                        </Select>    
                    </div>
                    <div className={"form-section"}>
                        <div className="label">Ligne: </div>
                        <Select 
                            placeholder="Ligne"
                            dropdownMatchSelectWidth={false}
                            value={entry.lineId} 
                            onChange={(id) => setEntry({...entry, lineId: id})}>
                            { 
                                lines.sort(function (a, b){
                                    return a.orderNumber > b.orderNumber;
                                }).map((line) => <Option key={line.id} value={line.id}>{line.displayName}</Option>) 
                            }
                        </Select>
                    </div>
                    <div className={"form-section"}>
                        <div className="label">Membre: </div>
                        <Select 
                            placeholder="Membre"
                            size="large"
                            dropdownMatchSelectWidth={false}
                            value={entry.memberId} 
                            onChange={(id) => setEntry({...entry, memberId: id})}
                            allowClear>
                            { 
                                members.map((member) => <Option key={member.id} value={member.id}>{member.name + " " + member.code + " " + member.email}</Option>) 
                            }                            
                        </Select>    
                    </div>
                    <div className="form-section">
                        <div className="label">Description: </div>
                        <TextArea size="large"
                            placeholder="Description"
                            rows={3}
                            value={entry.description}
                            onChange={(event) => setEntry({...entry, description: event.target.value})} />
                    </div>
                    <div className="form-section">
                        <div className="label">Montant: </div>
                        <InputNumber size="large"
                            min={0}
                            placeholder="Montant"
                            value={entry.amount}
                            onChange={(value) => setEntry({...entry, amount: value})} />
                    </div>
                    <div className="form-section">
                        <div className="label">Date: </div>
                        <DatePicker 
                            allowClear={false}
                            value={moment(entry.date)}
                            onChange={(value) => setEntry({...entry, date: value})} />
                    </div>
                    <div className="form-section">
                        <div className="label">Statut: </div>
                        <Select value={1} dropdownMatchSelectWidth={false}>
                            {
                                statuses.map((status) => <Option key={status.id} value={status.id}>{status.name}</Option>) 
                            }
                        </Select>
                    </div>
                    </Fragment>
                ) || (categories && categories.length > 0 && (lines == null || lines.length === 0) &&
                    <Fragment>
                    <div className={"form-section"}>
                        <div className="label">Catégorie: </div>
                        <Select 
                            placeholder="Catégorie"
                            dropdownMatchSelectWidth={false}
                            value={entry.categoryId ? entry.categoryId : categories[0].id} 
                            onChange={(id) => setEntry({...entry, categoryId: id})}>
                            { 
                                categories
                                .sort(function (a, b){
                                    return a.displayName > b.displayName;
                                })
                                .map((category) => 
                                    <Option key={category.id} value={category.id}>
                                        {category.displayName}
                                    </Option>
                                )
                            }
                        </Select>    
                    </div>
                    <div className="label">La catégorie ne contient aucune ligne.</div>
                    </Fragment>
                ) || ((categories == null || categories.length === 0) &&
                    <Fragment>
                    <div className="label">Le budget ne contient aucune catégorie.</div>
                    </Fragment>
                )
            }
        </Modal>
    );
};

export default CreateEntry;