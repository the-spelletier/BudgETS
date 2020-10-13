import React, { useState, useEffect, useContext, Fragment } from "react";
import {Modal, Input, DatePicker, InputNumber, Select} from "antd";
import UserContext from "../../contexts/user/UserContext";
import BudgetContext from "../../contexts/budget/BudgetContext";
import { CategoryClient } from "../../clients/CategoryClient";
import TextArea from "antd/lib/input/TextArea";
import { EntryClient } from "../../clients/EntryClient";

const { Option } = Select;

const CreateEntry = ({visible, onCancel}) => {
    const categoryClient = new CategoryClient();
    const entryClient = new EntryClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [entry, setEntry] = useState({categoryId : null});
    const [error, setError] = useState({name: false});
    
    const [categories, setCategories] = useState(null);
    //Get according to selected category
    const [lines, setLines] = useState(null);
    const [currentLine, setCurrentLine] = useState(null);

    useEffect(() => {
        const fetchCategories = async() => {
            var response = await categoryClient.getList(user.token, budget.id);
            setCategories(response.data);
            setEntry({...entry, categoryId: response.data[0].id});
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchLines = async() => {
            var response = await categoryClient.get(user.token, entry.categoryId);
            setLines(response.data.Lines ? response.data.Lines : []);
            
            if(response.data.Lines && response.data.Lines.length > 0){
                setEntry({...entry, lineId: response.data.Lines[0].id});
            }
            else {
                setEntry({...entry, lineId: null});
            }
        }
    
        fetchLines();
    }, [entry.categoryId]);

    const validateAndCreate = () => {
        const save = async() => {
            await entryClient.create(user.token, "revenue", entry.categoryId, entry.lineId, entry.receiptId, entry.member, entry.description, entry.date, entry.status, entry.amount);
        }

        //TODO: add validation
        save();
    }

    return (
        <Modal
            title="Ajouter une entrée"
            visible={visible}
            onOk={validateAndCreate}
            onCancel={onCancel}>
            {
                categories && categories.length > 0 && lines &&
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
                    <div className={error.name === false ? "form-section" : "form-section error"}>
                        <Input size="large"
                            placeholder="# de la facture"
                            value={entry.receiptId}
                            onChange={(event) => setEntry({...entry, receiptId: event.target.value})} />
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
                            value={entry.date}
                            onChange={(value) => setEntry({...entry, date: value})} />
                    </div>
                    <div className={"form-section"}>
                        <Input size="large"
                            placeholder="Statut"
                            value={entry.status}
                            onChange={(event) => setEntry({...entry, status: event.target.value})} />
                    </div>
                    </Fragment>
            }
        </Modal>
    );
};

export default CreateEntry;