/** @param {import(".").NS } ns */
export async function main(ns) {
    if (ns.args[0] == 'y') {
        ns.tail();
    }
    ns.disableLog('ALL');
    ns.clearLog();

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
        let serverObj = getServerObj(serverList, serverName);
        let serverParentObj = getServerObj(serverList, serverObj.parent);

        if (serverParentObj.children.indexOf(serverName) == serverParentObj.children.length - 1) {
            return false;
        } else {
            return true;
        }
    }

    function drawTree(serverList) {
        let depthString = '';
        for (let i in serverList) {
            let current = serverList[i];
            let serverString = '╞' + current.name;

            // post a square based on backdoor status of one of the story significant servers
            if (['CSEC', 'avmnite-02h', 'I.I.I.I', 'run4theh111z', 'The-Cave'].includes(current.name)) {
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

    function getServerTree(server, masterList, depth) {

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
                getServerTree(child, masterList, depth + 1);
            }

        } else {
            serverObj.children = null;
            masterList.push(serverObj);
        }
    }

    let serverList = [];
    getServerTree('home', serverList, 0);
    drawTree(serverList);
    // ns.tprint(serverList);

    // await ns.write('/text/serverObjectList.txt', serverList, 'w');
}