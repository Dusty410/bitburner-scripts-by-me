/** @param {import(".").NS } ns */
export async function main(ns) {
    const minDroidTier = 7;
    const droidNumLimit = ns.getPurchasedServerLimit();
    const droidMaxRAM = ns.getPurchasedServerMaxRam();
    const droidTierLimit = Math.log2(droidMaxRAM);

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
        while (
            ns.getPlayer().money > ns.getPurchasedServerCost(2 ** (droidTier + 1)) &&
            droidTier < droidTierLimit
        ) {
            droidTier++;
        }

        // fourth, if num droids is maxed, and they're all the same, increment by 1
        if (
            droidList.length == droidNumLimit &&
            ns.getServerMaxRam(getLowestRAMDroid()) == ns.getServerMaxRam(getHighestRAMDroid()) &&
            droidTier < droidTierLimit
        ) {
            droidTier++;
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

            if (currentRAM < lowestRAM) {
                lowestRAM = currentRAM;
                lowestRAMDroid = current;
            }
        }

        return lowestRAMDroid;
    }

    function shouldDeleteDroid() {
        let droidList = ns.getPurchasedServers();
        let lowestRAMDroid = getLowestRAMDroid();
        let lowestRAM = ns.getServerMaxRam(lowestRAMDroid);

        return (
            lowestRAM < droidMaxRAM &&
            droidList.length == droidNumLimit &&
            ns.getPlayer().money > ns.getPurchasedServerCost(2 ** getDroidTierToBuy())
        );
    }

    async function GrowServers(droid_level) {
        // handle buying of first server
        while (ns.getPurchasedServers().length == 0) {
            let droidTier = getDroidTierToBuy();
            if (ns.getPlayer().money > ns.getPurchasedServerCost(2 ** droidTier)) {
                BuyServer(droidTier);
                await deployDroids();
            }
            await ns.sleep(1 * 1e3);
        }

        // expand after buying first server
        while (ns.getServerMaxRam(getLowestRAMDroid()) < droidMaxRAM || ns.getPurchasedServers().length < droidNumLimit) {
            // check if i should delete one
            if (shouldDeleteDroid()) {
                ns.deleteServer(getLowestRAMDroid());
            }

            // if i have room, buy as many as i can afford
            let boughtDroid = false;
            let droidTier = getDroidTierToBuy();
            while (
                ns.getPurchasedServers().length < droidNumLimit &&
                ns.getPlayer().money > ns.getPurchasedServerCost(2 ** droidTier)
            ) {
                BuyServer(droidTier);
                boughtDroid = true;
            }

            // if bought any, deploy them
            if (boughtDroid) {
                await deployDroids();
            }

            await ns.sleep(1 * 1e3);
        }
    }

    await GrowServers();
}