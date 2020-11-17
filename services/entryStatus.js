const { EntryStatus } = require('../models');
const { entryStatusDTO } = require('../dto');

// Retourne tous les status
const getStatuses = () => {
    return EntryStatus.findAll();
};

module.exports = {
	getStatuses
};