/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.disableLog('sleep');

    const RELEVANT_TASKS = ['Human Trafficking', 'Train Combat', 'Train Hacking', 'Territory Warfare'];

    // TODO: add function to find and track gang warfare ticks, so that all members can switch to territory warfare
    // right before tick, and then switch back right after tick
    function listenForTick() {
        let tickTimeStamp;



        return tickTimeStamp;
    }

    function attemptTurnOnWar() {

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
        // our target is 1.5
        let memberAscResult = ns.gang.getAscensionResult(member) ?? { agi: 0, cha: 0, def: 0, dex: 0, hack: 0, respect: 0, str: 0 };
        // translate relevant task weights to memberAscResult stats
        let relevantAscStatNames = Object.getOwnPropertyNames(memberAscResult).filter(x => subInStringArr(relevantTaskWeightNames, x));

        let ascBln = relevantAscStatNames.every(x => memberAscResult[x] > 1.5)
        return ascBln;
    }

    /**
     * Assigns task to a gang member, only care about train combat, train hack, and human trafficking
     * 
     * @param {string} member 
     */
    function assignTask(member) {
        let memberStats = ns.gang.getMemberInformation(member);

        let checkTrnCombat = [];
        checkTrnCombat.push(memberStats.str_asc_mult < 20);
        checkTrnCombat.push(memberStats.def_asc_mult < 20);
        checkTrnCombat.push(memberStats.dex_asc_mult < 20);
        checkTrnCombat.push(memberStats.agi_asc_mult < 20);
        checkTrnCombat.push(memberStats.task != 'Train Combat');
        checkTrnCombat.push(memberStats.task != 'Territory Warfare');
        if (checkTrnCombat.every(x => x)) {
            ns.gang.setMemberTask(member, 'Train Combat');
        }

        let checkTrnHack = [];
        checkTrnHack.push(memberStats.hack_asc_mult < 20);
        checkTrnHack.push(memberStats.str_asc_mult >= 20);
        checkTrnHack.push(memberStats.def_asc_mult >= 20);
        checkTrnHack.push(memberStats.dex_asc_mult >= 20);
        checkTrnHack.push(memberStats.agi_asc_mult >= 20);
        checkTrnHack.push(memberStats.task != 'Train Hacking');
        checkTrnHack.push(memberStats.task != 'Territory Warfare');
        if (checkTrnHack.every(x => x)) {
            ns.gang.setMemberTask(member, 'Train Hacking');
        }

        let checkHumanTraffick = [];
        checkHumanTraffick.push(memberStats.hack_asc_mult >= 20);
        checkHumanTraffick.push(memberStats.str_asc_mult >= 20);
        checkHumanTraffick.push(memberStats.def_asc_mult >= 20);
        checkHumanTraffick.push(memberStats.dex_asc_mult >= 20);
        checkHumanTraffick.push(memberStats.agi_asc_mult >= 20);
        checkHumanTraffick.push(memberStats.task != 'Human Trafficking');
        checkHumanTraffick.push(memberStats.task != 'Territory Warfare');
        if (checkHumanTraffick.every(x => x)) {
            ns.gang.setMemberTask(member, 'Human Trafficking');
        }
    }

    /**
     * Used to get wanted gain and respect gain for all tasks for a gang member,
     * which can be useful to determine which task to switch to next
     * 
     * @param {String} gangMem gang member's name
     * @returns list of tasks objects for gang member, and each task's wanted gain and respect gain
     */
    function getMemTasksRespWant(gangMem) {
        let memberTasksList = [];
        let taskList = ns.gang.getTaskNames();
        let originalTask = ns.gang.getMemberInformation(gangMem).task;
        // loop through each task, grabbing respect & wanted for that task
        for (let i in taskList) {
            let currentTask = taskList[i];
            let tasksRespWant = {};

            ns.gang.setMemberTask(gangMem, currentTask);
            tasksRespWant.taskName = currentTask;
            tasksRespWant.respectGain = ns.gang.getMemberInformation(gangMem).respectGain;
            tasksRespWant.wantedGain = ns.gang.getMemberInformation(gangMem).wantedLevelGain;
            memberTasksList.push(tasksRespWant);
        }
        // reset member to original task
        ns.gang.setMemberTask(gangMem, originalTask);

        return memberTasksList;
    }

    /**
     * Determine if gang member should switch to new task, based solely on wanted gain to respect 
     * gain ratio
     * 
     * @param {String} member gang member name
     * @param {String} newTask task we're checking if we should switch to
     * @returns true if switching to newTask is advantageous
     */
    function shouldSwitchTask(member, newTask) {
        let taskStats = getMemTasksRespWant(member).filter(task => task.taskName == newTask)[0];
        return (taskStats.wantedGain / taskStats.respectGain) < 0.01;
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
                // ascend members
                if (shouldAscend(member)) {
                    ns.gang.ascendMember(member);
                }

                // assign tasks
                assignTask(member);

                // purchase equipment
                buyGear(member);
            }
        );
        await ns.sleep(1 * 1e3);
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