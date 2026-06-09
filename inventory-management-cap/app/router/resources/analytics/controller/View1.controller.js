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
                <!-- KPI Row -->
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

                <!-- Stock Levels Chart -->
                <div style="background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.15);
                    padding:16px;margin-bottom:16px;box-sizing:border-box;width:100%;">
                    <div style="font-size:14px;font-weight:bold;color:#32363a;font-family:Arial;margin-bottom:12px;">
                        📊 Stock Levels vs Reorder Level
                    </div>
                    <canvas id="stockCanvas" style="width:100%;display:block;"></canvas>
                </div>

                <!-- Material Issue Status -->
                <div style="background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.15);
                    padding:16px;margin-bottom:16px;box-sizing:border-box;width:100%;">
                    <div style="font-size:14px;font-weight:bold;color:#32363a;font-family:Arial;margin-bottom:12px;">
                        🔵 Material Issue Status
                    </div>
                    <canvas id="issueCanvas" style="display:block;"></canvas>
                </div>

                <!-- Purchase Request Status -->
                <div style="background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.15);
                    padding:16px;margin-bottom:16px;box-sizing:border-box;width:100%;">
                    <div style="font-size:14px;font-weight:bold;color:#32363a;font-family:Arial;margin-bottom:12px;">
                        🛒 Purchase Request Status
                    </div>
                    <canvas id="prCanvas" style="display:block;"></canvas>
                </div>

                <!-- Low Stock Alerts -->
                <div style="background:#fff;border-radius:8px;box-shadow:0 1px 4px rgba(0,0,0,0.15);
                    padding:16px;margin-bottom:16px;box-sizing:border-box;width:100%;">
                    <div style="font-size:14px;font-weight:bold;color:#32363a;font-family:Arial;margin-bottom:12px;">
                        🔴 Low Stock Alerts
                    </div>
                    <div id="lowStockTable"></div>
                </div>
            `;

            // Render charts after DOM is ready
            setTimeout(() => {
                this._renderStockChart(materials);
                this._renderDonut("issueCanvas", this._countBy(issues, "issueStatus"));
                this._renderDonut("prCanvas", this._countBy(prs, "requestStatus"));
                this._renderLowStockTable(lowStock);
            }, 100);
        },

        _countBy: function (arr, key) {
            const map = {};
            arr.forEach(i => { const v = i[key] || "Unknown"; map[v] = (map[v] || 0) + 1; });
            return map;
        },

        _renderStockChart: function (materials) {
            const canvas = document.getElementById("stockCanvas");
            if (!canvas) return;
            const parent = canvas.parentElement;
            canvas.width = parent.clientWidth - 32;
            canvas.height = 300;
            const ctx = canvas.getContext("2d");
            const data = materials.slice(0, 8);
            const barGroupWidth = (canvas.width - 60) / data.length;
            const barWidth = barGroupWidth * 0.35;
            const maxVal = Math.max(...data.map(m => Math.max(m.quantity, m.reorderLevel)), 1);
            const chartH = canvas.height - 60;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#f7f7f7";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i <= 4; i++) {
                const y = 10 + (chartH / 4) * i;
                ctx.strokeStyle = "#e0e0e0";
                ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(canvas.width - 10, y); ctx.stroke();
                ctx.fillStyle = "#89919a";
                ctx.font = "10px Arial";
                ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), 5, y + 4);
            }

            data.forEach((m, i) => {
                const x = 50 + i * barGroupWidth + barGroupWidth * 0.1;
                const h1 = (m.quantity / maxVal) * chartH;
                const h2 = (m.reorderLevel / maxVal) * chartH;

                ctx.fillStyle = "#0070f2";
                ctx.fillRect(x, 10 + chartH - h1, barWidth, h1);
                ctx.fillStyle = "#e9730c";
                ctx.fillRect(x + barWidth + 2, 10 + chartH - h2, barWidth, h2);

                const name = m.materialName ? m.materialName.substring(0, 7) : "";
                ctx.fillStyle = "#32363a";
                ctx.font = "10px Arial";
                ctx.save();
                ctx.translate(x + barWidth, canvas.height - 5);
                ctx.rotate(-0.4);
                ctx.fillText(name, 0, 0);
                ctx.restore();
            });

            ctx.fillStyle = "#0070f2";
            ctx.fillRect(canvas.width - 160, 10, 12, 12);
            ctx.fillStyle = "#32363a";
            ctx.font = "11px Arial";
            ctx.fillText("Current Stock", canvas.width - 144, 21);
            ctx.fillStyle = "#e9730c";
            ctx.fillRect(canvas.width - 160, 28, 12, 12);
            ctx.fillStyle = "#32363a";
            ctx.fillText("Reorder Level", canvas.width - 144, 39);
        },

        _renderDonut: function (canvasId, dataMap) {
            const canvas = document.getElementById(canvasId);
            if (!canvas) return;
            const parent = canvas.parentElement;
            const size = Math.min(parent.clientWidth - 32, 260);
            canvas.width = size;
            canvas.height = size + 100;
            const ctx = canvas.getContext("2d");
            const colors = ["#0070f2", "#e9730c", "#107e3e", "#6a6d70", "#c0392b"];
            const entries = Object.entries(dataMap);
            const total = entries.reduce((s, [, v]) => s + v, 0);
            if (total === 0) return;

            let startAngle = -Math.PI / 2;
            const cx = size / 2;
            const cy = size * 0.42;
            const r = size * 0.30;
            const inner = size * 0.18;

            entries.forEach(([label, val], i) => {
                const slice = (val / total) * 2 * Math.PI;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.arc(cx, cy, r, startAngle, startAngle + slice);
                ctx.closePath();
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();
                ctx.strokeStyle = "#fff";
                ctx.lineWidth = 2;
                ctx.stroke();
                startAngle += slice;
            });

            ctx.beginPath();
            ctx.arc(cx, cy, inner, 0, 2 * Math.PI);
            ctx.fillStyle = "#fff";
            ctx.fill();

            ctx.fillStyle = "#32363a";
            ctx.font = `bold ${size * 0.1}px Arial`;
            ctx.textAlign = "center";
            ctx.fillText(total, cx, cy + size * 0.04);
            ctx.font = `${size * 0.07}px Arial`;
            ctx.fillStyle = "#89919a";
            ctx.fillText("Total", cx, cy + size * 0.12);

            let legendY = size - 20;
            entries.forEach(([label, val], i) => {
                const lx = 10, ly = legendY + i * 18;
                ctx.fillStyle = colors[i % colors.length];
                ctx.fillRect(lx, ly, 10, 10);
                ctx.fillStyle = "#32363a";
                ctx.font = "10px Arial";
                ctx.textAlign = "left";
                ctx.fillText(`${label}: ${val}`, lx + 14, ly + 9);
            });
        },

        _renderLowStockTable: function (items) {
            const div = document.getElementById("lowStockTable");
            if (!div) return;
            if (items.length === 0) {
                div.innerHTML = '<p style="color:#107e3e;font-family:Arial;font-size:13px;">✅ No low stock items!</p>';
                return;
            }
            div.innerHTML = `
                <table style="width:100%;border-collapse:collapse;font-family:Arial;font-size:12px;">
                    <thead>
                        <tr style="background:#f5f6f7;">
                            <th style="padding:8px;text-align:left;border-bottom:2px solid #e0e0e0;color:#32363a;">Material</th>
                            <th style="padding:8px;text-align:left;border-bottom:2px solid #e0e0e0;color:#32363a;">Code</th>
                            <th style="padding:8px;text-align:right;border-bottom:2px solid #e0e0e0;color:#32363a;">Stock</th>
                            <th style="padding:8px;text-align:right;border-bottom:2px solid #e0e0e0;color:#32363a;">Reorder</th>
                            <th style="padding:8px;text-align:left;border-bottom:2px solid #e0e0e0;color:#32363a;">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map((m, i) => `
                            <tr style="background:${i % 2 === 0 ? "#fff" : "#fafafa"};">
                                <td style="padding:8px;border-bottom:1px solid #e0e0e0;">${m.materialName || ""}</td>
                                <td style="padding:8px;border-bottom:1px solid #e0e0e0;">${m.materialCode || ""}</td>
                                <td style="padding:8px;text-align:right;border-bottom:1px solid #e0e0e0;color:#bb0000;font-weight:bold;">${m.quantity}</td>
                                <td style="padding:8px;text-align:right;border-bottom:1px solid #e0e0e0;">${m.reorderLevel}</td>
                                <td style="padding:8px;border-bottom:1px solid #e0e0e0;">${m.location || ""}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            `;
        }
    });
});