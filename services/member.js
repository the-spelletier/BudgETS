const { Op } = require('sequelize');
const { Member } = require('../models');

// Retourne un membre selon l'identificateur envoyé en paramètre
const getMember = id => {
    return Member.findOne({
        where: {id: id}
    });
}

// Retourne tous les membres
const getMembers = userId => {
    return Member.findAll({ 
        where: { userId: userId }
    });
};

// Ajout d'un membre
const addMember = member => {
  	return Member.create(member);
}

// Mise à jour d'un membre selon l'identificateur envoyé en paramètre
const updateMember = member => {
    return Member.findOne({
        where: {
            id: member.id 
        }
    }).then(m => {
    	if (m) {
	        return m.update(member);
    	}
    });
}

// Suppression d'un membre selon l'identificateur envoyé en paramètre
const deleteMember = member => {
    return Member.destroy({
        where: {
            id: member.id
        }
    });
}

module.exports = {
	getMember, 
	getMembers,
	addMember,
	updateMember,
	deleteMember
};