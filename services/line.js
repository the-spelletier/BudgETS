const { Line } = require('../models');

// Retourne une lingne (tous les paramètres) selon l'identificateur envoyé en paramètre
const getLine = line => {
  	return Line.findOne({
      	where: line
  	});
}

// Retourne toutes les lignes
const getLines = () => {
  	return Line.findAll();
};

// Ajout d'une ligne
const addLine = line => {
  	return Line.create(line);
}

// Mise à jour d'une ligne selon l'identificateur envoyé en paramètre
const updateLine = line => {
 	return Line.update(line, { 
      	where: { 
        	id: line.id 
      	} 
  	});
}

// Suppression d'une ligne selon l'identificateur envoyé en paramètre
const deleteLine = line => {
  return Line.destroy({ 
    where: { 
        id: line.id 
    } 
  });
}

module.exports = {
	getLine, 
	getLines,
	addLine,
	updateLine,
	deleteLine
};