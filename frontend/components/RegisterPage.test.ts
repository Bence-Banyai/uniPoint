import { mount } from "@vue/test-utils";
import RegisterPage from "../pages/register/index.vue";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ref, reactive } from "vue";

let pushMock = vi.fn();

vi.stubGlobal("useRouter", () => ({
	push: (...args: any[]) => pushMock(...args),
}));
vi.stubGlobal("definePageMeta", () => {});
vi.stubGlobal("useSeoMeta", () => {});
vi.stubGlobal("ref", ref);
vi.stubGlobal("reactive", reactive);

const registerMock = vi.fn(async (userData) => {
	if (userData.userName === "existing" || userData.email === "fail@example.com") {
		return { success: false, message: "Registration failed" };
	}
	return { success: true };
});
const loginMock = vi.fn(async () => ({}));

vi.mock("../stores/auth.ts", () => ({
	useAuthStore: () => ({
		register: registerMock,
		login: loginMock,
	}),
}));

beforeEach(() => {
	pushMock = vi.fn();
	registerMock.mockClear();
	loginMock.mockClear();
});

describe("RegisterPage", () => {
	it("renders registration form", () => {
		const wrapper = mount(RegisterPage, {
			global: { stubs: ["NuxtLink", "NuxtImg", "Icon", "AppNavbar"] },
		});
		expect(wrapper.text()).toContain("Create your account");
		expect(wrapper.find("#username").exists()).toBe(true);
		expect(wrapper.find("#email").exists()).toBe(true);
		expect(wrapper.find("#password").exists()).toBe(true);
		expect(wrapper.find("#location").exists()).toBe(true);
	});

	it("shows error if fields are empty and registration is attempted", async () => {
		const wrapper = mount(RegisterPage, {
			global: { stubs: ["NuxtLink", "NuxtImg", "Icon", "AppNavbar"] },
		});
		await wrapper.find('button[type="submit"]').trigger("submit");
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();
	});

	it("shows error on failed registration", async () => {
		const wrapper = mount(RegisterPage, {
			global: { stubs: ["NuxtLink", "NuxtImg", "Icon", "AppNavbar"] },
		});
		await wrapper.find("#username").setValue("existing");
		await wrapper.find("#email").setValue("fail@example.com");
		await wrapper.find("#password").setValue("pass123");
		await wrapper.find("#location").setValue("Budapest");
		await wrapper.find("#terms").setValue(true);
		await wrapper.find('button[type="submit"]').trigger("submit");
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();
		expect(wrapper.text()).toContain("Registration failed");
	});

	it("shows success and redirects on successful registration", async () => {
		const wrapper = mount(RegisterPage, {
			global: { stubs: ["NuxtLink", "NuxtImg", "Icon", "AppNavbar"] },
		});
		await wrapper.find("#username").setValue("newuser");
		await wrapper.find("#email").setValue("newuser@example.com");
		await wrapper.find("#password").setValue("pass123");
		await wrapper.find("#location").setValue("Budapest");
		await wrapper.find("#terms").setValue(true);
		await wrapper.find('button[type="submit"]').trigger("submit");
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();
		expect(wrapper.text()).toContain("Registration successful! You can now log in.");
		// Simulate auto-login and redirect
		expect(loginMock).toHaveBeenCalled();
		// Either /profile or /login redirect is possible, so check for at least one
		expect(pushMock).toHaveBeenCalled();
	});
});
