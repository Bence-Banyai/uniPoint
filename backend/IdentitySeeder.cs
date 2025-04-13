using Microsoft.AspNetCore.Identity;
using uniPoint_backend.Models;

namespace uniPoint_backend
{
    public static class IdentitySeeder
    {
        public static async Task SeedAsync(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            var adminRole = "Admin";
            var adminUserName = "admin";
            var adminEmail = "admin@example.com";
            var adminPassword = "Admin123";

            var existingUser = await userManager.FindByEmailAsync(adminEmail);
            if (existingUser == null)
            {
                var user = new User
                {
                    UserName = adminUserName,
                    Email = adminEmail,
                };

                var result = await userManager.CreateAsync(user, adminPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, adminRole);
                }
            }
        }
    }
}
