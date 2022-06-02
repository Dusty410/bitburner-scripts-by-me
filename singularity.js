/** @param {import(".").NS } ns */
export async function main(ns) {
    // ns.disableLog('ALL');
    // ns.clearLog();

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

        // join jobs
        

        // join bladeburner if possible
        if (canJoinBladeburner() && !ns.getPlayer().inBladeburner) {
            ns.bladeburner.joinBladeburnerDivision();
        }

        // try and buy all the darkweb programs
        if (ns.singularity.purchaseTor()) {
            let programsList = ns.singularity.getDarkwebPrograms();
            programsList.forEach(ns.singularity.purchaseProgram);
        }

        await ns.sleep(1 * 60 * 1e3);
    }
}