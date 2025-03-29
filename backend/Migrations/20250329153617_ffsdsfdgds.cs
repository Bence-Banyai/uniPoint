using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uniPoint_backend.Migrations
{
    /// <inheritdoc />
    public partial class ffsdsfdgds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ScheduledAt",
                table: "Appointments",
                newName: "appointmentDate");

            migrationBuilder.AddColumn<bool>(
                name: "IsPushNotificationsEnabled",
                table: "User",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "User",
                type: "varchar(255)",
                maxLength: 255,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "UserSelectedLanguage",
                table: "User",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Category",
                table: "Services",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CategoryIconUrl",
                table: "Services",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrls",
                table: "Services",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPushNotificationsEnabled",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Location",
                table: "User");

            migrationBuilder.DropColumn(
                name: "UserSelectedLanguage",
                table: "User");

            migrationBuilder.DropColumn(
                name: "Category",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "CategoryIconUrl",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "ImageUrls",
                table: "Services");

            migrationBuilder.RenameColumn(
                name: "appointmentDate",
                table: "Appointments",
                newName: "ScheduledAt");
        }
    }
}
