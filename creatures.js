const roleHarvester = require('role.harvester');
const roleBuilder = require('role.builder');
const roleAttacker = require('role.attacker');
const roleClaimer = require('role.claimer');

const HARVESTER_ROLE = 'harvester';
const SLOW_HARVESTER_ROLE = 'slow_harvester';
const BUILDER_ROLE = 'builder';
const ATTACKER_ROLE = 'attacker';
const REMOTE_ATTACKER_ROLE = 'remote_attacker';
const REMOTE_BUILDER_ROLE = 'remote_builder';
const SPAWN_CLAIMER = 'spawn_claimer';

const energies = {
    [HARVESTER_ROLE]: [
        {
            fromLevel: 1,
            energies: [CARRY, CARRY, MOVE, MOVE]
        }
    ],
    [SLOW_HARVESTER_ROLE]: [
        {
            fromLevel: 1,
            energies: [WORK, CARRY, MOVE]
        }, {
            fromLevel: 2,
            energies: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE]
        }, {
            fromLevel: 4,
            energies: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE]
        }
    ],
    [BUILDER_ROLE]: [
        {
            fromLevel: 1,
            energies: [WORK, CARRY, MOVE, MOVE]
        },
        {
            fromLevel: 2,
            energies: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
        },
        {
            fromLevel: 4,
            energies: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    ],
    [ATTACKER_ROLE]: [
        {
            fromLevel: 4,
            energies: [TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    ],
    [REMOTE_ATTACKER_ROLE]: [
        {
            fromLevel: 4,
            energies: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
            total: true
        }
    ],
    [REMOTE_BUILDER_ROLE]: [
        {
            fromLevel: 4,
            energies: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    ],
    [SPAWN_CLAIMER]: [
        {
            fromLevel: 1,
            energies: [TOUGH, TOUGH, TOUGH, TOUGH, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE]
        }
    ]
}

module.exports.spawn = (room) => {
    if (!enough(ATTACKER_ROLE, 0, room)) {
        create({type: ATTACKER_ROLE, room});
    } else if (!enough(SLOW_HARVESTER_ROLE, 1, room)) {
        create({type: SLOW_HARVESTER_ROLE, room});
    } else if (!enough(HARVESTER_ROLE, 1, room)) {
        create({type: HARVESTER_ROLE, room})
    } else {
        if (!enough(HARVESTER_ROLE, 3, room)) {
            create({type: HARVESTER_ROLE, room})
        } else if (!enough(ATTACKER_ROLE, 0, room)) {
            create({type: ATTACKER_ROLE, room});
        } else {
            if (!enough(SLOW_HARVESTER_ROLE, 3, room)) {
                create({type: SLOW_HARVESTER_ROLE, room});
            } else if (!enough(HARVESTER_ROLE, 2, room)) {
                create({type: HARVESTER_ROLE, room})
            } else if (!enough(BUILDER_ROLE, 6, room)) {
                create({type: BUILDER_ROLE, room});
            } else if (!enough(REMOTE_BUILDER_ROLE, 0, room)) {
                create({type: REMOTE_BUILDER_ROLE, room});
            } else if (!enough(REMOTE_ATTACKER_ROLE, 0, room)) {
                create({type: REMOTE_ATTACKER_ROLE, room});
            } else if (!enough(SPAWN_CLAIMER, 0, room)) {
                create({type: SPAWN_CLAIMER, room});
            } else if (!enough(ATTACKER_ROLE, 0, room)) {
                create({type: ATTACKER_ROLE, room});
            }
        }
    }
}


const enough = (role, number, room) => {
    const array = room.find(FIND_MY_CREEPS, {filter: (creep) => creep.memory.role == role});
    if (number === 0 && !array) {
        return true;
    }
    return array && array.length >= number
}

let slowHarvesterCounter = 0
const create = ({type, room}) => {
    const name = type + Game.time;
    const roles = _.sortBy(energies[type].filter(e => e.fromLevel <= room.controller.level), e => e.fromLevel * -1)[0];

    const spawn = getRoomSpawn(room);

    console.log('Trying to spawn', name, 'in', room)

    if (spawn && roles) {
        const spawnResult = spawn.spawnCreep(roles.energies, name, {memory: {role: type}});
        if (spawnResult === OK) {
            console.log('Spawning', type, 'in', room)
            if (type === SLOW_HARVESTER_ROLE) {
                Memory.creeps[name].sourceId = slowHarvesterCounter++ % 2;
            }
        }
    }
}

const getRoomSpawn = (room) => {
    for (const x in Game.spawns) {
        const spawn = Game.spawns[x];
        if (spawn.room.name === room.name) {
            return spawn;
        }
    }
    return null
}

module.exports.runFunction = ({creep, role}) => {
    if (role == HARVESTER_ROLE) {
        roleHarvester.run(creep, {fast: true});
    } else if (role == SLOW_HARVESTER_ROLE) {
        roleHarvester.run(creep, {slow: true});
    } else if (role == BUILDER_ROLE) {
        roleBuilder.run(creep);
    } else if (role == REMOTE_BUILDER_ROLE) {
        roleBuilder.run(creep, {remote: true});
    } else if (role == ATTACKER_ROLE) {
        roleAttacker.run(creep);
    } else if (role == REMOTE_ATTACKER_ROLE) {
        roleAttacker.run(creep, {remote: true});
    } else if (role == SPAWN_CLAIMER) {
        roleClaimer.run(creep,);
    }
};

module.exports.log = () => {

    const creeps = _.groupBy(Game.creeps, creep => creep.memory.role);
    console.log(`Harvesters: ${creeps[HARVESTER_ROLE] && creeps[HARVESTER_ROLE].length || 0}, slowharvesters: ${creeps[SLOW_HARVESTER_ROLE] && creeps[SLOW_HARVESTER_ROLE].length || 0}, attackers: ${creeps[ATTACKER_ROLE] && creeps[ATTACKER_ROLE].length || 0}, remote attackers: ${creeps[REMOTE_ATTACKER_ROLE] && creeps[REMOTE_ATTACKER_ROLE].length || 0}, builders: ${creeps[BUILDER_ROLE] && creeps[BUILDER_ROLE].length || 0}, remote builders: ${creeps[REMOTE_BUILDER_ROLE] && creeps[REMOTE_BUILDER_ROLE].length || 0},claimer: ${creeps[SPAWN_CLAIMER] && creeps[SPAWN_CLAIMER].length || 0}`);
}

module.exports.clean = () => {
    for (name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}