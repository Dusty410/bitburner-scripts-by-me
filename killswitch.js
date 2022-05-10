/** @param {import(".").NS } ns */
export async function main(ns) {

    const hackFiles = ['hackv2.js', 'grow.js', 'weaken.js', 'init.js', 'share.js', 'hack.js'];

    // build comprehensive remote server list
    let serverList = ns.read('/text/zombieList.txt').split(',');
    serverList = serverList.concat(ns.getPurchasedServers());
    let hacknetList = ns.read('/text/hacknetList.txt').split(',');
    if (hacknetList != [""]) {
        serverList = serverList.concat(hacknetList);
    }

    // kill scripts on remote server
    for (let i in serverList) {
        let current = serverList[i];
        ns.killall(current);
    }

    // kill scripts on home server, leave expand.js running
    for (let i in hackFiles) {
        let currentFile = hackFiles[i];
        ns.scriptKill(currentFile, 'home');
    }

    // let homeProcesses = ns.ps('home');
    // if (homeProcesses.length > 0) {
    //     for (let i in homeProcesses) {
    //         let currentHomeProcess = homeProcesses[i];
    //         if (currentHomeProcess.filename == 'batch.js') {
    //             if (ns.kill(currentHomeProcess.pid)) {
    //                 ns.print('Killed batch.js on home.');
    //             }
    //         }
    //         if (currentHomeProcess.filename == 'hackv2.js') {
    //             if (ns.kill(currentHomeProcess.pid)) {
    //                 ns.print('Killed hackv2.js on home.');
    //             }
    //         }
    //         if (currentHomeProcess.filename == 'grow.js') {
    //             if (ns.kill(currentHomeProcess.pid)) {
    //                 ns.print('Killed grow.js on home.');
    //             }
    //         }
    //         if (currentHomeProcess.filename == 'weaken.js') {
    //             if (ns.kill(currentHomeProcess.pid)) {
    //                 ns.print('Killed weaken.js on home.');
    //             }
    //         }
    //         if (currentHomeProcess.filename == 'init.js') {
    //             if (ns.kill(currentHomeProcess.pid)) {
    //                 ns.print('Killed init.js on home.');
    //             }
    //         }
    //         if (currentHomeProcess.filename == 'share.js') {
    //             if (ns.kill(currentHomeProcess.pid)) {
    //                 ns.print('Killed share.js on home.');
    //             }
    //         }
    //     }
    // }
}