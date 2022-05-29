/** @param {import(".").NS } ns */
export async function main(ns) {
    let sleeveList = [...Array(ns.sleeve.getNumSleeves()).keys()];

    let sleeveShock = sleeve => ns.sleeve.getSleeveStats(sleeve).shock;
    let sleeveSync = sleeve => ns.sleeve.getSleeveStats(sleeve).sync;

    /**
     * Get crime success chance as a decimal for a specific crime, for a specific sleeve
     * Formula: https://gist.github.com/jeek/48715d9cbc59da2da33b00b954605bd6 line 1938
     * 
     * @param {string} sleeve 
     * @param {string} crime 
     * @returns decimal chance of success for specified sleeve & crime, 1 is 100%
     */
    function getCrimeChanceSleeve(sleeve, crime) {
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
            if (sleeveShock(sleeve) > 0
                && ns.sleeve.getTask(sleeve).task != 'Shock Recovery'
            ) {
                ns.sleeve.setToShockRecovery(sleeve);
            }

            // synchronize
            if (sleeveSync(sleeve) < 100
                && sleeveShock(sleeve) <= 0
                && ns.sleeve.getTask(sleeve).task != 'Synchronize'
            ) {
                ns.sleeve.setToSynchronize(sleeve);
            }

            // set to commit crimes
            let crimeCheck = [];
            crimeCheck.push(sleeveSync(sleeve) >= 100);
            crimeCheck.push(sleeveShock(sleeve) <= 0);
            crimeCheck.push(ns.heart.break() > -54000 || ns.sleeve.getTask(sleeve).task == 'Idle');
            if (crimeCheck.every(x => x)) {
                if (getCrimeChanceSleeve(sleeve, 'Shoplift') < 1) {
                    ns.sleeve.setToCommitCrime(sleeve, 'Shoplift');
                }

                if (getCrimeChanceSleeve(sleeve, 'Shoplift') >= 1
                    && getCrimeChanceSleeve(sleeve, 'Mug') < 1
                ) {
                    ns.sleeve.setToCommitCrime(sleeve, 'Mug');
                }

                if (getCrimeChanceSleeve(sleeve, 'Shoplift') >= 1
                    && getCrimeChanceSleeve(sleeve, 'Mug') >= 1
                ) {
                    ns.sleeve.setToCommitCrime(sleeve, 'Homicide');
                }
            }
        }
        await ns.sleep(25);
    }
}

/*
best gym, powerhouse in sector-12
best univ, zb univ in volhaven
*/