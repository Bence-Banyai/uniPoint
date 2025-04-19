using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.Tasks;
using uniPoint_backend.Models;
using Microsoft.AspNetCore.Http.Extensions;

namespace uniPoint_backend
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("MySqlDatabase");
            builder.Services.AddDbContext<uniPointContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            var jwtSettings = builder.Configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]);

            // Configure Authentication - Combine Identity Cookies and JWT Bearer
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true,
                        ValidIssuer = jwtSettings["Issuer"],
                        ValidateAudience = true,
                        ValidAudience = jwtSettings["Audience"],
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromMinutes(1)
                    };

                    // Re-enable detailed logging for JWT events
                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            Console.WriteLine("JWT Authentication Failed:");
                            Console.WriteLine(context.Exception.ToString());
                            return Task.CompletedTask;
                        },
                        OnTokenValidated = context =>
                        {
                            Console.WriteLine("JWT Token Validated:");
                            return Task.CompletedTask;
                        },
                        OnChallenge = context =>
                        {
                            Console.WriteLine("JWT Challenge Triggered.");
                            return Task.CompletedTask;
                        },
                        OnMessageReceived = context =>
                        {
                            Console.WriteLine("JWT Message Received.");
                            return Task.CompletedTask;
                        }
                    };
                });

            builder.Services.AddAuthorization();

            builder.Services.AddIdentity<User, IdentityRole>(options => {
                    options.SignIn.RequireConfirmedAccount = false;
                    options.User.RequireUniqueEmail = true;
                    options.Password.RequireDigit = true;
                    options.Password.RequiredLength = 6;
                    options.Password.RequireNonAlphanumeric = false;
                    options.Password.RequireUppercase = true;
                    options.Password.RequireLowercase = true;
                })
                .AddEntityFrameworkStores<uniPointContext>()
                .AddDefaultTokenProviders();

            builder.Services.AddScoped<BlobService>();

            // Configure Identity's Application Cookie behavior
            builder.Services.ConfigureApplicationCookie(options =>
            {
                 options.Events.OnRedirectToLogin = context =>
                 {
                     if (context.Request.Path.StartsWithSegments("/api"))
                     {
                         context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                         return Task.CompletedTask;
                     }
                     context.Response.Redirect(context.RedirectUri);
                     return Task.CompletedTask;
                 };

                 options.Events.OnRedirectToAccessDenied = context =>
                 {
                     if (context.Request.Path.StartsWithSegments("/api"))
                     {
                         context.Response.StatusCode = StatusCodes.Status403Forbidden;
                         return Task.CompletedTask;
                     }
                     context.Response.Redirect(context.RedirectUri);
                     return Task.CompletedTask;
                 };
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder
                        .SetIsOriginAllowed(_ => true) // allow any origin
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
            });

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddAutoMapper(typeof(MappingProfile));
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.Use(async (context, next) =>
            {
                Console.WriteLine($"---> Incoming Request: {context.Request.Method} {context.Request.GetDisplayUrl()}");
                await next.Invoke(); // Call the next middleware in the pipeline
                Console.WriteLine($"<--- Outgoing Response: {context.Response.StatusCode}");
            });

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var userManager = services.GetRequiredService<UserManager<User>>();
                var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
                await SeedRolesAsync(services, roleManager);
                await IdentitySeeder.SeedAsync(userManager, roleManager);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // For development, comment out HTTPS redirection to allow HTTP requests
            if (!app.Environment.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            // Apply the combined CORS policy
            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            await app.RunAsync();
        }
        
        static async Task SeedRolesAsync(IServiceProvider serviceProvider, RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Admin", "Provider", "User" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }
        }
    }
}