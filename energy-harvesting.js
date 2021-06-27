const assignments = require('./assignments');

module.exports.findSource = (creep) => {
    return creep.pos.findClosestByPath(FIND_SOURCES);
};

module.exports.moveToSource = (creep, source) => {
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};

module.exports.findSpawn = (creep) => {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    const target = _.sortBy(targets, s => creep.pos.getRangeTo(s))[0];
    return target || creep.room.storage;
};

module.exports.moveToSpawn = (creep, structure) => {
    if (structure && creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});

    }
}

function findDrops(creep) {
    const dropped = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (resource) => resource.energy > 10});

    if (dropped) {
        if (creep.pickup(dropped) == ERR_NOT_IN_RANGE) {
            creep.moveTo(dropped, {visualizePathStyle: {stroke: '#0000FF'}});
        }

    }
    return dropped;
}


module.exports.findSlowHarvester = (creep, opts) => {
    if (!findDrops(creep)) {
        const container = assignments.findStorage({creep, fetch: true})
        if (container) {
            assignments.withdrawFromStorage({container, creep});
        } else {
            const slows = creep.room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    const storage = creep.store[RESOURCE_ENERGY];
                    return creep.memory.role === 'slow_harvester' && storage >= 50;
                }
            });
            const harvester = slows.length > 0 ? _.sortBy(slows, s => creep.pos.getRangeTo(s))[0] : null;
            if (harvester && harvester.transfer(creep, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(harvester, {visualizePathStyle: {stroke: '#ffaa00'}});
            } else if (opts && opts.remote && creep.pos.roomName != 'E42N56') {
                creep.moveTo(new RoomPosition(24, 34, 'E42N56'));
            }
        }
    }
}