var assignments = require('assignments');

module.exports.doTowers = () => {
    for (const gameRoom in Game.rooms) {
        const hostiles = Game.rooms[gameRoom].find(FIND_HOSTILE_CREEPS);
        const towers = Game.rooms[gameRoom].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        if (hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${gameRoom}`);
            towers.forEach(tower => {
                console.log('attacking', hostiles[0].id)
                tower.attack(hostiles[0]);
            });
        } else {
            const target = assignments.findNearestRepairTarget({room: Game.rooms[gameRoom]});
            if (target) {
                towers.forEach(tower => {
                    if (tower.store[RESOURCE_ENERGY] < 150 || Game.rooms[gameRoom].energyAvailable < 800) {
                        return;
                    }
                    console.log(`Repairing ${target.id}(${target.structureType})`)
                    const returnValue = tower.repair(target);
                    if (returnValue !== 0) {
                        console.log(`Repair of ${target.id}(${target.structureType}) failed with status ${returnValue}`)
                    }
                });
            }
        }
    }
}

module.exports.doLinks = () => {
    for (const gameRoom in Game.rooms) {
        const sendingLink = Game.rooms[gameRoom].find(
            FIND_MY_STRUCTURES, {
                filter: (s) => s.id === '60d5117c0ea5eba399c5d9d5' && s.store.getUsedCapacity(RESOURCE_ENERGY) > 500
            });
        const receivingLink = Game.rooms[gameRoom].find(
            FIND_MY_STRUCTURES, {
                filter: (s) => s.id === '60d5be537552b3673fd41c2e'

            });
        if (sendingLink.length === 1 && receivingLink.length === 1) {
            console.log('transfering')
            sendingLink[0].transferEnergy(receivingLink[0], 500)
        }

    }
}