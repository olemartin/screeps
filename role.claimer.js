const roleClaimer = {

    run: function (creep) {
        if (creep.pos.roomName != 'E42N55') {
            creep.moveTo(new RoomPosition(24, 34, 'E42N55'))
        } else {
            const r = creep.claimController(creep.room.controller);
            if (r === ERR_NOT_IN_RANGE) {
                // move towards the controller
                creep.moveTo(creep.room.controller);
            } else if (r === ERR_GCL_NOT_ENOUGH) {
                creep.say('NO GCL->reserving');
                let re = creep.reserveController(creep.room.controller);
                if (re !== 0) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
}

module.exports = roleClaimer;