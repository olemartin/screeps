const structures = require('structures');
const creatures = require('creatures');

module.exports.loop = function () {

    for (name in Game.rooms) {
        creatures.spawn(Game.rooms[name]);
    }
    creatures.clean();
    structures.doTowers();
    structures.doLinks();
    creatures.log()
    for (name in Game.creeps) {
        const creep = Game.creeps[name];
        creatures.runFunction({creep, role: creep.memory.role});
    }
}



