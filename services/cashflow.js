const { Cashflow, Category } = require('../models');

// Retourne un cashflow selon l'identificateur envoyé en paramètre
const getCashflow = cashflow => {
  	return Cashflow.findOne({
      	where: cashflow
  	});
}

// Retourne tous les cashflows selon l'identifiant de catégorie
const getCashflows = categoryId => {
    return Cashflow.findAll({ 
        where: {
            categoryId: categoryId
        }
    });
};

// Ajout d'un cashflow
const addCashflow = cashflow => {
  	return Cashflow.create(cashflow);
}

// Mise à jour d'un cashflow selon l'identificateur envoyé en paramètre
const updateCashflow = cashflow => {
    return Cashflow.findOne({
        where: {
            id: cashflow.id 
        }
    }).then(c => {
    	if (c) {
	        return c.update(cashflow);
    	}
    });
}

// Suppression d'un cashflow selon l'identificateur envoyé en paramètre
const deleteCashflow = cashflow => {
    return Cashflow.destroy({
        where: {
            id: cashflow.id
        }
    });
}

module.exports = {
	getCashflow, 
	getCashflows,
	addCashflow,
	updateCashflow,
	deleteCashflow
};