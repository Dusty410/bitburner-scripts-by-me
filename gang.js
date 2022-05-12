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

    function buyEquipment(gangMem) {

    }

    async function isWantedPenaltyGrowing() {
        let firstWantedPenalty = ns.gang.getGangInformation().wantedPenalty;
        while (firstWantedPenalty == ns.gang.getGangInformation().wantedPenalty) {
            await ns.sleep(1 * 1e3);
        }
        let secondWantedPenalty = ns.gang.getGangInformation().wantedPenalty;

        return firstWantedPenalty < secondWantedPenalty;
    }

    while (true) {
        // recruit, if possible
        if (ns.gang.canRecruitMember()) {
            let memName = Math.floor(Math.random() * 1e6);
            ns.gang.recruitMember(memName);
            ns.gang.setMemberTask(memName, 'Train Combat');
        }

        // set tasks
        let gangMemList = ns.gang.getMemberNames();
        for (let i in gangMemList) {
            let currentMem = gangMemList[i];
            ns.gang.getMemberInformation(currentMem).upgrades
        }
        await ns.sleep(1 * 1e3);
    }
}

// wanted penalty: 1 - (respect / (respect + wanted level))