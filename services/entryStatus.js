const { EntryStatus } = require('../models');
const { entryStatusDTO } = require('../dto');

// Retourne un status selon l'identificateur envoyé en paramètre
const getStatus = id => {
    return EntryStatus.findOne({
        where: {id: id}
    });
};

// Retourne tous les status
const getStatuses = (budgetId) => {
    return EntryStatus.findAll({
        where: {budgetId: budgetId}
    });
};

// Ajout d'un statut
const addStatus = status => {
    return EntryStatus.create(status);
}

// Mise à jour d'un statut selon l'identificateur envoyé en paramètre
const updateStatus = status => {
  return EntryStatus.findOne({
      where: {
          id: status.id 
      }
  }).then(s => {
      if (s) {
          return s.update(status);
      }
  });
}

// Suppression d'un statut selon l'identificateur envoyé en paramètre
const deleteStatus = status => {
  return EntryStatus.findOne({
        where: {
            id: status.id 
        }
    }).then(s => {
    	if (s) {
            s.deleted = true;
	        return s.save();
    	}
    });
}

module.exports = {
    getStatus,
    getStatuses,
    addStatus,
    updateStatus,
    deleteStatus
};