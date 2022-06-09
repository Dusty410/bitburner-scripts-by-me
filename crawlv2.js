/** @param {import(".").NS } ns */
export async function main(ns) {
    if (ns.args[0] == 'y') {
        ns.tail();
    }
    ns.disableLog('ALL');
    ns.clearLog();

    const STORY_SERVERS = ['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z', 'The-Cave', 'fulcrumassets', 'powerhouse-fitness'];
    const HACK_FILES = ['hackv2.js', 'grow.js', 'weaken.js', 'share.js'];

    /**
     * Attempts to open ports and nuke the target server
     * 
     * @param {string} server target to nuke
     * @returns whether the nuke attempt was successful
     */
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

    /**
     * Finds and returns a single server object using the target name
     * 
     * @param {object[]} serverObjList object list of entire server tree
     * @param {string} target target server name
     * @returns server object for single server
     */
    function getServerObj(serverObjList, target) {
        for (let i in serverObjList) {
            let serverObj = serverObjList[i];
            if (serverObj.name == target) {
                return serverObj;
            }
        }
    }

    /**
     * Finds and returns a server object for the parent of the target server
     * 
     * @param {object[]} serverObjList object list of entire server tree
     * @param {string} target target server name
     * @returns server object for parent of target
     */
    function getParentObj(serverObjList, target) {
        let parentName = '';

        for (let i in serverObjList) {
            let serverObj = serverObjList[i];
            if (serverObj.name == target) {
                parentName = serverObj.parent;
            }
        }

        return getServerObj(serverObjList, parentName);
    }

    /**
     * Returns true if the target has a younger sibling in the server tree, false otherwise
     * 
     * @param {object[]} serverObjList object list of entire server tree
     * @param {string} target target server name
     * @returns whether the target has a younger sibling
     */
    function hasYoungerSibling(serverObjList, target) {
        let parentObj = getParentObj(serverObjList, target);
        return !(parentObj.children.indexOf(target) == parentObj.children.length - 1);
    }

    /**
     * Draws server tree to script log, including:
     * -server counts
     * -story server status
     * 
     * @param {object[]} serverObjList object list of entire server tree
     */
    async function drawTree(serverObjList) {
        let depthString = '';
        for (let i in serverObjList) {
            let current = serverObjList[i];
            let serverString = '';
            if (!current.name.includes('hacknet') && !current.name.includes('droid')) {
                if (current.depth > 0) {
                    if (hasYoungerSibling(serverObjList, current.name)) {
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
                        serverString += '\uD83D\uDCC3' + ns.codingcontract.getContractType(currentFile, current.name); // page with curl, contract is present
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
                    if (hasYoungerSibling(serverObjList, current.name) && current.children != null) {
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

    /**
     * Get list of server names in order of path to target server
     * 
     * @param {object[]} serverObjList object list of entire server tree
     * @param {string} target target server name
     * @returns array of server names, in order of path
     */
    function getPathToServer(serverObjList, target) {
        let serverPath = [];
        let serverObj = getServerObj(serverObjList, target);

        while (serverObj.depth > 0) {
            serverPath.unshift(serverObj.name);
            serverObj = getParentObj(serverObjList, serverObj.name);
        }

        return serverPath;
    }

    /**
     * Get list of server objects with name and path to each target, used mainly for backdooring story servers
     * 
     * @param {object[]} serverObjList object list of entire server tree
     * @param {string[]} targetList list of target servers
     * @returns array of server objects with name and path to each target
     */
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

    /**
     * Connect to any specified server
     * 
     * @param {object[]} serverObjList object list of entire server tree
     * @param {string} target target server name
     */
    function connectToServer(serverObjList, target) {
        let pathToServer = getPathToServer(serverObjList, target);
        pathToServer.forEach(ns.singularity.connect);
    }

    /**
     * Backdoors all specified servers in the passed pathsList, used mainly for story servers
     * 
     * @param {object[]} serverObjList object list of entire server tree
     * @param {object[]} pathsObjList list of server objects built from function getServerPaths
     */
    async function backdoorServerObjList(serverObjList, pathsObjList) {
        let origin = ns.singularity.getCurrentServer();
        ns.singularity.connect('home');
        for (let i in pathsObjList) {
            let current = pathsObjList[i];
            for (let j in current.path) {
                ns.singularity.connect(current.path[j]);
            }
            // TODO: move this reporting to script log
            if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current.name)
                && ns.hasRootAccess(current.name)
            ) {
                if (!ns.getServer(current.name).backdoorInstalled) {
                    await ns.singularity.installBackdoor();
                    ns.print("Installed backdoor on " + current.name);
                } else {
                    ns.print("Backdoor already installed on " + current.name);
                }
            } else {
                ns.print(
                    "Can't backdoor " + current.name +
                    ", need hacking level of " +
                    ns.getServerRequiredHackingLevel(current.name)
                );
            }
            ns.singularity.connect('home');
        }
        connectToServer(serverObjList, origin);
    }

    /**
     * Attempt to nuke all servers in the provided obj list
     * 
     * @param {object[]} serverObjList entire server tree
     */
    function attemptNukeAll(serverObjList) {
        for (let i in serverObjList) {
            let server = serverObjList[i];
            if (!ns.hasRootAccess(server.name)) {
                attemptNuke(server.name);
            }
        }
    }

    /**
     * Recursive function to build entire server tree object list
     * 
     * @param {string} server current server
     * @param {object[]} masterList master list of all server objects
     * @param {number} depth depth on tree of current server
     */
    function buildServerTree(server, masterList, depth) {

        // attemptNuke(server);

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

    /**
     * Returns sorted target list, making sure targets have money available, sorted by
     * lowest security to highest
     * 
     * @param {string[]} targetList original unrefined target list
     * @returns sorted target list
     */
    function refineTargets(targetList) {
        let refinedTargets = [];
        let newTargetList = [];
        for (let i in targetList) {
            let target = targetList[i];
            let targetMinSec = ns.getServerMinSecurityLevel(target);
            refinedTargets.push({ server: target, minSec: targetMinSec });
        }
        refinedTargets.sort((a, b) => a.minSec - b.minSec);
        // create an array of just target names, but now they'll be in order from least security to most
        for (let i in refinedTargets) {
            newTargetList.push(refinedTargets[i].server);
        }

        return newTargetList;
    }

    /**
     * Copies scripts to all purchased servers, hacknet servers, and zombies, which are
     * servers we control, but don't own
     * 
     * @param {string[]} zombieList list of zombies that can run our scripts
     * @param {string[]} hacknetList list of hacknet servers that can run our scripts
     */
    async function copyScripts(zombieList, hacknetList) {
        let serverList = zombieList.concat(hacknetList).concat(ns.getPurchasedServers());

        for (let i in serverList) {
            let current = serverList[i];
            await ns.scp(HACK_FILES, current);
        }
    }

    let minRAM = ns.getScriptRam('hackv2.js') + ns.getScriptRam('grow.js') + (ns.getScriptRam('weaken.js') * 2);

    // this is the comprehensive server tree, built of server objects
    let serverObjList = [];
    buildServerTree('home', serverObjList, 0);

    while (true) {
        // zombies are nuked servers that we can use to hack other servers, with sufficient RAM
        let zombieList = [];
        // targets are servers that are rooted, with money > 0
        let targetList = [];
        // hacknet servers with sufficient RAM
        let hacknetList = [];

        attemptNukeAll(serverObjList);

        ns.clearLog();
        await drawTree(serverObjList);
        let storyPathsObj = getServerPaths(serverObjList, STORY_SERVERS);
        await backdoorServerObjList(serverObjList, storyPathsObj);

        for (let i in serverObjList) {
            let current = serverObjList[i];
            // build zombie list
            if (ns.hasRootAccess(current.name)
                && ns.getServerMaxRam(current.name) > minRAM // currently 8GiB minimum
                && !ns.getServer(current.name).purchasedByPlayer
            ) {
                zombieList.push(current.name);
            }
            // build target list
            if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(current.name)
                && ns.getServerMaxMoney(current.name) > 0
            ) {
                targetList.push(current.name);
            }
            // build hacknet list
            // if (current.name.includes('hacknet')
            //     && ns.getServerMaxRam(current.name) > minRAM
            // ) {
            //     hacknetList.push(current.name);
            // }
        }

        // build hacknet lists
        ns.scan('home').forEach(
            server => {
                if (server.includes('hacknet')
                    && ns.getServerMaxRam(server) > minRAM
                ) {
                    hacknetList.push(server);
                }
            }
        )

        // refine targets
        targetList = refineTargets(targetList);

        // copy scripts
        await copyScripts(zombieList, hacknetList);

        // report each server count
        ns.print(
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

        await ns.sleep(5 * 1e3);
    }
}