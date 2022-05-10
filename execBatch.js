/** @param {import(".").NS } ns */
export async function main(ns) {
    // ns.run('killswitch.js');
    // await ns.sleep(1000);

    ns.tprint("Running batch scripts...");

    var droidsList = ns.getPurchasedServers();
    var hacknetList = ns.read('/text/hacknetList.txt').split(',');
    if (hacknetList[0] == "") {
        hacknetList = [];
    }

    var serversList;
    if (droidsList.length > 0 && hacknetList.length == 0) {
        serversList = droidsList;
    }
    if (droidsList.length == 0 && hacknetList.length > 0) {
        serversList = hacknetList;
    }
    if (droidsList.length > 0 && hacknetList.length > 0) {
        serversList = droidsList.concat(hacknetList);
    }
    if (droidsList.length == 0 && hacknetList.length == 0) {
        serversList = ['home'];
    }
    if (droidsList.length > 0 || hacknetList.length > 0) {
        serversList.push('home');
    }

    var targetList = ns.read('/text/targetList.txt').split(',');
    var iterList;

    if (serversList.length <= targetList.length) {
        iterList = serversList;
    } else {
        iterList = targetList;
    }
    for (let i in iterList) {
        var server = serversList[i];
        var target = targetList[i];
        ns.run('batch.js', 1, server, target, Math.random());
    }
}