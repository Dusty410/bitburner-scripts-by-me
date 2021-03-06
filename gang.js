/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('sleep');

    const ASCEND_CHECK = 1.5;
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
     * If chances are good, turn on Engage in Territory Warfare, and if we hae 100% of the
     * territory, turn it off
     */
    function toggleWar() {
        let myGang = ns.gang.getGangInformation().faction;
        
        if (
            !ns.gang.getGangInformation().territoryWarfareEngaged
            && ns.gang.getGangInformation().territory < 1
        ) {
            let allGangs = Object.getOwnPropertyNames(ns.gang.getOtherGangInformation());
            // remove the gang we're in
            let otherGangs = allGangs.filter(x => x !== myGang);
            let winChances = otherGangs.map(ns.gang.getChanceToWinClash);
            // if all win chances are above 60%, turn on war
            if (winChances.every(x => x > 0.6)) {
                ns.gang.setTerritoryWarfare(true);
            }
        }

        if (
            ns.gang.getGangInformation().territoryWarfareEngaged
            && ns.gang.getGangInformation().territory >= 1
        ) {
            ns.gang.setTerritoryWarfare(false);
        }
    }

    /**
     * Gets current equipment discount for gang as a decimal off
     * for example, 10% off would be 0.1
     * 
     * @returns discount in decimal form
     */
    function getDiscount() {
        let gangInfo = ns.gang.getGangInformation();
        let gangRespect = gangInfo.respect;
        let gangPower = gangInfo.power;

        let discount = Math.pow(gangRespect, 0.01) + gangRespect / 5e6 + Math.pow(gangPower, 0.01) + gangPower / 1e6 - 1;

        return 1 - (1 / Math.max(1, discount));
    }

    /**
     * Attempts to buy all gear for a specific member
     * 
     * @param {string} member 
     */
    function buyGear(member) {
        let allGear = ns.gang.getEquipmentNames();
        if (getDiscount() > 0.9) {
            allGear.forEach(x => ns.gang.purchaseEquipment(member, x));
        }
    }

    /**
     * Check if substring exists in any element of the string array
     * 
     * @param {string[]} array 
     * @param {string} sub 
     * @returns True if sub exists any element of the string array
     */
    function subInStringArr(array, sub) {
        let exists = false;
        for (let i in array) {
            let current = array[i];
            if (current.includes(sub)) {
                exists = true;
            }
        }
        return exists;
    }

    /**
     * Check if we should ascend, based on all gang member's ascension multipliers being over 20,
     * except charisma
     * 
     * @param {string} member gang member's name
     * @returns True if member should ascend
     */
    function shouldAscend(member) {
        let memberInfo = ns.gang.getMemberInformation(member);

        // grab list of relevant task weights for member's current task
        let memberCurrentTaskStats = ns.gang.getTaskStats(memberInfo.task);
        let allTaskWeightNames = Object.getOwnPropertyNames(memberCurrentTaskStats).filter(name => name.includes('Weight'));
        let relevantTaskWeightNames = allTaskWeightNames.filter(name => memberCurrentTaskStats[name] > 0);

        // asc result is a decimal multipler increase, so 1.1 is an increase of 10%
        let memberAscResult = ns.gang.getAscensionResult(member) ?? { agi: 0, cha: 0, def: 0, dex: 0, hack: 0, respect: 0, str: 0 };
        // translate relevant task weights to memberAscResult stats
        let relevantAscStatNames = Object.getOwnPropertyNames(memberAscResult).filter(x => subInStringArr(relevantTaskWeightNames, x));

        let ascBln = relevantAscStatNames.every(x => memberAscResult[x] > ASCEND_CHECK);
        return ascBln;
    }

    /**
     * Check if we can recruit a member, if we can, recruit them and assign a name
     */
    function tryRecruit() {
        if (ns.gang.canRecruitMember()) {
            let memberName = Math.floor(Math.random() * 1e6);
            ns.gang.recruitMember(memberName);
        }
    }

    while (true) {
        tryRecruit();

        ns.gang.getMemberNames().forEach(
            member => {
                // ascend member
                if (shouldAscend(member)) {
                    ns.gang.ascendMember(member);
                }

                // assign task, only if the gang war script isn't running
                if (!ns.scriptRunning('gangWarSwitch.js', 'home')) {
                    assignTask(member);
                }

                // purchase equipment
                buyGear(member);
            }
        );

        // try to turn on gang war
        toggleWar();

        await ns.sleep(25);
    }
}

/**
 * wanted penalty: 1 - (respect / (respect + wanted level))
 * wanted gain cannot be greater than 1% of respect gain
 * otherwise penalty gain increases
 * 
 * Task we care about for combat gang:
 * 
 * Mug People
 * Strongarm Civilians
 * Traffick Illegal Arms
 * Human Trafficking
 * Terrorism
 * Vigilante Justice
 * Train Combat
 * Territory Warfare
 * 
 * new goal, train to asc mult of 20 per relevant stat, then asc
 * 
 * relevant stats for human trafficking are all but agil
 * 
 * do not ascend if equip discount would drop below 50%
 * 
 * set to engage in territory warfare if all clash win chances are > 60%
 * disengage if any drop below that
 */