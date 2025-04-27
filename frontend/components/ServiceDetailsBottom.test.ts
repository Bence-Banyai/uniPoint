import { mount } from "@vue/test-utils";
import ServiceDetailsBottom from "./ServiceDetailsBottom.vue";
import { describe, it, expect, vi } from "vitest";

vi.mock("vue-router", () => ({
	useRouter: () => ({
		push: vi.fn(),
		currentRoute: { value: { fullPath: "/" } },
	}),
}));

vi.mock("../stores/auth", () => ({
	useAuthStore: () => ({
		isAuthenticated: false,
		userId: "1",
		getUserInfo: vi.fn(),
	}),
}));

vi.mock("../composables/useAppointmentsApi", () => ({
	__esModule: true,
	default: () => ({
		getOpen: vi.fn().mockResolvedValue([]),
		book: vi.fn().mockResolvedValue({ data: { message: "Appointment booked successfully!" } }),
	}),
}));

vi.mock("../composables/useReviewsApi", () => ({
	__esModule: true,
	default: () => ({
		getAll: vi.fn().mockResolvedValue([]),
		create: vi.fn().mockResolvedValue({}),
	}),
}));

vi.mock("../services/serviceApi", () => ({
	serviceApi: {
		getServicesByCategory: vi.fn().mockResolvedValue([]),
	},
}));

const mockService = {
	serviceId: 1,
	userId: "1",
	serviceName: "Test Service",
	description: "Test service description",
	duration: 60,
	price: 10000,
	opensAt: "08:00:00",
	closesAt: "17:00:00",
	address: "123 Test St",
	categoryId: 1,
};

describe("ServiceDetailsBottom", () => {
	it("renders static service details", () => {
		const wrapper = mount(ServiceDetailsBottom, {
			props: { service: mockService },
			global: {
				stubs: ["Icon"],
			},
		});
		expect(wrapper.text()).toContain("Test service description");
		expect(wrapper.text()).toContain("Duration: 60 minutes");
		expect(wrapper.text()).toContain("Price:");
		expect(wrapper.text()).toContain("Opening hours: 08:00 - 17:00");
		expect(wrapper.text()).toContain("123 Test St");
	});
});
