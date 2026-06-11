sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.inventorymanagement.analyticsui.controller.View1", {

        onInit: function () {
            this._loadData();
        },

        _loadData: function () {
            const base = "/odata/v4/inventory";
            Promise.all([
                fetch(`${base}/MaterialMaster?$filter=IsActiveEntity eq true&$select=materialName,materialCode,quantity,reorderLevel,location,status`).then(r => r.json()),
                fetch(`${base}/MaterialIssue?$filter=IsActiveEntity eq true&$select=issueStatus`).then(r => r.json()),
                fetch(`${base}/PurchaseRequest?$filter=IsActiveEntity eq true&$select=requestStatus`).then(r => r.json())
            ]).then(([matData, issueData, prData]) => {
                const materials = matData.value || [];
                const issues = issueData.value || [];
                const prs = prData.value || [];
                const lowStock = materials.filter(m => m.quantity <= m.reorderLevel);
                this._buildLayout(materials, issues, prs, lowStock);
            });
        },

        _buildLayout: function (materials, issues, prs, lowStock) {
            const root = document.getElementById("dashboardRoot");
            if (!root) return;

            const issueMap = this._countBy(issues, "issueStatus");
            const prMap = this._countBy(prs, "requestStatus");

            const kpis = [
                { label: "Total Materials", sub: "In Master", value: materials.length, color: "#0070f2", icon: "📦" },
                { label: "Low Stock Alerts", sub: "Below Reorder Level", value: lowStock.length, color: "#e9730c", icon: "⚠️" },
                { label: "Pending Issues", sub: "Awaiting Approval", value: issueMap["Pending"] || 0, color: "#e9730c", icon: "🕐" },
                { label: "Pending Purchases", sub: "Purchase Requests", value: prMap["Pending"] || 0, color: "#e9730c", icon: "🛒" },
                { label: "Approved Issues", sub: "This Period", value: issueMap["Approved"] || 0, color: "#107e3e", icon: "✅" }
            ];

            root.innerHTML = `
                <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
                    ${kpis.map(k => `
                        <div style="flex:1;min-width:160px;background:#fff;border-radius:8px;
                            box-shadow:0 1px 4px rgba(0,0,0,0.15);padding:20px;box-sizing:border-box;">
                            <div style="font-size:12px;color:#6a6d70;font-family:Arial;">${k.icon} ${k.label}</div>
                            <div style="font-size:11px;color:#89919a;font-family:Arial;margin-bottom:8px;">${k.sub}</div>
                            <div style="font-size:36px;font-weight:bold;color:${k.color};font-family:Arial;">${k.value}</div>
                        </div>
                    `).join("")}
                </div>

                <div style="background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.15);padding:16px;margin-bottom:16px;">
                    <div style="font-size:14px;font-weight:bold;color:#32363a;font-family:Arial;margin-bottom:12px;">📊 Stock Levels vs Reorder Level</div>
                    <canvas id="stockCanvas" style="display:block;width:100%;"></canvas>
                </div>

                <div style="display:flex;gap:16px;margin-bottom:16px;">
                    <div style="flex:1;background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.15);padding:16px;">
                        <div style="font-size:14px;font-weight:bold;color:#32363a;font-family:Arial;margin-bottom:12px;">🔵 Material Issue Status</div>
                        <canvas id="issueCanvas" style="display:block;margin:0 auto;"></canvas>
                    </div>
                    <div style="flex:1;background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.15);padding:16px;">
                        <div style="font-size:14px;font-weight:bold;color:#32363a;font-family:Arial;margin-bottom:12px;">🛒 Purchase Request Status</div>
                        <canvas id="prCanvas" style="display:block;margin:0 auto;"></canvas>
                    </div>
                </div>

                <div style="background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.15);padding:16px;margin-bottom:16px;">
                    <div style="font-size:14px;font-weight:bold;color:#32363a;font-family:Arial;margin-bottom:12px;">🔴 Low Stock Alerts</div>
                    <div id="lowStockTable"></div>
                </div>
            `;

            setTimeout(() => {
                this._renderStockChart(materials);
                this._renderDonut("issueCanvas", issueMap);
                this._renderDonut("prCanvas", prMap);
                this._renderLowStockTable(lowStock);
            }, 200);
        },

        _countBy: function (arr, key) {
            const map = {};
            arr.forEach(i => { const v = i[key] || "Unknown"; map[v] = (map[v] || 0) + 1; });
            return map;
        },

        _renderStockChart: function (materials) {
            const canvas = document.getElementById("stockCanvas");
            if (!canvas) return;
            const W = canvas.parentElement.clientWidth - 32;
            const H = 300;
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext("2d");
            const data = materials.slice(0, 8);
            if (!data.length) return;
            const pad = { l: 55, r: 170, t: 20, b: 50 };
            const cW = W - pad.l - pad.r;
            const cH = H - pad.t - pad.b;
            const maxVal = Math.max(...data.map(m => Math.max(m.quantity || 0, m.reorderLevel || 0)), 1);
            const grpW = cW / data.length;
            const bW = grpW * 0.3;

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, W, H);

            // Grid
            for (let i = 0; i <= 4; i++) {
                const y = pad.t + (cH / 4) * i;
                ctx.strokeStyle = "#e8e8e8";
                ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
                ctx.fillStyle = "#89919a"; ctx.font = "11px Arial"; ctx.textAlign = "right";
                ctx.fillText(Math.round(maxVal * (1 - i / 4)), pad.l - 5, y + 4);
            }

            data.forEach((m, i) => {
                const x = pad.l + i * grpW + grpW * 0.15;
                const h1 = ((m.quantity || 0) / maxVal) * cH;
                const h2 = ((m.reorderLevel || 0) / maxVal) * cH;

                ctx.fillStyle = "#0070f2";
                ctx.fillRect(x, pad.t + cH - h1, bW, h1);
                ctx.fillStyle = "#e9730c";
                ctx.fillRect(x + bW + 3, pad.t + cH - h2, bW, h2);

                ctx.save();
                ctx.translate(x + bW, pad.t + cH + 8);
                ctx.rotate(-0.5);
                ctx.fillStyle = "#32363a"; ctx.font = "10px Arial"; ctx.textAlign = "right";
                ctx.fillText((m.materialName || "").substring(0, 8), 0, 0);
                ctx.restore();
            });

            // Legend
            const lx = W - pad.r + 10;
            ctx.fillStyle = "#0070f2"; ctx.fillRect(lx, pad.t, 12, 12);
            ctx.fillStyle = "#32363a"; ctx.font = "11px Arial"; ctx.textAlign = "left";
            ctx.fillText("Current Stock", lx + 16, pad.t + 10);
            ctx.fillStyle = "#e9730c"; ctx.fillRect(lx, pad.t + 20, 12, 12);
            ctx.fillStyle = "#32363a";
            ctx.fillText("Reorder Level", lx + 16, pad.t + 30);
        },

        _renderDonut: function (canvasId, dataMap) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const size = 240;
            canvas.width = size;
            canvas.height = size + 20 + Object.keys(dataMap).length * 18;
            const ctx = canvas.getContext("2d");
            const colors = ["#0070f2", "#e9730c", "#107e3e", "#6a6d70", "#c0392b"];
            const entries = Object.entries(dataMap);
            const total = entries.reduce((s, [, v]) => s + v, 0);
            if (!total) {
                ctx.fillStyle = "#89919a"; ctx.font = "13px Arial"; ctx.textAlign = "center";
                ctx.fillText("No data", size / 2, size / 2);
                return;
            }

            const cx = size / 2, cy = size / 2 - 10;
            const r = 80, inner = 45;
            let angle = -Math.PI / 2;

            entries.forEach(([, val], i) => {
                const slice = (val / total) * 2 * Math.PI;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, angle, angle + slice);
                ctx.closePath();
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();
                ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
                angle += slice;
            });

            ctx.beginPath();
            ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
            ctx.fillStyle = "#fff"; ctx.fill();

            ctx.fillStyle = "#32363a"; ctx.font = "bold 20px Arial"; ctx.textAlign = "center";
            ctx.fillText(total, cx, cy + 7);
            ctx.fillStyle = "#89919a"; ctx.font = "11px Arial";
            ctx.fillText("Total", cx, cy + 22);

            entries.forEach(([label, val], i) => {
                const ly = size - 5 + i * 18;
                ctx.fillStyle = colors[i % colors.length];
                ctx.fillRect(0, ly, 10, 10);
                ctx.fillStyle = "#32363a"; ctx.font = "10px Arial"; ctx.textAlign = "left";
                ctx.fillText(`${label}: ${val}`, 14, ly + 9);
            });
        },

        _renderLowStockTable: function (items) {
            const div = document.getElementById("lowStockTable");
            if (!div) return;
            if (!items.length) {
                div.innerHTML = '<p style="color:#107e3e;font-family:Arial;">✅ No low stock items!</p>';
                return;
            }
            div.innerHTML = `
                <table style="width:100%;border-collapse:collapse;font-family:Arial;font-size:13px;">
                    <thead>
                        <tr style="background:#f5f6f7;border-bottom:2px solid #d9d9d9;">
                            <th style="padding:10px;text-align:left;">Material</th>
                            <th style="padding:10px;text-align:left;">Code</th>
                            <th style="padding:10px;text-align:center;">Stock</th>
                            <th style="padding:10px;text-align:center;">Reorder</th>
                            <th style="padding:10px;text-align:left;">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((m, i) => `
                            <tr style="background:${i % 2 === 0 ? "#fff" : "#fafafa"};border-bottom:1px solid #ebebeb;">
                                <td style="padding:10px;">${m.materialName || ""}</td>
                                <td style="padding:10px;">${m.materialCode || ""}</td>
                                <td style="padding:10px;text-align:center;color:#bb0000;font-weight:bold;">${m.quantity}</td>
                                <td style="padding:10px;text-align:center;">${m.reorderLevel}</td>
                                <td style="padding:10px;">${m.location || ""}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>`;
        }
    });
});
