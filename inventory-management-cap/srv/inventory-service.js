const cds = require('@sap/cds')

module.exports = class InventoryService extends cds.ApplicationService {

    async init() {
        const { MaterialMaster, MaterialIssue, PurchaseRequest, GoodsReceipt } = this.entities

        // CAP v9 - Draft activate event
        this.before('SAVE', MaterialIssue, async (req) => {
            const data = req.data
            if (data.issueStatus === 'Approved') {
                await this._processIssueApproval(data, req)
            }
        })

        this.before('SAVE', GoodsReceipt, async (req) => {
            const data = req.data
            if (data.receivedQuantity) {
                await this._processGoodsReceipt(data, req)
            }
        })

        await super.init()
    }

    async _processIssueApproval(data, req) {
        const { MaterialMaster, MaterialIssue, PurchaseRequest } = this.entities

        if (!data.material_ID || !data.requestedQuantity) return

        const material = await SELECT.one.from(MaterialMaster).where({ ID: data.material_ID })
        if (!material) return

        if (material.quantity >= data.requestedQuantity) {
            const newQty = material.quantity - data.requestedQuantity
            await UPDATE(MaterialMaster)
                .set({ quantity: newQty })
                .where({ ID: material.ID })
            req.info(`✅ Stock updated: ${material.materialName} ${material.quantity} → ${newQty}`)
        } else {
            req.data.issueStatus = 'Rejected'
            req.data.remarks = `Insufficient stock. Available: ${material.quantity}, Requested: ${data.requestedQuantity}. Auto Purchase Request created.`

            await INSERT.into(PurchaseRequest).entries({
                material_ID: material.ID,
                requestedQuantity: data.requestedQuantity - material.quantity,
                requestStatus: 'Pending',
                remarks: `Auto-created: Insufficient stock. Available: ${material.quantity}, Required: ${data.requestedQuantity}`
            })
            req.warn(`⚠️ Insufficient stock! Auto Purchase Request created for ${material.materialName}`)
        }

        const updated = await SELECT.one.from(MaterialMaster).where({ ID: material.ID })
        if (updated && updated.quantity <= updated.reorderLevel) {

            req.warn(
                `⚠️ Reorder Alert: ${material.materialName} at reorder level!`
            )

            const existingPR = await SELECT.one
                .from(PurchaseRequest)
                .where({
                    material_ID: material.ID,
                    requestStatus: 'Pending'
                })

            if (!existingPR) {

                await INSERT.into(PurchaseRequest).entries({
                    material_ID: material.ID,
                    requestedQuantity:
                        (updated.reorderLevel * 2) - updated.quantity,
                    requestStatus: 'Pending',
                    remarks: 'Auto-created due to low stock'
                })

                req.info(
                    `✅ Purchase Request auto-generated for ${material.materialName}`
                )
            }
        }
    }

    async _processGoodsReceipt(data, req) {
        const { MaterialMaster, PurchaseRequest } = this.entities

        if (!data.purchaseRequest_ID || !data.receivedQuantity) return

        const pr = await SELECT.one.from(PurchaseRequest).where({ ID: data.purchaseRequest_ID })
        if (!pr || !pr.material_ID) return

        const material = await SELECT.one.from(MaterialMaster).where({ ID: pr.material_ID })
        if (!material) return

        const newQty = material.quantity + data.receivedQuantity
        await UPDATE(MaterialMaster)
            .set({ quantity: newQty })
            .where({ ID: material.ID })

        await UPDATE(PurchaseRequest)
            .set({ requestStatus: 'Completed' })
            .where({ ID: pr.ID })

        req.info(`✅ Goods received! ${material.materialName} ${material.quantity} → ${newQty}`)
    }
}
