/** @param {import(".").NS } ns */
export async function main(ns) {
    // TODO: add logic to search for servers that have room to run attacks on further targets
    // TODO: have server report num of running scripts to a port, have execBatch read port and assign appropriately

    ns.disableLog('sleep');
    // ns.tail();

    /**
     * Gets list of hacknet servers
     * 
     * @returns list of hacknet servers
     */
    function getHacknetList() {
        let hacknetList = ns.read('/text/hacknetList.txt').split(',');
        if (hacknetList[0] == "") {
            hacknetList = [];
        }
        return hacknetList;
    }

    /**
     * Build server list to run hack batches from
     * 
     * @returns purchased, hacknet, and home on one list
     */
    function buildServerList() {
        let droidsList = ns.getPurchasedServers();
        let hacknetList = getHacknetList();
        let serverList = droidsList.concat(hacknetList);
        serverList.unshift('home');
        return serverList;
    }

    /**
     * Reads target list built from crawlv2.js
     * 
     * @returns list of valid targets
     */
    function getTargets() {
        return ns.read('/text/targetList.txt').split(',');
    }

    /**
     * Gets total hacknet server cpu cores, useful for tracking server changes
     * 
     * @returns total hacknet cores across all servers
     */
    function getHacknetTotalCores() {
        let hacknetList = getHacknetList();
        let totalCores = 0;
        if (hacknetList.length > 0) {
            for (let i in hacknetList) {
                let current = hacknetList[i];
                totalCores += ns.getServer(current).cpuCores;
            }
        }
        return totalCores;
    }

    /**
     * Gets total hacknet server RAM, useful for tracking server changes
     * 
     * @returns total hacknet RAM across all servers
     */
    function getHacknetTotalRAM() {
        let hacknetList = getHacknetList();
        let totalRAM = 0;
        if (hacknetList.length > 0) {
            for (let i in hacknetList) {
                let current = hacknetList[i];
                totalRAM += ns.getServer(current).maxRam;
            }
        }
        return totalRAM;
    }

    /**
     * Gets total RAM across all purchased servers
     * 
     * @returns total RAM across all purchased servers
     */
    function getPurchasedTotalRAM() {
        if (ns.getPurchasedServers().length > 0) {
            return ns.getPurchasedServers().map(ns.getServerMaxRam).reduce((a, b) => a + b);
        } else {
            return 0;
        }
    }

    /**
     * Checks if there has been a change in hacknet or purchased servers
     * 
     * @param {string[]} serverList original list of servers
     * @returns true if there has been a change in servers
     */
    function shouldDeploy(hacknetCores, hacknetRAM, purchasedRAM) {
        return purchasedRAM != getPurchasedTotalRAM()
            || hacknetCores != getHacknetTotalCores()
            || hacknetRAM != getHacknetTotalRAM();
    }

    /**
     * Run batch scripts from servers, hacking targets
     * 
     * @param {string[]} serverList list of servers to run batch scripts
     * @param {string[]} targetList list of servers to target and hack
     */
    async function deploy(serverList, targetList) {
        ns.run('killswitch.js');
        await ns.sleep(1e3);
        let iterList = serverList.length <= targetList.length ? serverList : targetList;
        // if (serverList.length <= targetList.length) {
        //     iterList = serverList;
        // } else {
        //     iterList = targetList;
        // }

        for (let i in iterList) {
            let server = serverList[i];
            let target = targetList[i];
            ns.run('batchv3.js', 1, server, target, Math.random());
        }
    }

    let serverList = [];
    let totalHacknetCores = 0;
    let totalHacknetRAM = 0;
    let totalPurchasedRAM = 0;
    let targetList = [];
    // deploy(serverList, targetList);

    while (true) {
        if (shouldDeploy(totalHacknetCores, totalHacknetRAM, totalPurchasedRAM)) {
            serverList = buildServerList();
            targetList = getTargets();
            totalHacknetCores = getHacknetTotalCores();
            totalHacknetRAM = getHacknetTotalRAM();
            totalPurchasedRAM = getPurchasedTotalRAM();
            ns.print('server list' + serverList);
            ns.print('target list' + targetList);
            await deploy(serverList, targetList);
        }

        await ns.sleep(1e3);
    }
}