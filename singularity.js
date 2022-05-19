/** @param {import(".").NS } ns */
export async function main(ns) {
    // ns.disableLog('ALL');
    // ns.clearLog();
    while (true) {
        // update server lists
        ns.run('crawlv2.js');

        // check if we can afford a home memory or core upgrade
        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeRamCost()) {
            ns.singularity.upgradeHomeRam();
        }
        if (ns.getPlayer().money > ns.singularity.getUpgradeHomeCoresCost()) {
            ns.singularity.upgradeHomeCores();
        }

        // sleeves
        let sleeveList = [...Array(ns.sleeve.getNumSleeves()).keys()];

        for (let i in sleeveList) {
            let crntSlv = sleeveList[i];
            if (ns.sleeve.getSleeveStats(crntSlv).shock > 0 && ns.sleeve.getTask(crntSlv).task != 'Shock Recovery') {
                ns.sleeve.setToShockRecovery(crntSlv);
            }

            if (ns.sleeve.getSleeveStats(crntSlv).sync < 100 &&
                ns.sleeve.getSleeveStats(crntSlv).shock == 0 &&
                ns.sleeve.getTask(crntSlv).task != 'Synchronize') {
                ns.sleeve.setToSynchronize(crntSlv);
            }
        }

        // try and buy all the darkweb programs
        if (!darkwebProgramsDone) {
            // try and buy all the darkweb programs
            let numOwnedDarkwebPrograms = 0;
            if (ns.singularity.purchaseTor()) {
                let programsList = ns.singularity.getDarkwebPrograms();
                for (let i in programsList) {
                    let current = programsList[i];
                    if (!ns.ls('home').includes(current)) {
                        if (ns.singularity.purchaseProgram(current)) {
                            ns.print('Bought darkweb program ' + current);
                            numOwnedDarkwebPrograms++;
                        }
                    } else {
                        numOwnedDarkwebPrograms++;
                    }
                }
            }
            var darkwebProgramsDone = ns.singularity.getDarkwebPrograms().length == numOwnedDarkwebPrograms;
            await ns.sleep(1 * 1e3);
        }

        await ns.sleep(1 * 60 * 1e3);
    }
}