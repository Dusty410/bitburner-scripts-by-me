/** @param {import(".").NS } ns */
export async function main(ns) {

    const ASC_MULT_LIMIT = 20;

    /**
     * Assigns member to a task, only care about train combat, train hack, and human trafficking
     * 
     * @param {string} member 
     */
     function assignTask(member) {
        let memberStats = ns.gang.getMemberInformation(member);

        let checkTrnCombat = [];
        checkTrnCombat.push(memberStats.str_asc_mult < ASC_MULT_LIMIT);
        checkTrnCombat.push(memberStats.def_asc_mult < ASC_MULT_LIMIT);
        checkTrnCombat.push(memberStats.dex_asc_mult < ASC_MULT_LIMIT);
        if (checkTrnCombat.some(x => x) && memberStats.task != 'Train Combat') {
            ns.gang.setMemberTask(member, 'Train Combat');
        }

        let checkTrnHack = [];
        checkTrnHack.push(memberStats.hack_asc_mult < ASC_MULT_LIMIT);
        checkTrnHack.push(memberStats.str_asc_mult >= ASC_MULT_LIMIT);
        checkTrnHack.push(memberStats.def_asc_mult >= ASC_MULT_LIMIT);
        checkTrnHack.push(memberStats.dex_asc_mult >= ASC_MULT_LIMIT);
        checkTrnHack.push(memberStats.task != 'Train Hacking');
        if (checkTrnHack.every(x => x)) {
            ns.gang.setMemberTask(member, 'Train Hacking');
        }

        let checkHumanTraffick = [];
        checkHumanTraffick.push(memberStats.hack_asc_mult >= ASC_MULT_LIMIT);
        checkHumanTraffick.push(memberStats.str_asc_mult >= ASC_MULT_LIMIT);
        checkHumanTraffick.push(memberStats.def_asc_mult >= ASC_MULT_LIMIT);
        checkHumanTraffick.push(memberStats.dex_asc_mult >= ASC_MULT_LIMIT);
        checkHumanTraffick.push(memberStats.task != 'Human Trafficking');
        if (checkHumanTraffick.every(x => x)) {
            ns.gang.setMemberTask(member, 'Human Trafficking');
        }
    }

    /**
     * Switch to Territory Warfare right before tick, then switch back right after tick.
     * This maximizes profit, and points entire gang at Territory Warfare, only when needed
     */
    async function switchToWarfare() {
        let power = ns.gang.getGangInformation().power;
        while (ns.gang.getGangInformation().territory < 1) {
            ns.gang.getMemberNames().forEach(
                member => {
                    ns.gang.setMemberTask(member, 'Territory Warfare');
                }
            )
            // poll for tick
            while (power == ns.gang.getGangInformation().power) {
                await ns.sleep(25);
            }
            // tick should happen by this point
            power = ns.gang.getGangInformation().power;
            // assign each member to appropriate task
            ns.gang.getMemberNames().forEach(
                member => {
                    assignTask(member);
                }
            )
            await ns.sleep(19.5 * 1e3);
        }
        await ns.sleep(25);
    }

    await switchToWarfare();
}