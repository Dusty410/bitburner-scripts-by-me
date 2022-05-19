/** @param {import("..").NS } ns */
export async function main(ns) {
    // ns.tail();

    var serverList = ns.read('/text/zombieList.txt').split(',');
    serverList.unshift('home');
    var targetList = ns.read('/text/targetList.txt').split(',');
    var iterList = serverList.length < targetList.length ? serverList : targetList;

    for (let i in iterList) {
        var server = serverList[i];
        var target = targetList[i];
        let threads;
        if (server == 'home') {
            threads = Math.floor((ns.getServerMaxRam(server) - 32) / ns.getScriptRam('hack.js'));
        } else {
            threads = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam('hack.js'));
        }

        ns.exec('hack.js', server, threads, target);
    }
}