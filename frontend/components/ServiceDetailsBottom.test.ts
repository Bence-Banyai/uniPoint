import { mount } from "@vue/test-utils";
import ServiceDetailsBottom from "../ServiceDetailsBottom.vue";
import { describe, it, expect } from "vitest";

const mockService = {
	serviceId: 1,
	description: "Test service description",
	duration: 60,
	price: 10000,
	opensAt: "08:00:00",
	closesAt: "17:00:00",
	address: "123 Test St",
	categoryId: 1,
};

describe("ServiceDetailsBottom", () => {
	it("renders service description and details", () => {
		const wrapper = mount(ServiceDetailsBottom, {
			props: { service: mockService },
			global: {
				stubs: ["Icon"],
				mocks: {
					$router: { push: () => {} },
				},
			},
		});
		expect(wrapper.text()).toContain("Test service description");
		expect(wrapper.text()).toContain("Duration: 60 minutes");
		expect(wrapper.text()).toContain("Price:");
		expect(wrapper.text()).toContain("Opening hours: 08:00 - 17:00");
		expect(wrapper.text()).toContain("123 Test St");
	});
});
