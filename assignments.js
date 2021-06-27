module.exports.findNearestRepairTarget = ({room, creep, max}) => {
    const targets = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (!max || (structure.hits < max && structure.hits < structure.hitsMax)) &&
                ((structure.hitsMax < 30000 && structure.hits < structure.hitsMax / 4) ||
                    (structure.hitsMax >= 30000 && structure.hits > 0 && structure.hits < 1000000 && structure.hits < structure.hitsMax));
        }
    });
    if (creep) {
        return targets.length > 0 ? _.sortBy(targets, s => creep.pos.getRangeTo(s))[0] : null;
    } else {
        return _.sortBy(targets, s => s.hits)[0]
    }
};


module.exports.repairTarget = ({target, creep}) => {
    if (target) {
        if (creep.repair(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
};

module.exports.findNearestConstructionSite = ({creep}) => {
    return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
};

module.exports.build = ({creep, target}) => {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
    }
};

module.exports.upgradeController = ({creep}) => {
    creep.moveTo(creep.room.controller);
    creep.upgradeController(creep.room.controller)
};

module.exports.findStorage = ({creep, fetch}) => {
    const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER ||
                (!fetch && structure.structureType == STRUCTURE_LINK) ||
                (fetch && structure.id == '60d5be537552b3673fd41c2e') ||
                (fetch && structure.structureType == STRUCTURE_STORAGE)) &&
                (!fetch || structure.store.getUsedCapacity(RESOURCE_ENERGY) > 100);
        }
    });
    return container;
};


module.exports.withdrawFromStorage = ({container, creep}) => {
    if (container && creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}