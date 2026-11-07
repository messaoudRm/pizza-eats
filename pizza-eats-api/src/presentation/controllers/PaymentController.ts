import { PaymentService } from "../../application/services/PaymentService";

export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    pay(
        method: string,
        amount: number,
    ): { success: boolean; message: string } {
        return this.paymentService.pay(method, amount);
    }
}