/** @param {import(".").NS } ns */
export async function main(ns) {
    const RELEVANT_TASKS = ['Human Trafficking', 'Train Combat', 'Train Hacking', 'Train Charisma', 'Territory Warfare'];

    // TODO: add function to find and track gang warfare ticks, so that all members can switch to territory warfare
    // right before tick, and then switch back right after tick
    

    // ascend if current relevant stats mult would increase to be at least 1 greater
    // use fibonacci for delta ascend values
    function shouldAscend(gangMem) {
        let gangMemInfo = ns.gang.getMemberInformation(gangMem);
        let gangMemInfoAsc = ns.gang.getAscensionResult(gangMem);

        // grab only stats that are important to the current task
        let gangMemCurrentTaskStats = ns.gang.getTaskStats(gangMemInfo.task);
        let allTaskWeights = Object.getOwnPropertyNames(gangMemCurrentTaskStats).filter(name => name.includes('Weight'));
        let relevantTaskWeights = allTaskWeights.filter(name => gangMemCurrentTaskStats[name] > 0);

        // translate relevant task weights to character stats compare, for before and after asc
        // get relevant stats for gangMemInfo and for gangMemInfoAsc



    }

    function buyAllEquipment(member) {

    }

    function buyAllAugs(member) {

    }

    function attemptTurnOnWar() {

    }

    function getMemTasksRespWant(member) {
        let memberTasksList = [];
        let taskList = ns.gang.getTaskNames();
        let originalTask = ns.gang.getMemberInformation(member).task;
        // loop through each task, grabbing respect & wanted for that task
        for (let i in taskList) {
            let currentTask = taskList[i];
            let tasksRespWant = {};

            ns.gang.setMemberTask(member, currentTask);
            tasksRespWant.taskName = currentTask;
            tasksRespWant.respectGain = ns.gang.getMemberInformation(member).respectGain;
            tasksRespWant.wantedGain = ns.gang.getMemberInformation(member).wantedLevelGain;
            memberTasksList.push(tasksRespWant);
        }
        // reset member to original task
        ns.gang.setMemberTask(originalTask);

        return memberTasksList;
    }

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