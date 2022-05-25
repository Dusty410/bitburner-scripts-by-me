/** @param {import(".").NS } ns */
export async function main(ns) {
    // TODO: add logic to search for servers that have room to run attacks on further targets
    // have server report num of running scripts to a port, have execBatch read port and assign appropriately

    let droidsList = ns.getPurchasedServers();
    let hacknetList = ns.read('/text/hacknetList.txt').split(',');
    let serversList = [];

    if (hacknetList[0] == "") {
        hacknetList = [];
    }
    // only add hacknet servers if we can't buy servers, should only be for bn.9
    // if (ns.getPurchasedServerLimit() == 0) {
    //     serversList = droidsList.concat(hacknetList);
    // } else {
    //     serversList = droidsList;
    // }

    // try always running hacks from hacknet
    serversList = droidsList.concat(hacknetList);

    serversList.unshift('home');

    let targetList = ns.read('/text/targetList.txt').split(',');

    let iterList;
    if (serversList.length <= targetList.length) {
        iterList = serversList;
    } else {
        iterList = targetList;
    }
    for (let i in iterList) {
        let server = serversList[i];
        let target = targetList[i];
        ns.run('batchv3.js', 1, server, target, Math.random());
    }
}