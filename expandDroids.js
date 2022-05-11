/** @param {import(".").NS } ns */
export async function main(ns) {
    const minDroidTier = 7;
    const droidLimit = ns.getPurchasedServerLimit();

    function BuyServer(droidTier) {
        // set name
        let droids = ns.getPurchasedServers();
        let droidNum = 0;
        while (droids.includes('droid' + droidNum)) {
            droidNum++;
        }
        let droidName = 'droid' + droidNum;

        // buy it
        ns.purchaseServer(droidName, (2 ** droidTier));
    }

    async function deployDroids() {
        ns.run('killswitch.js');
        await ns.sleep(1 * 1e3);
        ns.run('crawlv2.js');
        await ns.sleep(1 * 1e3);
        ns.run('execBatch.js');
    }

    function getDroidTierToBuy() {
        let droidList = ns.getPurchasedServers();

        // first, set droidTier to min level
        let droidTier = minDroidTier;

        // second, make droidTier match the highest i own, if it's bigger
        let highestDroidRAM = 0;
        for (let i in droidList) {
            let currentRAM = ns.getServerMaxRam(droidList[i]);
            if (currentRAM > highestDroidRAM) {
                highestDroidRAM = currentRAM;
            }
        }
        droidTier = Math.max(droidTier, Math.log2(highestDroidRAM));

        // third, check if tier can be increased based on affordability
        while (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(2 ** (droidTier + 1)) && droidTier < droidLimit) {
            droid_level++;
        }

        return droidTier;
    }

    function getHighestRAMDroid() {
        let droidList = ns.getPurchasedServers();
        let highestRAM = 0;
        let highestRAMDroid;

        for (let i in droidList) {
            let current = droidList[i];
            let currentRAM = ns.getServerMaxRam(current);

            // find highest RAM droid
            if (currentRAM > highestRAM) {
                highestRAM = currentRAM;
                highestRAMDroid = current;
            }
        }

        return highestRAMDroid;
    }

    function getLowestRAMDroid() {
        let droidList = ns.getPurchasedServers();
        let lowestRAM = ns.getPurchasedServerMaxRam();
        let lowestRAMDroid;

        for (let i in droidList) {
            let current = droidList[i];
            let currentRAM = ns.getServerMaxRam(current);

            // find lowest RAM droid
            if (currentRAM < lowestRAM) {
                lowestRAM = currentRAM;
                lowestRAMDroid = current;
            }
        }

        return lowestRAMDroid;
    }

    function shouldDeleteDroid(droidTier) {
        let droidList = ns.getPurchasedServers();

        let lowestRAMDroid = getLowestRAMDroid();
        let highestRAMDroid = getHighestRAMDroid();

        let lowestRAM = ns.getServerMaxRam(lowestRAMDroid);
        let highestRAM = ns.getServerMaxRam(highestRAMDroid);

        return (lowestRAM < highestRAM
            && droidList.length == droidLimit
            && ns.getPlayer().money > ns.getPurchasedServerCost(2 ** droidTier));
    }

    async function GrowServers(droid_level) {
        while (true) {
            // if i have room, buy as many as i can afford
            let droidTier = getDroidTierToBuy();
            let boughtDroid = false;
            while (ns.getPurchasedServers().length < droidLimit && ns.getPlayer().money > ns.getPurchasedServerCost(2 ** droidTier)) {
                BuyServer(droidTier);
                boughtDroid = true;
            }

            // if bought any, deploy them
            if (boughtDroid) {
                await deployDroids();
            }

            // check if i should delete one

            // if droids are at capacity, determine if i can upgrade 1
            if (droid_list.length == droid_limit) {
                let max_possible_ram = ns.getPurchasedServerMaxRam();
                let lowest_ram = max_possible_ram;
                let lowest_ram_droid;
                let max_owned_ram = 0;
                let max_ram_droid;

                // break if we've bought all possible max level droids
                if (lowest_ram == max_possible_ram) {
                    ns.print("Purchased droids maxed out.");
                    break;
                    // else delete one to make room for a more powerful droid
                } else {
                    // increase droid level if they're all the same
                    if (lowest_ram == max_owned_ram && Math.log2(max_owned_ram) == droid_level) {
                        ns.print("Bought all droids at level " + droid_level + ", increasing min level.");
                        droid_level++;
                    }
                    // only delete server if we can afford new one
                    if (ns.getPurchasedServerCost(2 ** droid_level) < ns.getServerMoneyAvailable('home')) {
                        ns.killall(lowest_ram_droid);
                        if (ns.deleteServer(lowest_ram_droid)) {
                            ns.print("Succesfully deleted " + lowest_ram_droid);
                            await BuyServer(droid_level);
                        }
                    } else {
                        ns.print("No droids deleted, level " + droid_level + " is too expensive!");
                        ns.print("You need $" + Intl.NumberFormat('en-US').format(ns.getPurchasedServerCost(2 ** droid_level)));
                    }
                }
            }
            // wait 10 sec until next check
            await ns.sleep(10000);
        }
    }

    await GrowServers();
}