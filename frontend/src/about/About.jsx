import React, { Fragment } from "react";

const About = () => {
    
    return (
        <Fragment>
            <h1 class="logo">À propos</h1>
            <p>
                BudgETS est une application de gestion budgétaire qui vise à aider les clubs, regroupements et comités de l'École de Technologie Suppérieure. 
                C'est également un projet créé par six finissants de l'ÉTS en génie logiciel dans le cadre du cours LOG795, <a href="https://www.etsmtl.ca/etudes/cours/log795">Projet de fin d’études en génie logiciel</a>. 
            </p>

            <h2>Équipe</h2>
            <p>
                BudgETS a été développé par <a href="https://github.com/VeroBergeron">Véronique Bergeron</a>, <a href="https://github.com/pcuerrier">Philippe Cuerrier</a>, 
                <a href="https://github.com/michael-dowse">Mickael Dowse</a>, <a href="https://github.com/the-spelletier">Simon Pelletier</a>, <a href="https://github.com/GERMANPECHO">German Pecho</a> et <a href="https://github.com/BrunetJacques">Jacques Brunet</a>. 
            </p>

            <h2>Attribution</h2>
            <p>
                Notre logo et certains icônes sont gracieusements offerts par Freepik et Flaticon!
            </p>
            <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
        </Fragment>
    );
};

export default About;