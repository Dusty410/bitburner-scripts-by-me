/** @param {import(".").NS } ns */
export async function main(ns) {
    

    function shouldAscend(gangMem) {
        let gangMemInfo = ns.gang.getMemberInformation(gangMem);
        let gangMemInfoAsc = ns.gang.getAscensionResult(gangMem);

        // somehow only check stats that are important to the current task
        let gangMemCurrentTaskStats = ns.gang.getTaskStats(gangMemInfo.task);

        let hackCheck = gangMemCurrentTaskStats.hackWeight > 0;
        let strCheck = gangMemCurrentTaskStats.strWeight > 0;
        let defCheck = gangMemCurrentTaskStats.defWeight > 0;
        let dexCheck = gangMemCurrentTaskStats.dexWeight > 0;
        let agiCheck = gangMemCurrentTaskStats.agiWeight > 0;
        let chaCheck = gangMemCurrentTaskStats.chaWeight > 0;

        if (
            gangMemInfoAsc.str - gangMemInfo.str_asc_mult > 1 &&
            gangMemInfoAsc.def - gangMemInfo.def_asc_mult > 1 &&
            gangMemInfoAsc.dex - gangMemInfo.dex_asc_mult > 1 &&
            gangMemInfoAsc.agi - gangMemInfo.agi_asc_mult > 1
        ) {
            return true;
        } else  {
            return false;
        }
    }

    function buyAllEquipment(member) {

    }

    function buyAllAugs(member) {

    }

    function getMemTasksRespWant(member) {
        let memberTasksList = [];
        let taskList = ns.gang.getTaskNames();
        for (let i in taskList) {
            let currentTask = taskList[i];
            let tasksRespWant = {};
            
            ns.gang.setMemberTask(member, currentTask);
            tasksRespWant.taskName = currentTask;
            tasksRespWant.respectGain = ns.gang.getMemberInformation(member).respectGain;
            tasksRespWant.wantedGain = ns.gang.getMemberInformation(member).wantedLevelGain;
            memberTasksList.unshift(tasksRespWant);
        }
    }

    function shouldSwitchTask(member, newTask) {
        let currentTask = ns.gang.getMemberInformation(member).task;
        let respectGain = ns.gang.getTaskStats(newTask).baseRespect;
        let wantedGain = ns.gang.getTaskStats(newTask).baseWanted;
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
 */