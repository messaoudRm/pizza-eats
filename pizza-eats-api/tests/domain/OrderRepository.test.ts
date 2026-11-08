import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryOrderRepository } from "../../src/infrastructure/repositories/InMemoryOrderRepository";
import { Order } from "../../src/domain/entities/Order";
import { OrderStatus } from "../../src/domain/entities/OrderStatus";

describe("OrderRepository", () => {
    let repository: InMemoryOrderRepository;

    beforeEach(() => {
        repository = new InMemoryOrderRepository();
    });

    it("should save an order", () => {
        const order = new Order("1", OrderStatus.CONFIRMED, "alice@test.com");

        repository.save(order);

        expect(repository.findByCustomerEmail("alice@test.com")).toHaveLength(1);
    });

    it("should return only orders belonging to a customer", () => {
        repository.save(new Order("1", OrderStatus.CONFIRMED, "alice@test.com"));
        repository.save(new Order("2", OrderStatus.DELIVERED, "bob@test.com"));

        const orders = repository.findByCustomerEmail("alice@test.com");

        expect(orders).toHaveLength(1);
        expect(orders[0].id).toBe("1");
    });

    it("should filter orders by customer and status", () => {
        repository.save(new Order("1", OrderStatus.DELIVERED, "alice@test.com"));
        repository.save(new Order("2", OrderStatus.CANCELLED, "alice@test.com"));

        const orders = repository.findByStatus(
            "alice@test.com",
            OrderStatus.DELIVERED,
        );

        expect(orders).toHaveLength(1);
        expect(orders[0].getStatus()).toBe(OrderStatus.DELIVERED);
    });

    it("should update an existing order instead of duplicating it", () => {
        const order = new Order("1", OrderStatus.CONFIRMED, "alice@test.com");
        repository.save(order);

        order.updateStatus(OrderStatus.DELIVERED);
        repository.save(order);

        const orders = repository.findByCustomerEmail("alice@test.com");

        expect(orders).toHaveLength(1);
        expect(orders[0].getStatus()).toBe(OrderStatus.DELIVERED);
    });

    it("should return an empty array when no order exists for the customer", () => {
        const orders = repository.findByCustomerEmail("unknown@test.com");

        expect(orders).toHaveLength(0);
    });
});
