/** @param {import(".").NS } ns */
export async function main(ns) {
	var data = ns.corporation.getCorporation();
	ns.tprint(data);
}