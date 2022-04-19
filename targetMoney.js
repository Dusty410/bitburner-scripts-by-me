/** @param {NS} ns */
export async function main(ns) {
	var target_list = ns.read('/text/target_list.txt').split(',');
	for (let i in target_list) {
		var target = target_list[i];
		var max_money = Intl.NumberFormat('en-US').format(ns.getServerMaxMoney(target));
		var current_money = Intl.NumberFormat('en-US').format(ns.getServerMoneyAvailable(target));
		var min_sec = ns.getServerMinSecurityLevel(target);
		var pad = 16;
		ns.tprint(target.padStart(pad, ' ') + " current: $" + current_money);
		ns.tprint(target.padStart(pad, ' ') + "     max: $" + max_money);
		ns.tprint(target.padStart(pad, ' ') + " min sec: " + min_sec);
		ns.tprint('\n');
	}
}