// Backend/src/services/reportService.js
function formatShortDay(dateStr) {
    const d = dateStr ? new Date(dateStr) : null;
    if (!d || Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLongDay(dateStr) {
    const d = dateStr ? new Date(dateStr) : null;
    if (!d || Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function colorScaleBlue(amount, max) {
    if (!max || max <= 0) return "#93C5FD";
    const t = Math.min(1, Math.max(0, amount / max));
    const from = { r: 147, g: 197, b: 253 };
    const to = { r: 37, g: 99, b: 235 };
    const r = Math.round(from.r + (to.r - from.r) * t);
    const g = Math.round(from.g + (to.g - from.g) * t);
    const b = Math.round(from.b + (to.b - from.b) * t);
    return `rgb(${r}, ${g}, ${b})`;
}

function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }

// Build a chronological ledger of all expense-shares and settlements with running balances
function buildGroupLedger({ expenses, settlements, members }) {
    const idToName = new Map(
        members.map((m) => [m._id?.toString?.() || m.id?.toString?.() || "", m.username || m.name || m.email || "Member"])
    ); // map IDs to display names for rows [web:202]

    // running net: +ve => others owe them, -ve => they owe others [web:196]
    const net = new Map();
    for (const m of members) {
        const id = m._id?.toString?.() || m.id?.toString?.() || "";
        if (id) net.set(id, 0);
    } // init ledger balances [web:318]

    // Chronological merge of expenses and settlements
    const expenseRows = (expenses || []).map((e) => ({
        kind: "expense",
        sortAt: new Date(e.date || e.createdAt || Date.now()).getTime(),
        e,
    })); // expense entries [web:202]
    const settlementRows = (settlements || []).map((s) => ({
        kind: "settlement",
        sortAt: new Date(s.createdAt || Date.now()).getTime(),
        s,
    })); // settlement entries [web:218]
    const rows = [...expenseRows, ...settlementRows].sort((a, b) => a.sortAt - b.sortAt); // chronological ledger [web:202]

    const ledger = []; // array of line items for UI [web:155]

    for (const row of rows) {
        if (row.kind === "expense") {
            const e = row.e;
            const paidBy = e.paidBy?.toString?.() || e.paidBy || "";
            const title = e.title || "";
            const dateDisp = formatLongDay(e.date || e.createdAt);
            const allocations = e.allocations || {};

            // Update payer net with full amount
            const total = Number(e.amount) || 0;
            if (paidBy) net.set(paidBy, round2((net.get(paidBy) || 0) + total)); // payer front-loads cash out [web:196]

            // For each consumer share, decrease their net and emit a “payer paid for consumer” line [web:202]
            for (const [consumerId, share] of Object.entries(allocations)) {
                const sAmt = round2(Number(share) || 0);
                if (!(sAmt > 0)) continue;
                net.set(consumerId, round2((net.get(consumerId) || 0) - sAmt)); // consumer owes their share [web:196]

                ledger.push({
                    kind: "expense",
                    expenseId: e._id?.toString?.() || e.id || "",
                    title,
                    date: dateDisp,
                    payerId: paidBy,
                    payerName: idToName.get(paidBy) || "Member",
                    consumerId,
                    consumerName: idToName.get(consumerId) || "Member",
                    amount: sAmt,
                    currency: e.currency || "INR",
                    splitMethod: e.splitMethod || "equal",
                    // running nets for the two parties after this line
                    payerNetAfter: net.get(paidBy) || 0,
                    consumerNetAfter: net.get(consumerId) || 0,
                }); // per-share line item [web:155]
            }
        } else {
            const s = row.s;
            const fromId = s.from?.toString?.() || s.from || "";
            const toId = s.to?.toString?.() || s.to || "";
            const amt = round2(Number(s.amount) || 0);
            const dateDisp = formatLongDay(s.createdAt || Date.now());

            // Apply settlement: debtor (from) owes less, creditor (to) is owed less [web:196]
            if (fromId) net.set(fromId, round2((net.get(fromId) || 0) + amt));
            if (toId) net.set(toId, round2((net.get(toId) || 0) - amt));

            ledger.push({
                kind: "settlement",
                date: dateDisp,
                fromId,
                fromName: idToName.get(fromId) || "Member",
                toId,
                toName: idToName.get(toId) || "Member",
                amount: amt,
                note: s.note || "",
                fromNetAfter: net.get(fromId) || 0,
                toNetAfter: net.get(toId) || 0,
            }); // payment line item [web:218]
        }
    }

    // Final net snapshot (used for suggestions and totals) [web:196]
    const nets = {};
    for (const [id, v] of net.entries()) nets[id] = round2(v);

    return { ledger, nets };
} // end buildGroupLedger [web:202]

// Greedy debt simplification for outstanding suggestions
function computeSettlements(expenses, members, recordedSettlements = []) {
    const idToName = new Map(
        members.map((m) => [m._id?.toString?.() || m.id?.toString?.() || "", m.username || m.name || m.email || "Member"])
    ); // names for labels [web:202]

    const net = new Map();
    for (const m of members) {
        const id = m._id?.toString?.() || m.id?.toString?.() || "";
        if (id) net.set(id, 0);
    } // initialize [web:318]

    for (const e of expenses) {
        const paidBy = e.paidBy?.toString?.() || e.paidBy || "";
        const amount = Number(e.amount) || 0;
        if (paidBy) net.set(paidBy, (net.get(paidBy) || 0) + amount);
        const allocations = e.allocations || {};
        for (const [memberId, share] of Object.entries(allocations)) {
            const v = Number(share) || 0;
            net.set(memberId, (net.get(memberId) || 0) - v);
        }
    } // expense nets [web:196]

    // apply recorded settlements
    for (const s of recordedSettlements) {
        const fromId = s.from?.toString?.() || s.from || "";
        const toId = s.to?.toString?.() || s.to || "";
        const amt = Number(s.amount) || 0;
        if (!fromId || !toId || !(amt > 0)) continue;
        net.set(fromId, (net.get(fromId) || 0) + amt);
        net.set(toId, (net.get(toId) || 0) - amt);
    } // payments reduce nets [web:196]

    const creditors = [], debtors = [];
    for (const [id, balance] of net.entries()) {
        const amt = round2(balance);
        if (amt > 0.01) creditors.push({ id, amount: amt });
        else if (amt < -0.01) debtors.push({ id, amount: -amt });
    } // split lists [web:209]

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount); // greedy order [web:196]

    const transfers = [];
    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
        const give = creditors[i], take = debtors[j];
        const amt = round2(Math.min(give.amount, take.amount));
        if (amt > 0) {
            transfers.push({
                fromId: take.id,
                toId: give.id,
                from: (take.id || "").slice(0, 2).toUpperCase(),
                to: (give.id || "").slice(0, 2).toUpperCase(),
                name: `${idToName.get(take.id) || "Member"} owes ${idToName.get(give.id) || "Member"}`,
                amount: amt,
            }); // suggestion [web:209]
            give.amount = round2(give.amount - amt);
            take.amount = round2(take.amount - amt);
        }
        if (give.amount <= 0.01) i++;
        if (take.amount <= 0.01) j++;
    }

    return transfers;
} // end computeSettlements [web:196]

export function buildGroupAnalytics({ group, expenses, members, currentUserId, settlements = [] }) {
    // First create the ledger and nets in chronological order [web:202]
    const { ledger, nets } = buildGroupLedger({ expenses, settlements, members }); // running balances [web:202]

    const totalAmount = round2(expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)); // totals [web:202]
    const totalCount = expenses.length; // count [web:202]

    // Pie breakdown by paidBy [web:202]
    const payerSums = new Map();
    for (const e of expenses) {
        const key = e.paidBy?.toString?.() || e.paidBy || "unknown";
        payerSums.set(key, (payerSums.get(key) || 0) + (Number(e.amount) || 0));
    }
    const idToName = new Map(
        members.map((m) => [m._id?.toString?.() || m.id?.toString?.() || "", m.username || m.name || m.email || "Member"])
    ); // names [web:202]
    const palette = ["#3B82F6", "#F97316", "#8B5CF6", "#22C55E", "#EAB308", "#EF4444", "#06B6D4", "#A855F7"]; // colors [web:155]
    let idx = 0;
    const payers = Array.from(payerSums.entries()).map(([id, amt]) => {
        const name = idToName.get(id) || (id === "unknown" ? "Unknown" : id);
        const pct = totalAmount > 0 ? Math.round((amt / totalAmount) * 100) : 0;
        const color = palette[idx++ % palette.length];
        return { id, name, amount: round2(amt), pct, color };
    }); // pie data [web:155]

    // Timeline by day [web:155]
    const daySums = new Map();
    for (const e of expenses) {
        const key = formatShortDay(e.date || e.createdAt);
        daySums.set(key, (daySums.get(key) || 0) + (Number(e.amount) || 0));
    }
    const timelineData = Array.from(daySums.entries())
        .map(([date, amount]) => ({ date, amount: round2(amount) }))
        .sort((a, b) => {
            const pa = Date.parse(`${a.date}, ${new Date().getFullYear()}`);
            const pb = Date.parse(`${b.date}, ${new Date().getFullYear()}`);
            return (pa || 0) - (pb || 0);
        }); // chronological bars [web:155]

    const maxDay = timelineData.reduce((m, d) => Math.max(m, d.amount), 0); // max for heatmap [web:155]
    const heatmapData = timelineData.map((d) => ({ day: d.date, amount: d.amount, color: colorScaleBlue(d.amount, maxDay) })); // colored cells [web:155]
    const biggest = timelineData.reduce((a, b) => (b.amount > a.amount ? b : a), timelineData[0] || { date: "", amount: 0 }); // peak [web:155]

    const myExpenses = currentUserId
        ? round2(expenses.filter((e) => (e.paidBy?.toString?.() || e.paidBy) === currentUserId)
            .reduce((s, e) => s + (Number(e.amount) || 0), 0))
        : 0; // user slice [web:202]

    const stats = [
        { icon: "💰", label: "My Expenses", value: myExpenses },
        { icon: "📘", label: "Avg per Expense", value: totalCount > 0 ? round2(totalAmount / totalCount) : 0 },
        { icon: "👥", label: "Avg per Person", value: members.length > 0 ? round2(totalAmount / members.length) : 0 },
        { icon: "📅", label: "Biggest Day", value: biggest?.amount || 0, sub: formatLongDay(biggest?.date) || "" },
        { icon: "🧾", label: "Total Expenses", value: totalAmount },
    ]; // headlines [web:155]

    // Suggestions from final nets using greedy simplification [web:196]
    const suggested = computeSettlements(expenses, members, settlements || []);

    return { stats, payers, timelineData, heatmapData, settlements: suggested, ledger, nets };
}
