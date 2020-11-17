const { Line } = require('../models');
const { lineDTO } = require('../dto');

// Retourne une ligne (tous les paramètres) selon l'identificateur envoyé en paramètre
const getLine = line => {
  	return Line.findOne({
      	where: line
  	});
}

// Retourne toutes les lignes
const getLines = categoryId => {
    return Line.findAll({ 
        where: {
            categoryId: categoryId
        }
    });
};

// Ajout d'une ligne
const addLine = line => {
  	return Line.create(line);
}

// Mise à jour d'une ligne selon l'identificateur envoyé en paramètre
const updateLine = line => {
    return Line.findOne({
        where: {
            id: line.id 
        }
    }).then(l => {
    	if (l) {
	        lineDTO(line, l);
	        return l.save();
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