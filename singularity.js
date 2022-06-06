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

    const POSITIONS = [
        "Software Engineering Intern",
        "Junior Software Engineer",
        "Senior Software Engineer",
        "Lead Software Developer",
        "Head of Software",
        "Head of Engineering",
        "Vice President of Technology",
        "Chief Technology Officer",
    ];

    const GANGS = {
        'Slum Snakes': {
            money: 1e6,
            str: 30,
            def: 30,
            dex: 30,
            agi: 30,
            karma: -9,
            plyrGangType: 'combat'
        },
        'Tetrads': {
            str: 75,
            def: 75,
            dex: 75,
            agi: 75,
            karma: -18,
            locChoice: ['Chongqing', 'New Tokyo', 'Ishima'],
            plyrGangType: 'combat'
        },
        'Silhouette': {
            money: 15e6,
            karma: -22,
            note: 'must be CEO, CFO, or CTO of a company'
        },
        'Speakers for the Dead': {
            hack: 100,
            str: 300,
            def: 300,
            dex: 300,
            agi: 300,
            peopleKilled: 30,
            karma: -45,
            jobPrvnt: ['CIA', 'NSA'],
            plyrGangType: 'combat'
        },
        'The Dark Army': {
            hack: 300,
            str: 300,
            def: 300,
            dex: 300,
            agi: 300,
            loc: 'Chongqing',
            peopleKilled: 5,
            karma: -45,
            jobPrvnt: ['CIA', 'NSA'],
            plyrGangType: 'combat'
        },
        'The Syndicate': {
            hack: 200,
            str: 200,
            def: 200,
            dex: 200,
            agi: 200,
            locChoice: ['Sector-12', 'Aevum'],
            money: 10e6,
            karma: -90,
            jobPrvnt: ['CIA', 'NSA'],
            plyrGangType: 'combat'
        }
    }

    const FACTIONS = {
        'CyberSec': {
            backdoor: 'CSEC'
        },
        'Tian Di Hui': {
            money: 1e9,
            hack: 50,
            locChoice: ['Chongqing', 'New Tokyo', 'Ishima']
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
            str: 850,
            def: 850,
            dex: 850,
            agi: 850
        },
        'Daedalus': {
            augCount: 30,
            money: 100e9,
            hack: 2500,
            str: 1500,
            def: 1500,
            dex: 1500,
            agi: 1500,
            note: 'can be met with hack level OR all combat stats'
        },
        'Illuminati': {
            augCount: 30,
            money: 150e9,
            hack: 1500,
            str: 1200,
            def: 1200,
            dex: 1200,
            agi: 1200
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
                }
            }
        )
    }

    // TODO: add function to check city augs, if any left, join them

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

        // accept pending faction invites, if not a city
        joinFactions();

        // join bladeburner if possible
        if (canJoinBladeburner() && !ns.getPlayer().inBladeburner) {
            ns.bladeburner.joinBladeburnerDivision();
        }

        // buy augs

        // install augs

        await ns.sleep(1 * 1e3);
    }
}