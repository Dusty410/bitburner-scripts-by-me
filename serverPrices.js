/** @param {import(".").NS } ns */
export async function main(ns) {
	ns.tail();
	ns.disableLog('ALL');
	ns.clearLog();

	for (let i = 1; i <= 20; i++) {
		ns.print(
			(2 ** i) + " GiB RAM costs: $" + Intl.NumberFormat('en-US').format(ns.getPurchasedServerCost(2 ** i)) + ", level " + i
		);
	}
}