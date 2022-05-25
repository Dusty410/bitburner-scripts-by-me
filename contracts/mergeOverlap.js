/** @param {import("..").NS } ns */
export async function main(ns) {
    let intervals = [[4, 14], [8, 15], [25, 26], [25, 27], [18, 24], [16, 25], [3, 6], [17, 21], [18, 21], [21, 23]];
    let intervalsCopy = Array.from(intervals);

    function MOI(intervalsList) {
        for (let i in intervalsList) {
            let current = intervalsList[i];
            for (let j = i + 1; j < intervalsList.length; j++) {
                let compare = intervals[j];
                if (compare[0] < current[0]) {

                }
            }
        }
    }
}

