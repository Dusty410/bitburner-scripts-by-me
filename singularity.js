/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.clearLog();
    while (true) {
        ns.run('crawlv2.js');

        while (!darkwebProgramsDone) {
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
        await ns.sleep(10 * 60 * 1e3);
    }
}