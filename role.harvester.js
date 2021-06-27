const harvesting = require('./energy-harvesting');
const assignments = require('./assignments');
const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep, opts) {
        if (opts.slow) {
            const storage = assignments.findStorage({creep, fetch: false});
            if (creep.store.getFreeCapacity() > 30 || !storage) {
                const source = harvesting.findSource(creep);
                harvesting.moveToSource(creep, source);
            } else {
                if( creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage);
                }
            }
        } else {
            if (opts.fast) {
                if (creep.store.getUsedCapacity() === 0) {
                    creep.memory.status = 'harvesting';
                } else if (creep.store.getFreeCapacity() === 0) {
                    creep.memory.status = 'dumping';
                }
                if (creep.memory.status === 'harvesting') {
                    const foundSlowHarvester = harvesting.findSlowHarvester(creep);
                    if (!foundSlowHarvester && creep.store.getUsedCapacity() > 0) {
                        const structure = harvesting.findSpawn(creep);
                        harvesting.moveToSpawn(creep, structure);
                    }
                } else {
                    const structure = harvesting.findSpawn(creep);
                    harvesting.moveToSpawn(creep, structure);
                }
            }
        }
    }
};

module.exports = roleHarvester;