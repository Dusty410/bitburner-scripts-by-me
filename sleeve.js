/** @param {import(".").NS } ns */
export async function main(ns) {
    let sleeveList = [...Array(ns.sleeve.getNumSleeves()).keys()];

    let getShock = sleeve => ns.sleeve.getSleeveStats(sleeve).shock;
    let getSync = sleeve => ns.sleeve.getSleeveStats(sleeve).sync;
    let getCurrentCrime = sleeve => ns.sleeve.getTask(sleeve).crime;

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

    while (true) {
        for (let i in sleeveList) {
            let sleeve = sleeveList[i];

            // shock recovery
            if (getShock(sleeve) > 0
                && ns.sleeve.getTask(sleeve).task != 'Shock Recovery'
            ) {
                ns.sleeve.setToShockRecovery(sleeve);
            }

            // synchronize
            if (getSync(sleeve) < 100
                && getShock(sleeve) <= 0
                && ns.sleeve.getTask(sleeve).task != 'Synchronize'
            ) {
                ns.sleeve.setToSynchronize(sleeve);
            }

            // set to commit crimes
            let crimeCheck = [];
            crimeCheck.push(getSync(sleeve) >= 100);
            crimeCheck.push(getShock(sleeve) <= 0);
            // crimeCheck.push(ns.heart.break() > -54000 || ns.sleeve.getTask(sleeve).task == 'Idle');
            if (crimeCheck.every(x => x)) {
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
                homicideCheck.push(getCrimeChance(sleeve, 'Homicide') < 1);
                homicideCheck.push(getCurrentCrime(sleeve) != 'Homicide');
                if (homicideCheck.every(x => x)) {
                    ns.sleeve.setToCommitCrime(sleeve, 'Homicide');
                }

                let heistCheck = [];
                heistCheck.push(getCrimeChance(sleeve, 'Heist') >= 1);
                heistCheck.push(getCurrentCrime(sleeve) != 'Heist');
                heistCheck.push(ns.heart.break() <= 54000);
                if (heistCheck.every(x => x)) {
                    ns.sleeve.setToCommitCrime(sleeve, 'Heist');
                }
            }

            // buy augs
            ns.sleeve.getSleevePurchasableAugs(sleeve).forEach(x => ns.sleeve.purchaseSleeveAug(sleeve, x.name));

        }
        await ns.sleep(25);
    }
}

/*
best gym, powerhouse in sector-12
best univ, zb univ in volhaven
*/