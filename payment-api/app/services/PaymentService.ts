import { PaymentDTO } from "#DTOs/PaymentDTO";
import Gateway from "#models/gateway";
import { IPaymentGateway } from "#Interfaces/IPaymentGateway";
import { Gateway1Strategy } from "./gateways/Gateway1Strategy.js";
import { Gateway2Strategy } from "./gateways/Gateway2Strategy.js";
import Transaction from "#models/transaction";

export class PaymentService {
    private strategyMap: Record<string, IPaymentGateway> = {
        'Gateway 1': new Gateway1Strategy(),
        'Gateway 2': new Gateway2Strategy(),
    }

    async getActiveGateways(): Promise<Gateway[]> {
        return await Gateway.query().where('is_active', true).orderBy('priority', 'asc')
    }

    async processPayment(paymentData: PaymentDTO) {
        const gateways = await this.getActiveGateways();

        for (const gateway of gateways) {
            const strategyInstance = this.strategyMap[gateway.name];

            if (!strategyInstance) {
                console.warn(`Strategy for gateway "${gateway.name}" not implemented.`);
                continue;
            }

            try {
                const result = await strategyInstance.processPayment(paymentData);
                
                if (result.success === true) {
                    result.gatewayId = gateway.gatewayId;
                    return result;
                } 
                
                if (result.success === false && result.errorMessage === "Invalid card") {
                    throw new Error("Invalid card");
                }
            } catch (error) {
                console.error(`Error processing payment on ${gateway.name}:`, error instanceof Error ? error.message : error);
            }
        }
        throw new Error("All payment gateways failed");
    }

   async refund(transaction: Transaction) {
        await transaction.load('gateway')

        if (!transaction.externalId) {
            return { 
                success: false, 
                errorMessage: 'This transaction does not have an external reference for refund.' 
            }
        }

        const gatewayName = transaction.gateway.name
        const strategy = this.strategyMap[gatewayName]

        if (!strategy) {
            throw new Error(`Payment strategy for ${gatewayName} not found.`)
        }

        try {
            const result = await strategy.processRefund(transaction.externalId)
            return result
        } catch (error) {
            console.error(`Error processing refund on ${gatewayName}:`, error instanceof Error ? error.message : error)
            return {
                success: false,
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }
}