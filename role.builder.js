const assignments = require('./assignments');
const harvesting = require('./energy-harvesting');

const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep, opts = {}) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            if (opts.remote && creep.pos.roomName != 'E42N55') {
                creep.moveTo(new RoomPosition(24, 34, 'E42N55'));
            } else {
                const buildTarget = assignments.findNearestConstructionSite({creep});
                const repairTarget = assignments.findNearestRepairTarget({room: creep.room, creep, max: 500});

                if ((!repairTarget && buildTarget && creep.store[RESOURCE_ENERGY] > 10) || buildTarget && creep.pos.getRangeTo(buildTarget) < creep.pos.getRangeTo(repairTarget)) {
                    assignments.build({target: buildTarget, creep});
                } else if (repairTarget) {
                    assignments.repairTarget({target: repairTarget, creep});
                } else if (creep.room.energyAvailable > 0 && creep.room.energyAvailable < 300) {
                    const struct = harvesting.findSpawn(creep);
                    harvesting.moveToSpawn(creep, struct)
                } else {
                    //creep.say('🔄 upgrade');
                    assignments.upgradeController({creep,})
                }
            }
        } else {
            harvesting.findSlowHarvester(creep, opts)
        }
    }
}

module.exports = roleBuilder;