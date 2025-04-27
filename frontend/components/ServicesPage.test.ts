import { mount } from "@vue/test-utils";
import ServicesPage from "../pages/services/index.vue";
import { describe, it, vi, beforeEach, expect } from "vitest";

// Stub definePageMeta globally for Nuxt macro
vi.stubGlobal("definePageMeta", () => {});

const mockServices = [
	{
		serviceId: 1,
		serviceName: "Test Service 1",
		description: "A test service",
		address: "123 Main St",
		price: 100,
		categoryId: 1,
	},
	{
		serviceId: 2,
		serviceName: "Test Service 2",
		description: "Another test service",
		address: "456 Side St",
		price: 200,
		categoryId: 2,
	},
];
const mockCategories = [
	{ categoryId: 1, name: "Category 1" },
	{ categoryId: 2, name: "Category 2" },
];

// Default mock for serviceApi
const getAllServices = vi.fn().mockResolvedValue(mockServices);
const getAllCategories = vi.fn().mockResolvedValue(mockCategories);

vi.mock("../../services/serviceApi", () => ({
	serviceApi: {
		getAllServices,
		getAllCategories,
	},
}));

describe("ServicesPage", () => {
	// Reset error mock before each test
	beforeEach(() => {
		getAllServices.mockReset();
		getAllCategories.mockReset();
		getAllServices.mockResolvedValue(mockServices);
		getAllCategories.mockResolvedValue(mockCategories);
		vi.clearAllMocks();
	});

	it("shows error if fetch fails", async () => {
		getAllServices.mockRejectedValueOnce(new Error("fail"));
		const wrapper = mount(ServicesPage, {
			global: {
				stubs: {
					ServiceCard: {
						props: ["service"],
						template: "<div>{{ service.serviceName }}</div>",
					},
					Pagination: true,
					Icon: true,
				},
			},
		});
		await new Promise((r) => setTimeout(r, 0));
		await wrapper.vm.$nextTick();
		expect(wrapper.text()).toContain("Failed to load services");
	});
});
