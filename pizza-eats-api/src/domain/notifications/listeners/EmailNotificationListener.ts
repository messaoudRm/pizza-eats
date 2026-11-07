
import emailjs from "@emailjs/nodejs";
import { OrderObserver } from "../OrderObserver";
import { OrderStatus } from "../../entities/OrderStatus";

export class EmailNotificationListener implements OrderObserver {
    async update(
        orderId: string,
        status: OrderStatus,
        customerEmail: string,
    ): Promise<void> {
        const serviceId = process.env.EMAILJS_SERVICE_ID;
        const templateId = process.env.EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.EMAILJS_PUBLIC_KEY;
        const privateKey = process.env.EMAILJS_PRIVATE_KEY;

        if (!serviceId || !templateId || !publicKey || !privateKey) {
            throw new Error("Configuration EmailJS incomplète dans le fichier .env");
        }

        if (!customerEmail) {
            throw new Error("L'adresse email du client est obligatoire.");
        }

        await emailjs.send(
            serviceId,
            templateId,
            {
                to_email: customerEmail,
                order_id: orderId,
                order_status: status,
            },
            {
                publicKey,
                privateKey,
            },
        );

        console.log(`[Email] Notification envoyée à ${customerEmail}`);
    }
}
