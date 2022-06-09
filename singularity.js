/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('sleep');
    // ns.clearLog();

    const CITIES = {
        'Sector-12': {
            money: 15e6,
            loc: 'Sector-12',
            factionPrvnt: ['Volhaven', 'Chongqing', 'New Tokyo', 'Ishima']
        },
        'Aevum': {
            money: 40e6,
            loc: 'Aevum',
            factionPrvnt: ['Volhaven', 'Chongqing', 'New Tokyo', 'Ishima']
        },
        'Volhaven': {
            money: 50e6,
            loc: 'Volhaven',
            factionPrvnt: ['Sector-12', 'Aevum', 'Chongqing', 'New Tokyo', 'Ishima']
        },
        'Chongqing': {
            money: 20e6,
            loc: 'Chongqing',
            factionPrvnt: ['Sector-12', 'Aevum', 'Volhaven']
        },
        'New Tokyo': {
            money: 20e6,
            loc: 'New Tokyo',
            factionPrvnt: ['Sector-12', 'Aevum', 'Volhaven']
        },
        'Ishima': {
            money: 30e6,
            loc: 'Ishima',
            factionPrvnt: ['Sector-12', 'Aevum', 'Volhaven']
        }
    }

    const CORPS = {
        'MegaCorp': {
            targetPos: 'software',
            hack: 250,
            repForFaction: 200e6,
            loc: 'Sector-12'
        },
        'Four Sigma': {
            targetPos: 'software',
            hack: 225,
            repForFaction: 200e6,
            loc: 'Sector-12'
        },
        'Blade Industries': {
            targetPos: 'software',
            hack: 225,
            repForFaction: 200e6,
            loc: 'Sector-12'
        },
        'ECorp': {
            targetPos: 'software',
            hack: 250,
            repForFaction: 200e6,
            loc: 'Aevum'
        },
        'Bachman & Associates': {
            targetPos: 'software',
            hack: 225,
            repForFaction: 200e6,
            loc: 'Aevum'
        },
        'Clarke Incorporated': {
            targetPos: 'software',
            hack: 225,
            repForFaction: 200e6,
            loc: 'Aevum'
        },
        'Fulcrum Technologies': {
            targetPos: 'software',
            hack: 225,
            repForFaction: 250e6,
            loc: 'Aevum',
            backdoor: 'fulcrumassets'
        },
        'NWO': {
            targetPos: 'software',
            hack: 250,
            repForFaction: 200e6,
            loc: 'Volhaven'
        },
        'OmniTek Incorporated': {
            targetPos: 'software',
            hack: 225,
            repForFaction: 200e6,
            loc: 'Volhaven'
        },
        'KuaiGong International': {
            targetPos: 'software',
            hack: 225,
            repForFaction: 200e6,
            loc: 'Chongqing'
        }
    }

    const FACTIONS = {
        'CyberSec': {
            backdoor: 'CSEC'
        },
        'Tian Di Hui': {
            money: 1e9,
            hack: 50,
            loc: ['Chongqing', 'New Tokyo', 'Ishima']
        },
        'Netburners': {
            hack: 80,
            totalHNLvls: 100,
            totalHNRAM: 8,
            totalHNCores: 4
        },
        'NiteSec': {
            backdoor: 'avmnite-02h',
            plyrGangType: 'hacking'
        },
        'The Black Hand': {
            backdoor: 'I.I.I.I',
            plyrGangType: 'hacking'
        },
        'BitRunners': {
            backdoor: 'run4theh111z'
        },
        'The Covenant': {
            augCount: 20,
            money: 75e9,
            hack: 850,
            combatReq: 850
        },
        'Daedalus': {
            augCount: 30,
            money: 100e9,
            hack: 2500,
            combatReq: 1500,
            note: 'can be met with hack level OR all combat stats'
        },
        'Illuminati': {
            augCount: 30,
            money: 150e9,
            hack: 1500,
            combatReq: 1200
        },
        'Slum Snakes': {
            money: 1e6,
            combatReq: 30,
            karma: -9,
            plyrGangType: 'combat'
        },
        'Tetrads': {
            combatReq: 75,
            karma: -18,
            loc: ['Chongqing', 'New Tokyo', 'Ishima'],
            plyrGangType: 'combat'
        },
        'Silhouette': {
            money: 15e6,
            karma: -22,
            note: 'must be CEO, CFO, or CTO of a company'
        },
        'Speakers for the Dead': {
            hack: 100,
            combatReq: 300,
            peopleKilled: 30,
            karma: -45,
            jobPrvnt: ['CIA', 'NSA'],
            plyrGangType: 'combat'
        },
        'The Dark Army': {
            hack: 300,
            combatReq: 300,
            loc: ['Chongqing'],
            peopleKilled: 5,
            karma: -45,
            jobPrvnt: ['CIA', 'NSA'],
            plyrGangType: 'combat'
        },
        'The Syndicate': {
            hack: 200,
            combatReq: 200,
            loc: ['Sector-12', 'Aevum'],
            money: 10e6,
            karma: -90,
            jobPrvnt: ['CIA', 'NSA'],
            plyrGangType: 'combat'
        }
    }

    /**
     * Check if we can join the Bladeburner div
     * 
     * @returns True if we can join Bladeburner div
     */
    function canJoinBladeburner() {
        let statsEnough = (
            ns.getPlayer().strength >= 100 &&
            ns.getPlayer().defense >= 100 &&
            ns.getPlayer().dexterity >= 100 &&
            ns.getPlayer().agility >= 100
        );
        return statsEnough;
    }

    /**
     * Apply to all megacorporation jobs that we can, in each city, then return to original city
     */
    function applyToJobs() {
        let origCity = ns.getPlayer().city;
        Object.getOwnPropertyNames(CORPS).forEach(
            name => {
                let corpsWhereEmployed = Object.getOwnPropertyNames(ns.getPlayer().jobs);
                if (
                    ns.getPlayer().hacking >= CORPS[name].hack
                    && !corpsWhereEmployed.includes(name)
                    && !ns.getPlayer().factions.includes(name)
                    && !ns.singularity.checkFactionInvitations().includes(name)
                ) {
                    if (ns.getPlayer().city != CORPS[name].loc) {
                        ns.singularity.travelToCity(CORPS[name].loc);
                    }
                    ns.singularity.applyToCompany(name, CORPS[name].targetPos);
                }
            }
        )
        if (ns.getPlayer().city != origCity) {
            ns.singularity.travelToCity(origCity);
        }
    }

    /**
     * Returns whether the faction has augs left to buy
     * 
     * @param {string} faction 
     * @returns true if faction has augs left to buy
     */
    function factionHasAugs(faction) {
        let factionAugs = ns.singularity.getAugmentationsFromFaction(faction);
        let playerAugs = ns.singularity.getOwnedAugmentations(true);
        return !factionAugs.map(aug => playerAugs.includes(aug)).every(x => x);
    }

    /**
     * Checks if all combat stats are greater than the target level
     * 
     * @param {number} target stat level to check against 
     * @returns true if all combat stats are greater than target
     */
    function allCombatGreaterThan(target) {
        return ns.getPlayer().strength >= target &&
            ns.getPlayer().defense >= target &&
            ns.getPlayer().dexterity >= target &&
            ns.getPlayer().agility >= target;
    }

    /**
     * Visit each city and join them if augs left, and if not in any city faction that would
     * prevent me joining them
     */
    async function getCityInvites() {
        let factions = ns.getPlayer().factions;
        let invites = ns.singularity.checkFactionInvitations();
        let cityNames = Object.getOwnPropertyNames(CITIES);
        for (let i in cityNames) {
            let city = cityNames[i];
            if (factionHasAugs(city)
                && ns.getPlayer().money >= (CITIES[city].money + 200e3) // faction money req + travel
                && !factions.includes(city)
                && !invites.includes(city)
                // check if joined a preventive faction
                && CITIES[city].factionPrvnt.every(x => !factions.includes(x))
            ) {
                while (ns.getPlayer().city != city) {
                    ns.singularity.travelToCity(city);
                    await ns.sleep(25);
                }
                while (!ns.singularity.checkFactionInvitations().includes(city)) {
                    await ns.sleep(1e3);
                }
            }
        }
    }

    /**
     * Get invites from factions that need a specific location
     */
    async function getOtherInvites() {
        let factions = ['Tetrads', 'The Dark Army', 'The Syndicate', 'Tian Di Hui'];
        for (let i in factions) {
            let current = FACTIONS[factions[i]];
            let currentName = factions[i];
            if (factionHasAugs(currentName)) {
                if (ns.getPlayer().numPeopleKilled < (current.peopleKilled ?? 0)) {
                    murder(current.peopleKilled);
                }

                if (
                    allCombatGreaterThan(current.combatReq ?? 0) &&
                    ns.getPlayer().money >= ((current.money ?? 0) + 200e3) &&
                    ns.getPlayer().hacking >= (current.hack ?? 0) &&
                    ns.heart.break() <= (current.karma ?? 0) &&
                    !ns.getPlayer().factions.includes(currentName) &&
                    !ns.singularity.checkFactionInvitations().includes(currentName) &&
                    ns.getPlayer().numPeopleKilled >= (current.peopleKilled ?? 0)
                ) {
                    while (ns.getPlayer().city != current.loc[0]) {
                        ns.singularity.travelToCity(current.loc[0]);
                        await ns.sleep(25);
                    }
                    while (!ns.singularity.checkFactionInvitations().includes(currentName)) {
                        await ns.sleep(1e3);
                    }
                }
            }
        }
    }

    /**
     * Apply to MegaCorp to get Silhouette invite
     */
    function getSilhouetteInvite() {
        let company = 'MegaCorp';
        let job = 'software';
        let position = 'Chief Technology Officer';
        while (
            ns.getPlayer().charisma >= 750 &&
            ns.getPlayer().hacking >= 1000 &&
            ns.singularity.getCompanyRep(company) >= 3.2e6 &&
            (ns.getPlayer().jobs[company] ?? '') != position
        ) {
            ns.singularity.applyToCompany(company, job);
        }
    }

    /**
     * Automatically join each faction that isn't a city, otherwise, before joining a city faction,
     * check if we have every aug from that faction first, then join if we have some left
     */
    function joinFactions() {
        let cities = Object.getOwnPropertyNames(CITIES);
        let invites = ns.singularity.checkFactionInvitations();
        invites.forEach(
            name => {
                if (!cities.includes(name)) {
                    ns.singularity.joinFaction(name);
                } else if (factionHasAugs(name)) {
                    ns.singularity.joinFaction(name);
                }
            }
        )
    }

    /**
     * Murder target amount of people
     * 
     * @param {number} target bodycount desired
     */
    function murder(target) {
        if (
            ns.getPlayer().numPeopleKilled < target &&
            // !ns.getPlayer().factions.includes('Speakers for the Dead') &&
            // !ns.singularity.checkFactionInvitations().includes('Speakers for the Dead') &&
            !ns.scriptRunning('crime.js', 'home')
        ) {
            if (
                ns.scriptRunning('bladeburner.js', 'home') &&
                !ns.singularity.getOwnedAugmentations().includes('The Blade\'s Simulacrum')
            ) {
                ns.scriptKill('bladeburner.js', 'home');
            }
            ns.run('crime.js', 1, target);
        }

        // restart bladeburner, if needed
        if ((
            ns.getPlayer().numPeopleKilled >= target &&
            !ns.scriptRunning('bladeburner.js', 'home') &&
            !ns.scriptRunning('crime.js', 'home')
        ) || ns.singularity.getOwnedAugmentations().includes('The Blade\'s Simulacrum')
        ) {
            ns.run('bladeburner.js');
        }
    }

    // main loop
    while (true) {
        // try and buy all the darkweb programs
        if (ns.singularity.purchaseTor()) {
            let programsList = ns.singularity.getDarkwebPrograms();
            programsList.forEach(ns.singularity.purchaseProgram);
        }

        // check if we can afford a home memory or core upgrade
        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeRamCost()) {
            ns.singularity.upgradeHomeRam();
        }
        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeCoresCost()) {
            ns.singularity.upgradeHomeCores();
        }

        // apply for corp jobs
        applyToJobs();

        // factions
        await getCityInvites();
        await getOtherInvites();
        getSilhouetteInvite();
        joinFactions();

        // join bladeburner if possible
        if (canJoinBladeburner() && !ns.getPlayer().inBladeburner) {
            ns.bladeburner.joinBladeburnerDivision();
        }

        // buy augs

        // install augs

        // graft nickofolas Congruity Implant
        if (
            ns.getPlayer().money >= ns.grafting.getAugmentationGraftPrice('nickofolas Congruity Implant') &&
            ns.singularity.getOwnedAugmentations().includes('The Blade\'s Simulacrum') &&
            !ns.singularity.getOwnedAugmentations().includes('nickofolas Congruity Implant')
        ) {
            if (ns.getPlayer().city != 'New Tokyo') {
                ns.singularity.travelToCity('New Tokyo');
            }
            ns.grafting.graftAugmentation('nickofolas Congruity Implant', false)
        }

        await ns.sleep(1 * 1e3);
    }
}