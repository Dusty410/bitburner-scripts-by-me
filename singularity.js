/** @param {import(".").NS } ns */
export async function main(ns) {
    // ns.disableLog('ALL');
    // ns.clearLog();
    let joinedBladeBurner = false;
    let darkwebProgramsDone = false;

    async function deploy() {
        ns.run('killswitch.js');
        await ns.sleep(1 * 1e3);
        ns.run('execBatch.js');
    }

    // main loop
    while (true) {
        function canJoinBladeburner() {
            let statsEnough = (
                ns.getPlayer().strength >= 100 &&
                ns.getPlayer().defense >= 100 &&
                ns.getPlayer().dexterity >= 100 &&
                ns.getPlayer().agility >= 100
            );

            return statsEnough;
        }

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

        // join bladeburner if possible
        if (canJoinBladeburner() && !joinedBladeBurner) {
            ns.bladeburner.joinBladeburnerDivision();
            joinedBladeBurner = true;
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
            darkwebProgramsDone = ns.singularity.getDarkwebPrograms().length == numOwnedDarkwebPrograms;
            await ns.sleep(1 * 1e3);
        }

        await ns.sleep(1 * 60 * 1e3);
    }
}