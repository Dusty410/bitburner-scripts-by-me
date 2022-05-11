/** @param {import(".").NS } ns */
export async function main(ns) {
    let server = ns.args[0];
    let target = ns.args[1];

    // script RAM costs
    const hackScriptRAM = ns.getScriptRam('hackv2.js');
    const growScriptRAM = ns.getScriptRam('grow.js');
    const weakenScriptRAM = ns.getScriptRam('weaken.js');
    const batchScriptRAM = ns.getScriptRam('batchv2.js');
    const chauffeurScriptRAM = ns.getScriptRam('chauffeur.js');

    // amount to stagger scripts by
    const stagger = 200;

    // figure out free ram on server, with special circumstances for home
    let freeRAM;
    if (server == 'home') {
        freeRAM = ns.getServerMaxRam(server) - chauffeurScriptRAM -
            (batchScriptRAM * (ns.getPurchasedServers().length + 1)) - 32;
    } else {
        freeRAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    }

    // weaken to min security
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
        let initWeakenThreadsIdeal = Math.ceil((ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) / 0.05);
        let initWeakenThreadsRAMAllow = Math.floor(freeRAM / weakenScriptRAM);
        let numWeakenRounds = Math.ceil(initWeakenThreadsIdeal / initWeakenThreadsRAMAllow);

        for (let i = 0; i < numWeakenRounds; i++) {
            ns.exec('weaken.js', server, initWeakenThreadsRAMAllow, target, 0, Math.random());
            await ns.sleep(ns.getWeakenTime(target) + 200);
        }
    }

    // grow money while reverting sec incr from grows
    while (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
        let initGrowFactorIdeal = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);
        let breakFlag = false; // set flag to prevent totalRAM overrun
        let initGrowFactor = ns.formulas.hacking.growPercent(ns.getServer(target), 1, ns.getPlayer());
        let initGrowIncrement = ns.formulas.hacking.growPercent(ns.getServer(target), 2, ns.getPlayer()) - initGrowFactor;

        for (initGrowFactor; initGrowFactor <= initGrowFactorIdeal; initGrowFactor += initGrowIncrement) {
            // determine grow and weaken threads based on incremental grow factor
            var initGrowThreads = Math.ceil(ns.growthAnalyze(target, initGrowFactor));
            let initGrowSecIncr = ns.growthAnalyzeSecurity(initGrowThreads);
            var initWeakenThreads = Math.ceil(initGrowSecIncr / 0.05);

            // determine total ram possible
            let initGrowRAM = initGrowThreads * growScriptRAM;
            let initWeakenRAM = initWeakenThreads * weakenScriptRAM;
            let initTotalRAM = initGrowRAM + initWeakenRAM;

            // check if we should break the loop
            if (breakFlag) {
                break;
            }

            // check if ram has overrun, if it has, set break flag, and set loop to last iteration
            if (initTotalRAM > freeRAM) {
                breakFlag = true;
                initGrowFactor -= initGrowIncrement * 2;
            }
        }

        // get times for staggering
        let initWeakenTime = Math.ceil(ns.getWeakenTime(target));
        let initGrowTime = Math.ceil(ns.getGrowTime(target));

        ns.exec('weaken.js', server, initWeakenThreads, target, 0, Math.random());
        ns.exec('grow.js', server, initGrowThreads, target, (initWeakenTime - initGrowTime - stagger), Math.random());
        await ns.sleep(initWeakenTime + stagger);
    }

    // determine highest steal factor, given a server's available RAM
    let breakFlag = false; // set flag to prevent totalRAM overrun
    for (let i = 0; i < 100; i++) {
        let stealFactor = i / 100; // divide by 100 to get steal factor
        let moneyToSteal = ns.getServerMaxMoney(target) * stealFactor;

        // ==HACK==
        // get number of threads needed to take specific amount of money
        var hackThreads = Math.floor(ns.hackAnalyzeThreads(target, moneyToSteal));
        // get security increase if hacked with hack_threads
        let hackSecIncr = ns.hackAnalyzeSecurity(hackThreads);

        // ==GROW==
        // num threads to use to grow money to reverse last hack
        var growThreads = Math.ceil(ns.growthAnalyze(target, (1 / (1 - stealFactor))));
        // get security increase from grow with grow_threads
        let growSecIncr = ns.growthAnalyzeSecurity(growThreads);

        // ==WEAKEN==
        // get number of threads to reverse incr from hack
        var weakenHackThreads = Math.ceil(hackSecIncr / 0.05);
        // get number of threads to reverse incr from grow
        var weakenGrowThreads = Math.ceil(growSecIncr / 0.05);

        // ram
        let hackRAM = hackThreads * hackScriptRAM;
        let weakenHackRAM = weakenHackThreads * weakenScriptRAM;
        let growRAM = growThreads * growScriptRAM;
        let weakenGrowRAM = weakenGrowThreads * weakenScriptRAM;
        var totalRAM = hackRAM + weakenHackRAM + growRAM + weakenGrowRAM;

        if (breakFlag) {
            break;
        }

        // check if ram has overrun, if it has, set break flag, and set loop to last iteration
        if (totalRAM > freeRAM) {
            breakFlag = true;
            i -= 2;
        }
    }

    // possible batches, based solely on freeRAM
    let numBatchesRAM = Math.floor(freeRAM / totalRAM);

    // possible batches, based solely on time
    let batchTotalTime = Math.ceil(ns.getWeakenTime(target)) + (stagger * 3);
    let timeBetweenBatches = stagger * 4;
    let numBatchesTime = Math.floor(batchTotalTime / timeBetweenBatches);

    // determine the lower of num_batches_ram and num_batches_time
    let numBatches = Math.min(numBatchesRAM, numBatchesTime);

    // loop and create batches, sleep on the server side, not on home
    // only sleep on home between batch send
    // 1st arg is target
    // 2nd arg is sleep time
    // 3rd is random number to get unique process id
    if (numBatches >= 1) {
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
                ns.exec('weaken.js', server, weakenGrowThreads, target, (stagger * 2), Math.random());
                // grow, finishes 3rd
                ns.exec('grow.js', server, growThreads, target, (weakenTime - growTime + stagger), Math.random());
                // hack, finishes 1st
                ns.exec('hackv2.js', server, hackThreads, target, (weakenTime - hackTime - stagger), Math.random());

                if ((weakenTime + (stagger * 3)) / numBatches < stagger * 3) {
                    await ns.sleep(stagger * 3);
                } else {
                    await ns.sleep((weakenTime + (stagger * 3)) / numBatches);
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
 * grow amount: threads
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