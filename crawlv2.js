/** @param {import(".").NS } ns */
export async function main(ns) {
    if (ns.args[0] == 'y') {
        ns.tail();
    }
    ns.disableLog('ALL');
    ns.clearLog();

    const STORY_SERVERS = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z', 'The-Cave', 'fulcrumassets', 'powerhouse-fitness'];
    const HACK_FILES = ['hackv2.js', 'grow.js', 'weaken.js', 'share.js'];

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
        return !(parentObj.children.indexOf(serverName) == parentObj.children.length - 1);
    }

    function drawTree(serverList) {
        let depthString = '';
        for (let i in serverList) {
            let current = serverList[i];
            let serverString = '';
            if (!current.name.includes('hacknet') && !current.name.includes('droid')) {
                if (current.depth > 0) {
                    if (hasYoungerSibling(serverList, current.name)) {
                        serverString += '╞';
                    } else {
                        serverString += '╘';
                    }
                }

                serverString += current.name;

                // post a square based on backdoor status of one of the story significant servers
                if (STORY_SERVERS.includes(current.name)) {
                    if (ns.getPlayer().hacking < ns.getServerRequiredHackingLevel(current.name)) {
                        serverString += '\uD83D\uDD34'; // red circle, can't backdoor
                    } else if (!ns.getServer(current.name).backdoorInstalled) {
                        serverString += '\uD83D\uDFE1'; // yellow circle, can backdoor, haven't yet
                    } else {
                        serverString += '\uD83D\uDFE2'; // green circle, backdoor installed
                    }
                }

                // post a blue square if a contract is present on the server
                let fileList = ns.ls(current.name);
                for (let i in fileList) {
                    let currentFile = fileList[i];
                    if (currentFile.includes('.cct')) {
                        serverString += '\uD83D\uDCC3'; // page with curl, contract is present
                    }
                }

                // mark w0r1d_d43m0n
                if (current.name == 'w0r1d_d43m0n') {
                    serverString += '\uD83D\uDE08'; // smiling demon
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
    }

    function getPathToServer(serverObjList, target) {
        let serverPath = [];
        let serverObj = getServerObj(serverObjList, target);

        while (serverObj.depth > 0) {
            serverPath.unshift(serverObj.name);
            serverObj = getParentObj(serverObjList, serverObj.name);
        }

        return serverPath;
    }

    function getServerPaths(serverObjList, targetList) {
        let pathsList = [];
        for (let i in targetList) {
            let current = targetList[i];
            let targetPathObj = {
                name: current,
                path: getPathToServer(serverObjList, current)
            };
            pathsList.push(targetPathObj);
        }
        return pathsList;
    }

    function connectToServer(serverObjList, target) {
        let pathToServer = getPathToServer(serverObjList, target);
        pathToServer.forEach(ns.singularity.connect);
    }

    async function backdoorServerObjList(serverObjList, targetPathsObj) {
        let origin = ns.singularity.getCurrentServer();
        ns.singularity.connect('home');
        for (let i in targetPathsObj) {
            let current = targetPathsObj[i];
            for (let j in current.path) {
                ns.singularity.connect(current.path[j]);
            }
            if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current.name)) {
                if (!ns.getServer(current.name).backdoorInstalled) {
                    await ns.singularity.installBackdoor();
                    ns.tprint("Installed backdoor on " + current.name);
                } else {
                    ns.tprint("Backdoor already installed on " + current.name);
                }
            } else {
                ns.tprint(
                    "Can't backdoor " + current.name +
                    ", need hacking level of " +
                    ns.getServerRequiredHackingLevel(current.name)
                );
            }
            ns.singularity.connect('home');
        }
        connectToServer(serverObjList, origin);
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
                // if (!ns.getServer(current).purchasedByPlayer && !current.includes('darkweb')) {
                if (!current.includes('darkweb')) {
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
            await ns.scp(HACK_FILES, current);
        }
    }

    let serverObjList = [];
    // zombies are nuked servers that we can use to hack other servers
    let zombieList = [];
    // targets are servers that are hackable, with money > 0
    let targetList = [];
    // hacknet servers
    let hacknetList = [];

    let minRAM = ns.getScriptRam('hackv2.js') + ns.getScriptRam('grow.js') + (ns.getScriptRam('weaken.js') * 2);

    buildServerTree('home', serverObjList, 0);
    drawTree(serverObjList);
    let storyPathsObj = getServerPaths(serverObjList, STORY_SERVERS);
    await backdoorServerObjList(serverObjList, storyPathsObj);

    for (let i in serverObjList) {
        let current = serverObjList[i];
        // build zombie list
        if (ns.hasRootAccess(current.name)
            && ns.getServerMaxRam(current.name) > minRAM
            && !current.name.includes('hacknet')
            && !current.name.includes('droid')
        ) {
            zombieList.push(current.name);
        }
        //!current.name.includes('hacknet') && !current.name.includes('droid')
        // build target list
        if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current.name) && ns.getServerMaxMoney(current.name) > 0) {
            targetList.push(current.name);
        }

        // build hacknet list
        if (current.name.includes('hacknet') && ns.getServerMaxRam(current.name) > minRAM) {
            hacknetList.push(current.name);
        }
    }

    // refine targets
    targetList = refineTargets(targetList);

    // copy scripts
    await copyScripts(zombieList, hacknetList);

    // report each server count
    ns.tprint(
        '\nZombie count: ' + zombieList.length +
        '\nDroids count: ' + ns.getPurchasedServers().length +
        '\nHacknet count: ' + hacknetList.length +
        '\nTarget count: ' + targetList.length
    );

    // write all lists to their respective files
    await ns.write('/text/serverObjects.txt', serverObjList, 'w');
    await ns.write('/text/zombieList.txt', zombieList, 'w');
    await ns.write('/text/targetList.txt', targetList, 'w');
    await ns.write('/text/hacknetList.txt', hacknetList, 'w');
}