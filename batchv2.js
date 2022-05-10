/** @param {import(".").NS } ns */
export async function main(ns) {
    var server = ns.args[0];
    var target = ns.args[1];

    // figure out free ram on server, with special circumstances for home
    var freeRAM;
    if (server == 'home') {
        freeRAM = ns.getServerMaxRam(server) - ns.getScriptRam('hacknet.js') - ns.getScriptRam('expand.js') -
            (ns.getScriptRam('batch.js') * (ns.getPurchasedServers().length + 1)) - 32;
    } else {
        freeRAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    }

    /**
    * grow
    * time: hack skill, sec level
    * grow amount: threads
    * sec incr amount: 0.004 * threads
    *
    * weaken
    * time: hack skill, sec level
    * sec decr amount: 0.05 * threads
    */

    // weaken to min security
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target)) {
        var initWeakenThreadsIdeal = Math.ceil((ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target)) / 0.05);
        var initWeakenThreadsRAMAllow = Math.floor(freeRAM / ns.getScriptRam('weaken.js'));
        var numWeakenRounds = Math.ceil(initWeakenThreadsIdeal / initWeakenThreadsRAMAllow);

        for (let index = 0; index < numWeakenRounds; index++) {
            ns.exec('weaken.js', server, initWeakenThreadsRAMAllow, target, 0, Math.random());
            await ns.sleep(ns.getWeakenTime(target) + 200);
        }
    }

    // grow money while reverting sec incr from grows
    while (ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
        var initGrowFactor = ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);
        var initGrowThreadsIdeal = Math.ceil(ns.growthAnalyze(target, initGrowFactor));
        var initGrowThreadsRAMAllow = Math.floor(ns.getServerMaxRam(server) / ns.getScriptRam('weaken.js'));
        var initGrowThreads = Math.min(initGrowThreadsIdeal, initGrowThreadsRAMAllow);

        var breakFlag = false; // set flag to prevent total_ram overrun
        for (let i = 1; i <= initGrowFactor; i += 0.1) {

        }
    }

    // determine highest steal factor, given a server's available RAM
    var breakFlag = false; // set flag to prevent total_ram overrun
    for (let i = 0; i < 100; i++) {
        var serverMaxMoney = ns.getServerMaxMoney(target);
        var stealFactor = i / 100; // divide by 100 to get steal factor
        var targetMoney = serverMaxMoney * stealFactor;
        // RAM cost for 1 thread for ea script
        var hackRAMCost = ns.getScriptRam('hackv2.js');
        var growRAMCost = ns.getScriptRam('grow.js');
        var weakenRAMCost = ns.getScriptRam('weaken.js');

        // ==HACK==
        // get number of threads needed to take specific amount of money
        var hackThreads = Math.floor(ns.hackAnalyzeThreads(target, targetMoney));
        // get security increase if hacked with hack_threads
        var hackSecIncr = ns.hackAnalyzeSecurity(hackThreads);

        // ==GROW==
        // num threads to use to grow money to reverse last hack
        var growThreads = Math.ceil(ns.growthAnalyze(target, (1 / (1 - stealFactor))));
        // get security increase from grow with grow_threads
        var growSecIncr = ns.growthAnalyzeSecurity(growThreads);

        // ==WEAKEN==
        // get number of threads to reverse incr from hack
        var weakenHackThreads = Math.ceil(hackSecIncr / 0.05);
        // get number of threads to reverse incr from grow
        var weakenGrowThreads = Math.ceil(growSecIncr / 0.05);

        // ram
        var hackRAM = hackThreads * hackRAMCost;
        var weakenHackRAM = weakenHackThreads * weakenRAMCost;
        var growRAM = growThreads * growRAMCost;
        var weakenGrowRAM = weakenGrowThreads * weakenRAMCost;
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

    // amount to stagger scripts by
    var stagger = 200;

    // possible batches, based solely on free_ram
    var numBatchesRAM = Math.floor(freeRAM / totalRAM);

    // possible batches, based solely on time
    var batchTotalTime = Math.ceil(ns.getWeakenTime(target)) + (stagger * 3);
    var timeBetweenBatches = stagger * 4;
    var numBatchesTime = Math.floor(batchTotalTime / timeBetweenBatches);

    // determine the lower of num_batches_ram and num_batches_time
    var numBatches = Math.min(numBatchesRAM, numBatchesTime);

    // loop and create batches, sleep on the server side, not on home
    // only sleep on home between batch send
    // 1st arg is target
    // 2nd arg is sleep time
    // 3rd is random number to get unique process id
    if (numBatches >= 1) {
        while (true) {
            for (let i = 0; i < numBatches; i++) {

                // get time in ms to hack server
                var hackTime = Math.ceil(ns.getHackTime(target));
                // get time in ms to grow server
                var growTime = Math.ceil(ns.getGrowTime(target));
                // get time in ms to weaken after hack & grow
                var weakenTime = Math.ceil(ns.getWeakenTime(target));

                // stats, to debug
                /**
                ns.print(
                    "\n\nhack threads needed to hack $" + Intl.NumberFormat('en-US').format(target_money) + " (" +
                    (steal_factor * 100) + ")% from " + target + ": " + hack_threads + " (RAM: " + hack_ram + " GiB)" +
                    "\nhack time: " + hack_time +
                    "\nhack sec incr with " + hack_threads + " threads: " + hack_sec_incr +
                    "\nweaken threads to reverse sec incr from hack: " + weaken_hack_threads + " (RAM: " + weaken_hack_ram + " GiB)" +
                    "\nweaken time: " + weaken_time +
                    "\ngrow threads needed to grow money back to 100%: " + grow_threads + " (RAM: " + grow_ram + " GiB)" +
                    "\ngrow time: " + grow_time +
                    "\ngrow sec incr with " + grow_threads + " threads: " + grow_sec_incr +
                    "\nweaken threads to reverse sec incr from grow: " + weaken_grow_threads + " (RAM: " + weaken_grow_ram + " GiB)" +
                    "\nweaken time: " + weaken_time +
                    "\ntotal ram: " + total_ram + " GiB" +
                    "\nsingle batch time: " + batch_total_time +
                    "\ntime between batch exec: " + time_between_batches +
                    "\nthis batch could be run " + num_batches_ram + " times based on RAM" +
                    "\nthis batch could be run " + num_batches_time + " times based on time" +
                    "\nit should be run " + num_batches
                );
                */

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