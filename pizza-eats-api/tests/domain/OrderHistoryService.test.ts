import { describe, it, expect, beforeEach } from "vitest";
import { OrderHistoryService } from "../../src/application/services/OrderHistoryService";
import { InMemoryOrderRepository } from "../../src/infrastructure/repositories/InMemoryOrderRepository";
import { Order } from "../../src/domain/entities/Order";
import { OrderStatus } from "../../src/domain/entities/OrderStatus";

describe("OrderHistoryService", () => {
    let repository: InMemoryOrderRepository;
    let service: OrderHistoryService;

    beforeEach(() => {
        repository = new InMemoryOrderRepository();
        service = new OrderHistoryService(repository);
    });

    it("should return orders sorted by date, newest first", () => {
        repository.save(new Order(
            "1",
            OrderStatus.DELIVERED,
            "alice@test.com",
            new Date("2026-01-01"),
        ));

        repository.save(new Order(
            "2",
            OrderStatus.CONFIRMED,
            "alice@test.com",
            new Date("2026-02-01"),
        ));

        const orders = service.getOrderHistory("alice@test.com");

        expect(orders).toHaveLength(2);
        expect(orders[0].id).toBe("2");
        expect(orders[1].id).toBe("1");
    });

    it("should return only orders belonging to the customer", () => {
        repository.save(new Order("1", OrderStatus.CONFIRMED, "alice@test.com"));
        repository.save(new Order("2", OrderStatus.DELIVERED, "bob@test.com"));

        const orders = service.getOrderHistory("alice@test.com");

        expect(orders).toHaveLength(1);
        expect(orders[0].customerEmail).toBe("alice@test.com");
    });

    it("should filter orders by status", () => {
        repository.save(new Order("1", OrderStatus.DELIVERED, "alice@test.com"));
        repository.save(new Order("2", OrderStatus.CANCELLED, "alice@test.com"));

        const orders = service.getOrderHistory(
            "alice@test.com",
            OrderStatus.DELIVERED,
        );

        expect(orders).toHaveLength(1);
        expect(orders[0].getStatus()).toBe(OrderStatus.DELIVERED);
    });

    it("should return an empty array when the customer has no orders", () => {
        const orders = service.getOrderHistory("unknown@test.com");

        expect(orders).toHaveLength(0);
    });

    it("should return an empty array when no order matches the status", () => {
        repository.save(new Order("1", OrderStatus.CONFIRMED, "alice@test.com"));

        const orders = service.getOrderHistory(
            "alice@test.com",
            OrderStatus.CANCELLED,
        );

        expect(orders).toHaveLength(0);
    });
});
