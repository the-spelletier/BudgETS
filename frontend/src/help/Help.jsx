import React, { Fragment, useState, useEffect, useContext } from "react";
import { Table, Card, notification, Button} from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

const Help = () => {
    
    return (
        <Fragment>
            <h1 class="logo">Aide</h1>
            <p>
                Si vous avez des questions sur le fonctionnement de l'applications, consultez les différentes ressources mentionnées ci-dessous.
            </p>
            <h2>Wiki</h2>
            <p>
                Notre <a href="https://github.com/pcuerrier/BudgETS/wiki">GitHub Wiki</a> contient les informations pour le démarrage de l'applications
                et considérant les différentes tâches que vous pouvez faire avec BudgETS. La section <b>Débuter</b> vous indique comment bien commencer votre budget, 
                soit comment créer votre budget ainsi que les lignes et catégories. La section <b>Suivi budgétaire</b> discute des diverses façons dont l'application 
                vous permet de faire de suivi de vos revenus et dépenses, soit avec la création d'entrées budgétaire et en visualisant les pages de l'application. Si 
                vous avez des questions, assurez vous de consulter la <b>Foire aux question</b>, vous y trouverez la solution à la majorité de vos problèmes. 
            </p>
            <h2>Repo GitHub</h2>
            <p>
                Vous pouvez consulter le <a href="https://github.com/pcuerrier/BudgETS">repository GitHub</a> de BudgETS pour lire le ReadMe, consulter le code et 
                suivre la progression des changements. Il se possible dans le futur de soumettre des demandes de changements et de soulever des bogues dans la
                 section  <b>Issues</b> du repo. 
            </p>
            <h2>Contactez-nous</h2>
            <p>
                Si vous avez toujours des questions, vous pouvez nous contactez directement 
                à <a href="mailto:budgets@not-an-actual-address.ca">budgets@not-an-actual-address.ca</a>!
            </p>
        </Fragment>
    );
};

export default Help;