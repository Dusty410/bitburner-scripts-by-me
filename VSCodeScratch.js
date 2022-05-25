/** @param {import(".").NS } ns */
export async function main(ns) {
    let member = 1;
    let memberInfo = ns.gang.getMemberInformation(member);
    let memberAscResult = ns.gang.getAscensionResult(member);

    // grab only stats that are important to the current task
    let memberCurrentTaskStats = ns.gang.getTaskStats(memberInfo.task);
    let allTaskWeightNames = Object.getOwnPropertyNames(memberCurrentTaskStats).filter(name => name.includes('Weight'));
    let relevantTaskWeights = allTaskWeightNames.filter(name => memberCurrentTaskStats[name] > 0);

    ns.tprint(JSON.stringify(relevantTaskWeights));
}