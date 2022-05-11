/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.clearLog();

    while (true) {
        // try and buy all the darkweb programs
        if (ns.singularity.purchaseTor()) {
            let programsList = ns.singularity.getDarkwebPrograms();
            for (let i in programsList) {
                let current = programsList[i];
                if (!ns.ls('home').includes(current)) {
                    if (ns.singularity.purchaseProgram(current)) {
                        ns.print('Bought darkweb program ' + current);
                    }
                }
            }
        }
        await ns.sleep(1 * 1e3);
    }
}