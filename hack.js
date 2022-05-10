/** @param {import(".").NS } ns */
export async function main(ns) {
    var target_list = ns.args[0].split(',');
    var hack_chance_limit = 0;
    var sec_limit_factor = 1;
    var money_limit_factor = 1;
    while (true) {
        for (let i in target_list) {
            var target = target_list[i];
            while (ns.getServerSecurityLevel(target) > (sec_limit_factor * ns.getServerMinSecurityLevel(target))) {
                await ns.weaken(target);
            }
            var chance = ns.hackAnalyzeChance(target);
            ns.print(target + " hack chance is " + chance);
            if (chance > hack_chance_limit) {
                await ns.hack(target);
                
                while (ns.getServerSecurityLevel(target) > (sec_limit_factor * ns.getServerMinSecurityLevel(target))) {
                    await ns.weaken(target);
                }

                while (ns.getServerMoneyAvailable(target) < (money_limit_factor * ns.getServerMaxMoney(target))) {
                    await ns.grow(target);
                    while (ns.getServerSecurityLevel(target) > (sec_limit_factor * ns.getServerMinSecurityLevel(target))) {
                        await ns.weaken(target);
                    }
                }
            }
        }
    }
}

// hack time: hack skill and server sec lvl
// hack amount: thread count
// grow time: hack skill and server sec lvl
// grow amount: thread count and server growth rate and sec lvl
// weaken time: hack skill and server sec lvl
// weaken amount: 0.05 * thread count