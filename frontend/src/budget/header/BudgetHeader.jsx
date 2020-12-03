import React, { Fragment, useEffect, useState, useContext} from "react";
import { Link } from 'react-router-dom';
import { Select, Button, notification, Modal, Radio } from "antd";
import { PlusOutlined, CloseCircleTwoTone, CopyOutlined, DownloadOutlined } from '@ant-design/icons';

import { BudgetClient } from "../../clients/BudgetClient";

import UserContext from "../../contexts/user/UserContext";
import BudgetContext from "../../contexts/budget/BudgetContext";

import "./budget-header.scss";

const { Option } = Select;

const BudgetHeader = () => {
    const budgetClient = new BudgetClient();
    const {user} = useContext(UserContext);
    const {budget, setCurrentBudget} = useContext(BudgetContext);

    const FORMATS = {EXCEL : 0, PDF: 1};

    const [budgets, setBudgets] = useState(null);
    const [selectedBudgetId, setSelectedBudgetId] = useState(budget.id);
    const [downloadFormat, setDownloadFormat] = useState(FORMATS.EXCEL);
    const [downloadModalVisible, setDownloadModalVisible] = useState(null);
   
    useEffect(() => {
        const listBudgets = async() => {
            try {
                var response = await budgetClient.list(user.token);
                setBudgets(response.data);
            }
            catch (e) {
                notification.open({
                message: "Erreur",
                icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                description:
                  "Une erreur est survenue en allant chercher les budgets",
                });
            }
        };

        if(user.token){
            listBudgets();
        }
    }, []);

    useEffect(() => {
        const getBudgets = async() => {
            try {
                var response = await budgetClient.get(user.token, selectedBudgetId);
                setCurrentBudget(response.data);
            }
            catch (e) {
                notification.open({
                message: "Erreur",
                icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                description:
                  "Une erreur est survenue en allant chercher le budget sélectionné",
                });
            }
        }

        if(user.token){
            getBudgets();
        }
    }, [selectedBudgetId]);

    const download = () => {
        const downloadFromServer = async() => {
            //Cool logic here
        };

        alert('Pas implémenté!');
        setDownloadModalVisible(false);
        setDownloadFormat(FORMATS.EXCEL);
    }

    return (
        <div className="header">
            {
                budgets &&
                <Fragment>
                <Modal
                    title="Veuillez choisir le format du téléchargement"
                    visible={downloadModalVisible}
                    onOk={download}
                    onCancel={() => setDownloadModalVisible(false)}>
                    <Radio.Group onChange={(event) => setDownloadFormat(event.target.value)} value={downloadFormat}>
                        <Radio value={FORMATS.EXCEL}>Excel</Radio>
                        <Radio value={FORMATS.PDF}>Pdf</Radio>
                    </Radio.Group>
                </Modal>
                <Select 
                    showSearch
                    defaultValue={selectedBudgetId} 
                    optionFilterProp="children"
                    size="large" 
                    style={{ width: '50%' }}
                    onChange={(value) => setSelectedBudgetId(value)} 
                    dropdownMatchSelectWidth={false}
                    filterOption={(input, option) =>  
                        option.children.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }>
                    {
                        budgets
                        .sort(function(a, b){
                            return a.startDate < b.startDate;
                        }).map((option) => 
                            <Option key={option.id} value={option.id}>
                                <h2 className="budget-select-option">{option.shortName}</h2>
                            </Option>
                        )
                    }
                </Select>
                    <Button
                        className="download-button"
                        size="large" 
                        type="primary" 
                        disabled={budget}
                        onClick={() => setDownloadModalVisible(true)}>
                            <DownloadOutlined />
                    </Button>
                </Fragment>
            }
            <Button className="new-budget-button"
                size="large" 
                type="primary" 
                disabled={budget}
                onClick={() => {return null}}>
                    <Link to="/budget/clone"><CopyOutlined /> Clôner</Link>
            </Button>
            <Button className="new-budget-button"
                size="large" 
                type="primary" 
                onClick={() => {return null}}>
                    <Link to="/budget/create"><PlusOutlined /> Nouveau</Link>
            </Button>
        </div>
    );
};

export default BudgetHeader;