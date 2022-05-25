/** @param {import(".").NS } ns */
export async function main(ns) {
    // ns.disableLog('ALL');
    // ns.clearLog();
    let joinedBladeBurner = false;
    let darkwebProgramsDone = false;

    let sleeveShock = (sleeve) => ns.sleeve.getSleeveStats(sleeve).shock;
    let sleeveSync = (sleeve) => ns.sleeve.getSleeveStats(sleeve).sync;

    // check this out for sleeve crime success chance: https://gist.github.com/jeek/48715d9cbc59da2da33b00b954605bd6 line 1938
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

    async function deploy() {
        ns.run('killswitch.js');
        await ns.sleep(1 * 1e3);
        ns.run('execBatch.js');
    }

    function canJoinBladeburner() {
        let statsEnough = (
            ns.getPlayer().strength >= 100 &&
            ns.getPlayer().defense >= 100 &&
            ns.getPlayer().dexterity >= 100 &&
            ns.getPlayer().agility >= 100
        );

        return statsEnough;
    }

    // main loop
    while (true) {
        // update server lists
        ns.run('crawlv2.js');

        // check if we can afford a home memory or core upgrade
        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeRamCost()) {
            ns.singularity.upgradeHomeRam();
            await deploy();
        }
        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeCoresCost()) {
            ns.singularity.upgradeHomeCores();
            await deploy();
        }

        // join factions

        // sleeves
        // best gym, powerhouse in sector-12
        // best univ, zb univ in volhaven
        let sleeveList = [...Array(ns.sleeve.getNumSleeves()).keys()];
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
            crimeCheck.push(ns.heart.break() > -54000);
            // crimeCheck.push(ns.sleeve.getTask(sleeve).task == 'Idle');
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

        // join bladeburner if possible
        if (canJoinBladeburner() && !joinedBladeBurner) {
            ns.bladeburner.joinBladeburnerDivision();
            joinedBladeBurner = true;
        }

        // try and buy all the darkweb programs
        if (ns.singularity.purchaseTor()) {
            let programsList = ns.singularity.getDarkwebPrograms();
            programsList.forEach(ns.singularity.purchaseProgram);
        }

        await ns.sleep(1 * 60 * 1e3);
    }
}