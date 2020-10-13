const { Entry, EntryStatus, Receipt, Line, Category } = require('../models');
const { entryDTO } = require('../dto');

/**
 * [Retourne une entrée selon l'identificateur envoyé en paramètre]
 * @param  [Entry] entry [description]
 * @return [Entry]       [description]
 */
const getEntry = entry => {
    return Entry.findOne({
        where: entry,
        include: [EntryStatus, Receipt]
    });
}

/**
 * [Retourne toutes les entrées]
 * @param  [Entry] entry [description]
 * @return [array]       [description]
 */
const getEntries = budgetId => {
    return Entry.findAll({ 
        include: [
            EntryStatus, 
            Receipt, {
                model: Line,
                required: true,
                include: {
                    model: Category,
                    required: true,
                    where: {
                      budgetId: budgetId
                    }
                }
            }
        ]
    });
};

/**
 * [Ajout d'une entrée]
 * @param  [Entry] entry [description]
 * @return [type]       [description]
 */
const addEntry = entry => {
    return Entry.create(entry);
}

/**
 * [Mise à jour d'une entrée selon l'identificateur envoyé en paramètre]
 * @param  [Entry] entry [description]
 * @return [Entry]       [description]
 */
const updateEntry = entry => {
    return Entry.findOne({
        where: {
            id: entry.id 
        }
    }).then(e => {
        if (e) {
            entryDTO(entry, e);
            return e.save();
        }
        return e;
    });
}

/**
 * [Suppression d'une entrée selon l'identificateur envoyé en paramètre]
 * @param  [Entry] entry [description]
 * @return [type]       [description]
 */
const deleteEntry = entry => {
  return Entry.destroy({ 
    where: { 
        id: entry.id 
    } 
  });
}

module.exports = {
    getEntry,
    getEntries,
    addEntry,
    updateEntry,
    deleteEntry
};
