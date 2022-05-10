/** @param {import(".").NS } ns */
export async function main(ns) {
    if (ns.args[0] == 'y') {
        ns.tail();
    }
    ns.disableLog('ALL');
    ns.clearLog();

    const storyServers = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z', 'The-Cave'];
    const hackFiles = ['hackv2.js','grow.js','weaken.js','init.js','share.js','hack.js'];

    function attemptNuke(server) {
        // open ports
        if (ns.fileExists('BruteSSH.exe') && !ns.getServer(server).sshPortOpen) {
            ns.brutessh(server);
        }
        if (ns.fileExists('FTPCrack.exe') && !ns.getServer(server).ftpPortOpen) {
            ns.ftpcrack(server);
        }
        if (ns.fileExists('relaySMTP.exe') && !ns.getServer(server).smtpPortOpen) {
            ns.relaysmtp(server);
        }
        if (ns.fileExists('HTTPWorm.exe') && !ns.getServer(server).httpPortOpen) {
            ns.httpworm(server);
        }
        if (ns.fileExists('SQLInject.exe') && !ns.getServer(server).sqlPortOpen) {
            ns.sqlinject(server);
        }

        // nuke it
        if (ns.getServerNumPortsRequired(server) <= ns.getServer(server).openPortCount) {
            ns.nuke(server);
        }

        // return if we were successful
        return ns.hasRootAccess(server);
    }

    function getServerObj(serverList, serverName) {
        for (let i in serverList) {
            let serverObj = serverList[i];
            if (serverObj.name == serverName) {
                return serverObj;
            }
        }
    }

    function getParentObj(serverList, serverName) {
        let parentName = '';

        for (let i in serverList) {
            let serverObj = serverList[i];
            if (serverObj.name == serverName) {
                parentName = serverObj.parent;
            }
        }

        return getServerObj(serverList, parentName);
    }

    function hasYoungerSibling(serverList, serverName) {
        let parentObj = getParentObj(serverList, serverName);

        if (parentObj.children.indexOf(serverName) == parentObj.children.length - 1) {
            return false;
        } else {
            return true;
        }
    }

    function drawTree(serverList) {
        let depthString = '';
        for (let i in serverList) {
            let current = serverList[i];
            let serverString = '';

            if (current.depth > 0) {
                if (hasYoungerSibling(serverList, current.name)) {
                    serverString += '╞';
                } else {
                    serverString += '╘';
                }
            }

            serverString += current.name;


            // post a square based on backdoor status of one of the story significant servers
            if (storyServers.includes(current.name)) {
                if (ns.getPlayer().hacking < ns.getServerRequiredHackingLevel(current.name)) {
                    serverString += '\uD83D\uDFE5'; // red square, can't backdoor
                } else if (!ns.getServer(current.name).backdoorInstalled) {
                    serverString += '\uD83D\uDFE8'; // yellow square, can backdoor, haven't yet
                } else {
                    serverString += '\uD83D\uDFE9'; // green square, backdoor installed
                }
            }

            // post a blue square if a contract is present on the server
            let fileList = ns.ls(current.name);
            for (let i in fileList) {
                let currentFile = fileList[i];
                if (currentFile.includes('.cct')) {
                    serverString += '\uD83D\uDFE6'; // blue square, contract is present
                }
            }

            // if we've jumped up in depth, change string to match
            if (current.depth < depthString.length) {
                depthString = depthString.slice(0, -(depthString.length - current.depth));
            }

            ns.print(depthString + serverString);

            // only check for siblings if deep enough, ie not on home
            if (current.depth > 0) {
                if (hasYoungerSibling(serverList, current.name) && current.children != null) {
                    depthString += '│';
                } else {
                    depthString += ' ';
                }
            } else {
                depthString += ' ';
            }
        }
    }

    function getPathToServer(serverList, target) {
        let serverPath = [];
        let serverObj = getServerObj(serverList, target);

        while (serverObj.depth > 0) {
            serverPath.unshift(serverObj.name);
            serverObj = getParentObj(serverList, serverObj.name);
        }

        return serverPath;
    }

    function getStoryServerPaths(serverList) {
        let pathsList = [];
        for (let i in storyServers) {
            let current = storyServers[i];
            let targetPathObj = {
                name: current,
                path: getPathToServer(serverList, current)
            }
            pathsList.push(targetPathObj);
        }
        return pathsList;
    }

    function backdoorStoryServers(serverList, storyPaths) {
        for (let i in storyPaths) {
            let current = storyPaths[i];
            for (let j in current.path) {
                ns.singularity.connect(current.path[j]);
            }
            if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current.name)) {
                ns.singularity.installBackdoor();
            } else {
                ns.tprint(
                    "Can't backdoor " + current.name +
                    ", need hacking level of " +
                    ns.getServerRequiredHackingLevel(current.name)
                );
            }
            ns.singularity.connect('home');
        }
    }

    function buildServerTree(server, masterList, depth) {

        attemptNuke(server);

        let rootList = ns.scan(server);
        let serverObj = {};

        // set name property
        serverObj.name = server;

        // set parent property
        if (server == 'home') {
            serverObj.parent = null;
        } else {
            serverObj.parent = rootList[0];
            rootList.shift();
        }

        // set depth  property
        serverObj.depth = depth;

        // set children property, filter out unwanted servers
        let childrenList = [];
        if (rootList.length > 0) {
            for (let i in rootList) {
                let current = rootList[i];
                if (!ns.getServer(current).purchasedByPlayer && !current.includes('darkweb')) {
                    childrenList.push(current);
                }
            }
            serverObj.children = childrenList;
            masterList.push(serverObj);

            // search for new nodes based on children
            for (let i in serverObj.children) {
                let child = serverObj.children[i];
                buildServerTree(child, masterList, depth + 1);
            }

        } else {
            serverObj.children = null;
            masterList.push(serverObj);
        }
    }

    function refineTargets(targetList) {
        let refinedTargets = [];
        let newTargetList = [];
        for (let i in targetList) {
            let target = targetList[i];
            let targetMinSec = ns.getServerMinSecurityLevel(target);
            refinedTargets.push({ server: target, minSec: targetMinSec });
        }
        refinedTargets.sort(function (a, b) { return a.minSec - b.minSec });
        // create an array of just target names, but now they'll be in order from least security to most
        for (let i in refinedTargets) {
            newTargetList.push(refinedTargets[i].server);
        }

        return newTargetList;
    }

    async function copyScripts(zombieList, hacknetList) {
        let serverList = [];
        serverList = serverList.concat(zombieList);
        serverList = serverList.concat(hacknetList);
        serverList = serverList.concat(ns.getPurchasedServers());

        for (let i in serverList) {
            let current = serverList[i];
            await ns.scp(hackFiles, current);
        }
    }

    let serversObjList = [];
    // zombies are nuked servers that we can use to hack other servers
    let zombieList = [];
    // targets are servers that are hackable, with money > 0
    let targetList = [];
    // hacknet servers
    let hacknetList = [];

    buildServerTree('home', serversObjList, 0);
    drawTree(serversObjList);
    let storyPaths = getStoryServerPaths(serversObjList);
    backdoorStoryServers(serversObjList, storyPaths);

    for (let i in serversObjList) {
        let current = serversObjList[i];
        // build zombie list
        if (ns.getServer(current.name).hasAdminRights && ns.getServerMaxRam(current.name) > 0) {
            zombieList.push(current.name);
        }

        // build target list
        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current.name) && ns.getServerMaxMoney(current.name) > 0) {
            targetList.push(current.name);
        }

        // build hacknet list
        if (current.name.includes('hacknet')) {
            hacknetList.push(current.name);
        }
    }

    // refine targets
    targetList = refineTargets(targetList);

    // copy scripts
    await copyScripts(zombieList, hacknetList);

    // write all lists to their respective files
    await ns.write('/text/zombieList.txt', zombieList, 'w');
    await ns.write('/text/targetList.txt', targetList, 'w');
    await ns.write('/text/hacknetList.txt', hacknetList, 'w');
}