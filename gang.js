/** @param {import(".").NS } ns */
export async function main(ns) {
    const RELEVANT_TASKS = ['Human Trafficking', 'Train Combat', 'Train Hacking', 'Train Charisma', 'Territory Warfare'];

    // TODO: add function to find and track gang warfare ticks, so that all members can switch to territory warfare
    // right before tick, and then switch back right after tick
    function listenForTick() {
        let tickTimeStamp;

        

        return tickTimeStamp;
    }

    /**
     * Check if we should ascend, based on all gang member's ascension multipliers being over 20,
     * except charisma
     * 
     * @param {string} member gang member's name
     * @returns True if we should ascend
     */
    function shouldAscend(member) {
        let memberInfo = ns.gang.getMemberInformation(member);
        // asc result is a decimal multipler increase, so 1.1 is an increase of 10%
        let memberAscResult = ns.gang.getAscensionResult(member);

        // grab list of relevant task weights for member's current task
        let memberCurrentTaskStats = ns.gang.getTaskStats(memberInfo.task);
        let allTaskWeightNames = Object.getOwnPropertyNames(memberCurrentTaskStats).filter(name => name.includes('Weight'));
        let relevantTaskWeights = allTaskWeightNames.filter(name => memberCurrentTaskStats[name] > 0);

        // translate relevant task weights to memberAscResult stats
        
    }

    function buyAllEquipment(member) {

    }

    function buyAllAugs(member) {

    }

    function attemptTurnOnWar() {

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

    while (true) {
        // recruit, if possible
        if (ns.gang.canRecruitMember()) {
            let memberName = Math.floor(Math.random() * 1e6);
            ns.gang.recruitMember(memberName);
            ns.gang.setMemberTask(memberName, 'Train Combat');
        }


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