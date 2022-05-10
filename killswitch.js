/** @param {import(".").NS } ns */
export async function main(ns) {

    const hackFiles = ['hackv2.js', 'grow.js', 'weaken.js', 'init.js', 'share.js', 'hack.js', 'batch.js', 'batchv2.js'];

    // build comprehensive remote server list
    let serverList = ns.read('/text/zombieList.txt').split(',');
    serverList = serverList.concat(ns.getPurchasedServers());
    let hacknetList = ns.read('/text/hacknetList.txt').split(',');
    if (hacknetList[0] == "") {
        hacknetList = [];
    }
    serverList = serverList.concat(hacknetList);

    // kill scripts on remote server
    for (let i in serverList) {
        let current = serverList[i];
        if (current != 'home') {
            ns.killall(current);
        }
    }

    // kill scripts on home server, leave expand.js running
    for (let i in hackFiles) {
        let currentFile = hackFiles[i];
        ns.scriptKill(currentFile, 'home');
    }
}