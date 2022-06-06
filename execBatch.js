/** @param {import(".").NS } ns */
export async function main(ns) {
    // TODO: add logic to search for servers that have room to run attacks on further targets
    // TODO: have server report num of running scripts to a port, have execBatch read port and assign appropriately

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
        return droidsList.concat(hacknetList).unshift('home');
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
     * Checks if there has been a change in hacknet or purchased servers
     * 
     * @param {string[]} serverList original list of servers
     * @returns true if there has been a change in servers
     */
    function shouldDeploy(serverList, hacknetCores, hacknetRAM) {
        return serverList.length != buildServerList().length
            || hacknetCores != getHacknetTotalCores()
            || hacknetRAM != getHacknetTotalRAM();
    }

    /**
     * Run batch scripts from servers, hacking targets
     * 
     * @param {string[]} serverList list of servers to run batch scripts
     * @param {string[]} targetList list of servers to target and hack
     */
    function deploy(serverList, targetList) {
        let iterList;
        if (serverList.length <= targetList.length) {
            iterList = serverList;
        } else {
            iterList = targetList;
        }
        for (let i in iterList) {
            let server = serverList[i];
            let target = targetList[i];
            ns.run('batchv3.js', 1, server, target, Math.random());
        }
    }

    let serverList = buildServerList();
    let totalHacknetCores = getHacknetTotalCores();
    let totalHacknetRAM = getHacknetTotalRAM();
    let targetList = getTargets();
    deploy(serverList, targetList);

    while (true) {
        if (shouldDeploy(serverList, totalHacknetCores, totalHacknetRAM)) {
            serverList = buildServerList();
            targetList = getTargets();
            totalHacknetCores = getHacknetTotalCores();
            totalHacknetRAM = getHacknetTotalRAM();
            deploy(serverList, targetList);
        }

        await ns.sleep(1e3);
    }
}