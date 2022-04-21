/** @param {import(".").NS } ns */
export async function main(ns) {
	while(true) {
		if (ns.hacknet.numHashes() > 4) {
			ns.hacknet.spendHashes('Sell for Money');
		}
		await ns.sleep(25);
	}
}