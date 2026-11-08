
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock EmailJS : aucun vrai email ne sera envoyé pendant les tests.
vi.mock("@emailjs/nodejs", () => ({
    default: {
        send: vi.fn().mockResolvedValue({ status: 200, text: "OK" }),
    },
}));

import emailjs from "@emailjs/nodejs";
import { Order } from "../../src/domain/entities/Order";
import { OrderStatus } from "../../src/domain/entities/OrderStatus";
import { OrderSubject } from "../../src/domain/notifications/OrderSubject";
import { EmailNotificationListener } from "../../src/domain/notifications/listeners/EmailNotificationListener";
import { SMSNotificationListener } from "../../src/domain/notifications/listeners/SMSNotificationListener";
import { PushNotificationListener } from "../../src/domain/notifications/listeners/PushNotificationListener";
import { OrderNotificationService } from "../../src/application/services/OrderNotificationService";

describe("Order notifications - Observer pattern", () => {
    let order: Order;
    let subject: OrderSubject;
    let service: OrderNotificationService;

    const customerEmail = "client@gmail.com";

    beforeEach(() => {
        order = new Order("order-1", OrderStatus.CONFIRMED, customerEmail);
        subject = new OrderSubject();
        service = new OrderNotificationService();

        process.env.EMAILJS_SERVICE_ID = "service_test";
        process.env.EMAILJS_TEMPLATE_ID = "template_test";
        process.env.EMAILJS_PUBLIC_KEY = "public_test";
        process.env.EMAILJS_PRIVATE_KEY = "private_test";

        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should notify the email listener when order status changes", async () => {
        const listener = new EmailNotificationListener();

        subject.subscribe(listener);

        await service.updateStatus(order, OrderStatus.PREPARING, subject, customerEmail);

        expect(emailjs.send).toHaveBeenCalledWith(
            "service_test",
            "template_test",
            {
                to_email: customerEmail,
                order_id: "order-1",
                order_status: OrderStatus.PREPARING,
            },
            {
                publicKey: "public_test",
                privateKey: "private_test",
            },
        );
    });

    it("should notify the SMS listener when order status changes", async () => {
        const listener = new SMSNotificationListener();
        const consoleSpy = vi.spyOn(console, "log");

        subject.subscribe(listener);

        await service.updateStatus(order, OrderStatus.PREPARING, subject, customerEmail);

        expect(consoleSpy).toHaveBeenCalledWith(
            "[SMS] Message envoyé : commande order-1, nouveau statut : PREPARING",
        );
    });

    it("should notify the push listener when order status changes", async () => {
        const listener = new PushNotificationListener();
        const consoleSpy = vi.spyOn(console, "log");

        subject.subscribe(listener);

        await service.updateStatus(order, OrderStatus.PREPARING, subject, customerEmail);

        expect(consoleSpy).toHaveBeenCalledWith(
            "[Push] Notification push envoyée : commande order-1, nouveau statut : PREPARING",
        );
    });

    it("should notify all active listeners", async () => {
        const consoleSpy = vi.spyOn(console, "log");

        subject.subscribe(new EmailNotificationListener());
        subject.subscribe(new SMSNotificationListener());
        subject.subscribe(new PushNotificationListener());

        await service.updateStatus(order, OrderStatus.PREPARING, subject, customerEmail);

        expect(emailjs.send).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledTimes(3);
    });

    it("should not notify an unsubscribed listener", async () => {
        const listener = new EmailNotificationListener();

        subject.subscribe(listener);
        subject.unsubscribe(listener);

        await service.updateStatus(order, OrderStatus.PREPARING, subject, customerEmail);

        expect(emailjs.send).not.toHaveBeenCalled();
    });

    it("should not notify listeners when the status does not change", async () => {
        subject.subscribe(new EmailNotificationListener());

        await service.updateStatus(order, OrderStatus.CONFIRMED, subject, customerEmail);

        expect(emailjs.send).not.toHaveBeenCalled();
    });

    it("should update the order status", async () => {
        await service.updateStatus(order, OrderStatus.PREPARING, subject, customerEmail);

        expect(order.getStatus()).toBe(OrderStatus.PREPARING);
    });

    it("should notify listeners for all four order statuses", async () => {
        subject.subscribe(new EmailNotificationListener());

        const statuses = [
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.OUT_FOR_DELIVERY,
            OrderStatus.DELIVERED,
        ];

        for (const status of statuses) {
            await service.updateStatus(order, status, subject, customerEmail);
        }

        expect(emailjs.send).toHaveBeenCalledTimes(3);

        expect(emailjs.send).toHaveBeenNthCalledWith(
            1,
            "service_test",
            "template_test",
            {
                to_email: customerEmail,
                order_id: "order-1",
                order_status: OrderStatus.PREPARING,
            },
            {
                publicKey: "public_test",
                privateKey: "private_test",
            },
        );

        expect(emailjs.send).toHaveBeenNthCalledWith(
            2,
            "service_test",
            "template_test",
            {
                to_email: customerEmail,
                order_id: "order-1",
                order_status: OrderStatus.OUT_FOR_DELIVERY,
            },
            {
                publicKey: "public_test",
                privateKey: "private_test",
            },
        );

        expect(emailjs.send).toHaveBeenNthCalledWith(
            3,
            "service_test",
            "template_test",
            {
                to_email: customerEmail,
                order_id: "order-1",
                order_status: OrderStatus.DELIVERED,
            },
            {
                publicKey: "public_test",
                privateKey: "private_test",
            },
        );

        expect(order.getStatus()).toBe(OrderStatus.DELIVERED);
    });
});
