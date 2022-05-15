/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.clearLog();
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