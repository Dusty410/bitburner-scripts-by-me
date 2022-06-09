/** @param {import(".").NS } ns */
export async function main(ns) {
    let server = ns.args[0];
    let target = ns.args[1];

    // ns.tail();

    // sec incr/decr amounts
    const HACK_SEC_INCR = 0.002;
    const GROW_SEC_INCR = 0.004;
    const WEAKEN_SEC_DECR = 0.05;

    // script RAM costs
    const HACK_SCRIPT_RAM = ns.getScriptRam('hackv2.js');
    const GROW_SCRIPT_RAM = ns.getScriptRam('grow.js');
    const WEAKEN_SCRIPT_RAM = ns.getScriptRam('weaken.js');
    const BATCH_SCRIPT_RAM = ns.getScriptRam('batchv3.js');
    const HOME_SCRIPTS = ns.read('/text/reservedScripts.txt').split(',');
    // [
    //     'singularity.js',
    //     'HNSpend.js',
    //     'HNUpgrade.js',
    //     'gang.js',
    //     'gangWarSwitch.js',
    //     'sleeve.js',
    //     'execBatch.js',
    //     'expandDroids.js',
    //     'bladeburner.js'
    // ];

    // arbitrary amount to keep free on home
    const HOME_RAM_KEEP_FREE = 32;

    // iter over HOME_SCRIPTS, get ram values, sum together
    let homeScriptsRAMValues = HOME_SCRIPTS.map(x => ns.getScriptRam(x));
    let homeScriptsRAMSum = homeScriptsRAMValues.reduce((total, element) => total + element);

    // amount to stagger scripts by, in milliseconds
    const STAGGER = 200;

    // figure out free ram on server, with special circumstances for home
    let freeRAM;
    if (server == 'home') {
        freeRAM = ns.getServerMaxRam(server) - homeScriptsRAMSum -
            (BATCH_SCRIPT_RAM * (ns.getPurchasedServers().length + ns.hacknet.numNodes() + 1)) - HOME_RAM_KEEP_FREE;
    } else {
        freeRAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    }

    // weaken to min security
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
        let initWknThrIdl = Math.ceil((ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) / WEAKEN_SEC_DECR);
        let initWknThrLmt = Math.floor(freeRAM / WEAKEN_SCRIPT_RAM);
        let numWknRnds = Math.ceil(initWknThrIdl / initWknThrLmt);
        let initWknThr = Math.min(initWknThrIdl, initWknThrLmt);

        if (initWknThr >= 1) {
            for (let i = 0; i < numWknRnds; i++) {
                ns.exec('weaken.js', server, initWknThr, target, 0, Math.random());
                await ns.sleep(ns.getWeakenTime(target) + STAGGER);
            }
        }
    }

    // new alg to grow money while weakening
    while (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
        // calcs & variables assuming we have all the RAM we need on server
        let initGrowFctrIdl = ns.getServerMaxMoney(target) / (Math.max(1, ns.getServerMoneyAvailable(target)));
        let initGrowThrIdl = Math.ceil(ns.growthAnalyze(target, initGrowFctrIdl, ns.getServer(server).cpuCores));
        let initGrowSecIncr = ns.growthAnalyzeSecurity(initGrowThrIdl, target, ns.getServer(server).cpuCores);
        let initWknGrowThrIdl = Math.ceil(initGrowSecIncr / WEAKEN_SEC_DECR);
        let initIdealRAM = (initGrowThrIdl * GROW_SCRIPT_RAM) + (initWknGrowThrIdl * WEAKEN_SCRIPT_RAM);

        let initWknTime = ns.getWeakenTime(target);
        let initGrowTime = ns.getGrowTime(target);

        // if we can't do ideal threads, then find most we can do with RAM
        // else, run with ideal threads
        if (initIdealRAM > freeRAM) {
            let initBrkFlag = false;
            let initGrowThrLmt = 1;
            let initGrowSecIncrLmt;
            let initWknGrowThrLmt;
            let initLimitRAM;

            while (true) {
                initGrowSecIncrLmt = ns.growthAnalyzeSecurity(initGrowThrLmt, target, ns.getServer(server).cpuCores);
                initWknGrowThrLmt = Math.ceil(initGrowSecIncrLmt / WEAKEN_SEC_DECR);
                initLimitRAM = (initGrowThrLmt * GROW_SCRIPT_RAM) + (initWknGrowThrLmt * WEAKEN_SCRIPT_RAM);

                if (initBrkFlag) {
                    break;
                }

                if (initLimitRAM > freeRAM) {
                    initBrkFlag = true;
                    initGrowThrLmt -= 2;
                }

                initGrowThrLmt++;
            }
            if (initWknGrowThrLmt >= 1) {
                ns.exec('weaken.js', server, initWknGrowThrLmt, target, 0, Math.random());
                ns.exec('grow.js', server, initGrowThrLmt, target, (initWknTime - initGrowTime - STAGGER), Math.random());
            }
            await ns.sleep(initWknTime + STAGGER);
        } else {
            ns.exec('weaken.js', server, initWknGrowThrIdl, target, 0, Math.random());
            ns.exec('grow.js', server, initGrowThrIdl, target, (initWknTime - initGrowTime - STAGGER), Math.random());
            await ns.sleep(initWknTime + STAGGER);
        }
    }

    // determine highest steal factor, given a server's available RAM
    let breakFlag = false; // set flag to prevent totalRAM overrun
    for (let i = 1; i < 100; i++) {
        let stealFactor = i / 100; // divide by 100 to get steal factor
        let moneyToSteal = ns.getServerMaxMoney(target) * stealFactor;

        // ==HACK==
        // get number of threads needed to take specific amount of money
        var hackThreads = Math.max(1, Math.floor(ns.hackAnalyzeThreads(target, moneyToSteal)));
        // get security increase if hacked with hack_threads
        let hackSecIncr = ns.hackAnalyzeSecurity(hackThreads, target);

        // ==GROW==
        // num threads to use to grow money to reverse last hack
        var growThreads = Math.ceil(ns.growthAnalyze(target, (1 / (1 - stealFactor)), ns.getServer(server).cpuCores));
        // get security increase from grow with grow_threads
        let growSecIncr = ns.growthAnalyzeSecurity(growThreads, target, ns.getServer(server).cpuCores);

        // ==WEAKEN==
        // get number of threads to reverse incr from hack
        var weakenHackThreads = Math.ceil(hackSecIncr / WEAKEN_SEC_DECR);
        // get number of threads to reverse incr from grow
        var weakenGrowThreads = Math.max(1, Math.ceil(growSecIncr / WEAKEN_SEC_DECR));

        // ram
        let hackRAM = hackThreads * HACK_SCRIPT_RAM;
        let weakenHackRAM = weakenHackThreads * WEAKEN_SCRIPT_RAM;
        let growRAM = growThreads * GROW_SCRIPT_RAM;
        let weakenGrowRAM = weakenGrowThreads * WEAKEN_SCRIPT_RAM;
        var totalRAM = hackRAM + weakenHackRAM + growRAM + weakenGrowRAM;

        if (breakFlag) {
            break;
        }

        // check if ram has overrun, if it has, set break flag, and set loop to last iteration
        if (totalRAM > freeRAM) {
            breakFlag = true;
            i -= 2;
        }
        await ns.sleep(1);
    }

    // possible batches, based solely on freeRAM
    let numBatchesRAM = Math.floor(freeRAM / totalRAM);

    // possible batches, based solely on time
    let batchTotalTime = Math.ceil(ns.getWeakenTime(target)) + (STAGGER * 3);
    let timeBetweenBatches = STAGGER * 4;
    let numBatchesTime = Math.floor(batchTotalTime / timeBetweenBatches);

    // determine the lower of numBatchesRAM and numBatchesTime
    let numBatches = Math.min(numBatchesRAM, numBatchesTime);

    // loop and create batches, sleep on the server side, not on home
    // only sleep on home between batch send
    // 1st arg is target
    // 2nd arg is sleep time
    // 3rd is random number to get unique process id
    if (numBatches >= 1
        && weakenHackThreads >= 1
        && weakenGrowThreads >= 1
        && growThreads >= 1
        && hackThreads >= 1
    ) {
        while (true) {
            for (let i = 0; i < numBatches; i++) {
                // get time in ms to hack server
                let hackTime = Math.ceil(ns.getHackTime(target));
                // get time in ms to grow server
                let growTime = Math.ceil(ns.getGrowTime(target));
                // get time in ms to weaken after hack & grow
                let weakenTime = Math.ceil(ns.getWeakenTime(target));

                // 1st weaken, counter hack, finishes 2nd
                ns.exec('weaken.js', server, weakenHackThreads, target, 0, Math.random());
                // 2nd weaken, counter grow, finishes 4th
                ns.exec('weaken.js', server, weakenGrowThreads, target, (STAGGER * 2), Math.random());
                // grow, finishes 3rd
                ns.exec('grow.js', server, growThreads, target, (weakenTime - growTime + STAGGER), Math.random());
                // hack, finishes 1st
                ns.exec('hackv2.js', server, hackThreads, target, (weakenTime - hackTime - STAGGER), Math.random());

                if ((weakenTime + (STAGGER * 3)) / numBatches < STAGGER * 3) {
                    await ns.sleep(STAGGER * 3);
                } else {
                    await ns.sleep((weakenTime + (STAGGER * 3)) / numBatches);
                }
            }
        }
    }
}

/**
 * hack
 * time: hack skill, sec level
 * hack amount: threads
 * sec incr amount: 0.002 * threads
 *
 * grow
 * time: hack skill, sec level
 * grow amount: threads, target growth rate, sec level
 * sec incr amount: 0.004 * threads
 *
 * weaken
 * time: hack skill, sec level
 * sec decr amount: 0.05 * threads
 *
 * start order, from longest time to shortest:
 * weaken -> weaken -> grow -> hack
 *
 * finish order
 * hack (200ms) weaken (200ms) grow (200ms) weaken
 */