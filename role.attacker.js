const assignments = require('./assignments');
const roleAttacker = {

    run: function (creep, opts) {

        const hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS)
        const structure = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS) || creep.pos.findClosestByPath(FIND_STRUCTURES)
        if (!hostile && structure && (opts && opts.remote)) {
            if (creep.attack(structure) == ERR_NOT_IN_RANGE) {
                console.log('moving to ', structure.id)
                creep.moveTo(structure);
            } else {
                console.log('attacking', structure.id)
            }
        } else if (opts && !hostile && opts.remote) {
            creep.moveTo(new RoomPosition(24, 34, 'E42N55'))
        } else {
            if (hostile) {
                var username = hostile.owner.username;
                console.log(`User ${username} spotted`);
                const attackRetur = creep.attack(hostile)
                console.log(`Attacked creep with status ${attackRetur}`)
                if (attackRetur == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else if (!opts || !opts.remote) {

                if (creep.getActiveBodyparts(ATTACK) === 0) {
                    creep.suicide();
                }
                if (Math.random() > 0.5) {
                    creep.moveTo(14, 31, {visualizePathStyle: {stroke: '#ffaa00'}});
                } else {
                    creep.moveTo(21, 31, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
}

module.exports = roleAttacker;