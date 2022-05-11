/** @param {import(".").NS } ns */
export async function main(ns) {
    // ns.tail();

    var server = ns.args[0];
    var target = ns.args[1];

    // figure out free ram on server, with special circumstances for home
    var free_ram;
    if (server == 'home') {
        free_ram = ns.getServerMaxRam(server) - ns.getScriptRam('hacknet.js') - ns.getScriptRam('expand.js') -
            (ns.getScriptRam('batch.js') * (ns.getPurchasedServers().length + 1)) - 32;
    } else {
        free_ram = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    }

    // initialize money and sec
    var init_threads = Math.floor(free_ram / ns.getScriptRam('init.js'));
    if (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) ||
        ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
        ns.exec('init.js', server, init_threads, target);
    }

    while (ns.getServerSecurityLevel(target) > ns.getServerMinSecurityLevel(target) ||
        ns.getServerMoneyAvailable(target) < ns.getServerMaxMoney(target)) {
        await ns.sleep(25);
    }

    // determine highest steal factor, given a server's available RAM
    var break_flag = false; // set flag to prevent total_ram overrun
    for (let i = 1; i < 100; i++) {
        var server_max_money = ns.getServerMaxMoney(target);
        var steal_factor = i / 100; // divide by 100 to get steal factor
        var target_money = server_max_money * steal_factor;
        // RAM cost for 1 thread for ea script
        var hack_ram_cost = ns.getScriptRam('hackv2.js');
        var grow_ram_cost = ns.getScriptRam('grow.js');
        var weaken_ram_cost = ns.getScriptRam('weaken.js');

        // ==HACK==
        // get number of threads needed to take specific amount of money
        var hack_threads = Math.floor(ns.hackAnalyzeThreads(target, target_money));
        // get security increase if hacked with hack_threads
        var hack_sec_incr = ns.hackAnalyzeSecurity(hack_threads);

        // ==GROW==
        // num threads to use to grow money to reverse last hack
        var grow_threads = Math.ceil(ns.growthAnalyze(target, (1 / (1 - steal_factor))));
        // get security increase from grow with grow_threads
        var grow_sec_incr = ns.growthAnalyzeSecurity(grow_threads);

        // ==WEAKEN==
        // get number of threads to reverse incr from hack
        var weaken_hack_threads = Math.ceil(hack_sec_incr / 0.05);
        // get number of threads to reverse incr from grow
        var weaken_grow_threads = Math.ceil(grow_sec_incr / 0.05);

        // ram
        var hack_ram = hack_threads * hack_ram_cost;
        var weaken_hack_ram = weaken_hack_threads * weaken_ram_cost;
        var grow_ram = grow_threads * grow_ram_cost;
        var weaken_grow_ram = weaken_grow_threads * weaken_ram_cost;
        var total_ram = hack_ram + weaken_hack_ram + grow_ram + weaken_grow_ram;

        if (break_flag) {
            break;
        }

        // check if ram has overrun, if it has, set break flag, and set loop to last iteration
        if (total_ram > free_ram) {
            break_flag = true;
            i -= 2;
        }
    }

    // amount to stagger scripts by
    var stagger = 200;

    // possible batches, based solely on free_ram
    var num_batches_ram = Math.floor(free_ram / total_ram);

    // possible batches, based solely on time
    var batch_total_time = Math.ceil(ns.getWeakenTime(target)) + (stagger * 3);
    var time_between_batches = stagger * 4;
    var num_batches_time = Math.floor(batch_total_time / time_between_batches);

    // determine the lower of num_batches_ram and num_batches_time
    var num_batches;
    if (num_batches_time <= num_batches_ram) {
        num_batches = num_batches_time;
    } else {
        num_batches = num_batches_ram;
    }


    // loop and create batches, sleep on the server side, not on home
    // only sleep on home between batch send
    // 1st arg is target
    // 2nd arg is sleep time
    // 3rd is random number to get unique process id
    if (num_batches >= 1) {
        while (true) {
            for (let i = 0; i < num_batches; i++) {

                // get time in ms to hack server
                var hack_time = Math.ceil(ns.getHackTime(target));
                // get time in ms to grow server
                var grow_time = Math.ceil(ns.getGrowTime(target));
                // get time in ms to weaken after hack & grow
                var weaken_time = Math.ceil(ns.getWeakenTime(target));

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
                ns.exec('weaken.js', server, weaken_hack_threads, target, 0, Math.random());
                // 2nd weaken, counter grow, finishes 4th
                ns.exec('weaken.js', server, weaken_grow_threads, target, (stagger * 2), Math.random());
                // grow, finishes 3rd
                ns.exec('grow.js', server, grow_threads, target, (weaken_time - grow_time + stagger), Math.random());
                // hack, finishes 1st
                ns.exec('hackv2.js', server, hack_threads, target, (weaken_time - hack_time - stagger), Math.random());

                if ((weaken_time + (stagger * 3)) / num_batches < stagger * 3) {
                    await ns.sleep(stagger * 3);
                } else {
                    await ns.sleep((weaken_time + (stagger * 3)) / num_batches);
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