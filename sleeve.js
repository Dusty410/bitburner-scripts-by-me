/** @param {import(".").NS } ns */
export async function main(ns) {
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

    const getShock = sleeve => ns.sleeve.getSleeveStats(sleeve).shock;
    const getSync = sleeve => ns.sleeve.getSleeveStats(sleeve).sync;
    const getCurrentCrime = sleeve => ns.sleeve.getTask(+sleeve).crime;
    const getSleeveList = () => [...Array(ns.sleeve.getNumSleeves()).keys()];

    /**
     * Get crime success chance as a decimal for a specific crime, for a specific sleeve
     * Formula: https://gist.github.com/jeek/48715d9cbc59da2da33b00b954605bd6 line 1938
     * 
     * @param {string} sleeve 
     * @param {string} crime 
     * @returns decimal chance of success for specified sleeve & crime, 1 is 100%
     */
    function getCrimeChance(sleeve, crime) {
        let crimeStats = ns.singularity.getCrimeStats(crime);
        let sleeveStats = ns.sleeve.getSleeveStats(+sleeve);
        let sleeveInfo = ns.sleeve.getInformation(+sleeve);

        let chance = crimeStats.hacking_success_weight * sleeveStats.hacking
            + crimeStats.strength_success_weight * sleeveStats.strength
            + crimeStats.defense_success_weight * sleeveStats.defense
            + crimeStats.dexterity_success_weight * sleeveStats.dexterity
            + crimeStats.agility_success_weight * sleeveStats.agility
            + crimeStats.charisma_success_weight * sleeveStats.charisma;
        chance /= 975;
        chance /= crimeStats.difficulty;
        chance *= sleeveInfo.mult.crimeSuccess;
        return Math.min(chance, 1);
    }

    /**
     * Assign sleeve to appropriate crime
     * 
     * @param {string} sleeve Sleeve name
     */
    function assignCrime(sleeve) {
        let shopliftCheck = [];
        shopliftCheck.push(getCrimeChance(sleeve, 'Shoplift') < 1);
        shopliftCheck.push(getCurrentCrime(sleeve) != 'Shoplift');
        if (shopliftCheck.every(x => x)) {
            ns.sleeve.setToCommitCrime(sleeve, 'Shoplift');
        }

        let mugCheck = [];
        mugCheck.push(getCrimeChance(sleeve, 'Shoplift') >= 1);
        mugCheck.push(getCrimeChance(sleeve, 'Mug') < 1);
        mugCheck.push(getCurrentCrime(sleeve) != 'Mug');
        if (mugCheck.every(x => x)) {
            ns.sleeve.setToCommitCrime(sleeve, 'Mug');
        }

        let homicideCheck = [];
        homicideCheck.push(getCrimeChance(sleeve, 'Shoplift') >= 1);
        homicideCheck.push(getCrimeChance(sleeve, 'Mug') >= 1);
        homicideCheck.push(getCurrentCrime(sleeve) != 'Homicide');
        if (homicideCheck.every(x => x)) {
            ns.sleeve.setToCommitCrime(sleeve, 'Homicide');
        }
    }

    /**
     * Assign a sleeve to appropriate job
     * 
     * @param {string} sleeve sleeve name 
     */
    function assignJob(sleeve) {
        let jobsForSleeve = ns.sleeve.getInformation(sleeve).jobs;
        for (let i in jobsForSleeve) {
            let job = jobsForSleeve[i];
            // Fulcrum check, job name is different from 
            job = job == 'Fulcrum Technologies' ? 'Fulcrum Secret Technologies' : job;
            let jobFactionNotJoined = !ns.getPlayer().factions.includes(job);
            let jobFactionNotInvite = !ns.singularity.checkFactionInvitations().includes(job);
            let otherActiveSlvJobs = sleeveList.map(sleeve => {
                if (ns.sleeve.getTask(sleeve).task == 'Company') {
                    return ns.sleeve.getTask(sleeve).location;
                }
            });
            let otherSleeveWorkingJob = !otherActiveSlvJobs.includes(job);

            if (jobFactionNotJoined
                && jobFactionNotInvite
                && otherSleeveWorkingJob
            ) {
                ns.sleeve.setToCompanyWork(sleeve, job);
            }
        }
    }

    /**
     * Gets list of factions that have augments left to buy
     * 
     * @returns faction list
     */
    function getFactionsWithAugs() {
        let factions = [];
        ns.getPlayer().factions.forEach(
            faction => {
                let factionAugs = ns.singularity.getAugmentationsFromFaction(faction);
                if (factionAugs.some(aug => !ns.singularity.getOwnedAugmentations(true).includes(aug))) {
                    factions.push(faction);
                }
            }
        )
        return factions;
    }

    while (true) {
        let sleeveList = getSleeveList();
        for (let i in sleeveList) {
            let sleeve = sleeveList[i];

            // shock recovery
            let shockCheck = [];
            shockCheck.push(getShock(sleeve) > 0);
            shockCheck.push(ns.sleeve.getTask(sleeve).task != 'Shock Recovery');
            if (shockCheck.every(x => x)) {
                ns.sleeve.setToShockRecovery(sleeve);
            }

            // synchronize
            let syncCheck = [];
            syncCheck.push(getSync(sleeve) < 100);
            syncCheck.push(getShock(sleeve) <= 0);
            syncCheck.push(ns.sleeve.getTask(sleeve).task != 'Synchronize');
            if (syncCheck.every(x => x)) {
                ns.sleeve.setToSynchronize(sleeve);
            }

            // set to commit crimes, only use them to reach -54000 karma for gang
            let crimeCheck = [];
            crimeCheck.push(getSync(sleeve) >= 100);
            crimeCheck.push(getShock(sleeve) <= 0);
            crimeCheck.push(!ns.gang.inGang());
            if (crimeCheck.every(x => x)) {
                assignCrime(sleeve);
            }

            // work corp jobs to unlock factions
            let jobCheck = [];
            jobCheck.push(getSync(sleeve) >= 100);
            jobCheck.push(ns.gang.inGang());
            if (jobCheck.every(x => x)) {
                assignJob(sleeve);
            }

            // earn faction rep, only care about factions with augs, and donations not unlocked
            let factionCheck = [];
            // check to make sure that all corp factions have been unlocked
            factionCheck.push(ns.sleeve.getInformation(sleeve).jobs.every(
                job => {
                    ns.getPlayer().factions.includes(job) || ns.singularity.checkFactionInvitations().includes(job)
                }
            ));
            if (factionCheck.every(x => x)) {

            }

            // workout

            // attend university

            // bladeburner actions

            // buy augs
            if (getShock(sleeve) == 0) {
                ns.sleeve.getSleevePurchasableAugs(sleeve).forEach(x => ns.sleeve.purchaseSleeveAug(sleeve, x.name));
            }
        }
        await ns.sleep(25);
    }
}

/*
best gym, powerhouse in sector-12
best univ, zb univ in volhaven
*/