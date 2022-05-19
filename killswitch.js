/** @param {import(".").NS } ns */
export async function main(ns) {

    const hackFiles = ['hack.js', 'hackv2.js', 'grow.js', 'weaken.js', 'share.js', 'batchv3.js'];

    // build comprehensive remote server list
    let serverList = ns.read('/text/zombieList.txt').split(',');
    if (serverList[0] == "") {
        serverList = [];
    }

    let hacknetList = ns.read('/text/hacknetList.txt').split(',');
    if (hacknetList[0] == "") {
        hacknetList = [];
    }

    serverList = serverList.concat(ns.getPurchasedServers());
    serverList = serverList.concat(hacknetList);

    // kill scripts on remote server
    for (let i in serverList) {
        let current = serverList[i];
        if (current != 'home') {
            ns.killall(current);
        }
    }

    // kill hacking scripts on home server, leave all others running
    for (let i in hackFiles) {
        let currentFile = hackFiles[i];
        ns.scriptKill(currentFile, 'home');
    }
}