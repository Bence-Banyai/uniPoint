import { mount } from "@vue/test-utils";
import LoginPage from "../pages/login/index.vue";
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

vi.mock("../stores/auth.ts", () => ({
	useAuthStore: () => ({
		login: vi.fn(async ({ userNameOrEmail, password }) => {
			if (userNameOrEmail === "user" && password === "pass") {
				return { success: true };
			}
			return { success: false, message: "Invalid username or password" };
		}),
	}),
}));

beforeEach(() => {});

describe("LoginPage", () => {
	it("renders login form", () => {
		const wrapper = mount(LoginPage, {
			global: { stubs: ["NuxtLink", "NuxtImg", "Icon"] },
		});
		expect(wrapper.text()).toContain("Welcome back");
		expect(wrapper.find("#identifier").exists()).toBe(true);
		expect(wrapper.find("#password").exists()).toBe(true);
	});

	it("shows error if fields are empty and login is attempted", async () => {
		const wrapper = mount(LoginPage, {
			global: { stubs: ["NuxtLink", "NuxtImg", "Icon"] },
		});
		await wrapper.find('button[type="submit"]').trigger("submit");
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();
		expect(wrapper.text()).toContain("Please enter both username/email and password");
	});

	it("shows error on failed login", async () => {
		const wrapper = mount(LoginPage, {
			global: { stubs: ["NuxtLink", "NuxtImg", "Icon"] },
		});
		await wrapper.find("#identifier").setValue("wrong");
		await wrapper.find("#password").setValue("wrong");
		await wrapper.find('button[type="submit"]').trigger("submit");
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();
		expect(wrapper.text()).toContain("Invalid username or password");
	});

	it("redirects on successful login", async () => {
		const wrapper = mount(LoginPage, {
			global: { stubs: ["NuxtLink", "NuxtImg", "Icon"] },
		});
		await wrapper.find("#identifier").setValue("user");
		await wrapper.find("#password").setValue("pass");
		await wrapper.find('button[type="submit"]').trigger("submit");
		await wrapper.vm.$nextTick();
		await wrapper.vm.$nextTick();
		expect(pushMock).toHaveBeenCalledWith("/");
	});
});
