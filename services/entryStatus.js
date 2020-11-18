const { EntryStatus } = require('../models');
const { entryStatusDTO } = require('../dto');

// Retourne un status selon l'identificateur envoyé en paramètre
const getStatus = id => {
    return EntryStatus.findOne({
        where: {id: id}
    });
};

// Retourne tous les status
const getStatuses = () => {
    return EntryStatus.findAll();
};

module.exports = {
    getStatus,
	getStatuses
};