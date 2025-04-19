using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uniPoint_backend.Migrations
{
    /// <inheritdoc />
    public partial class service_openinghours : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OpeningHours",
                table: "Services");

            migrationBuilder.AddColumn<TimeOnly>(
                name: "ClosesAt",
                table: "Services",
                type: "time(6)",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));

            migrationBuilder.AddColumn<TimeOnly>(
                name: "OpensAt",
                table: "Services",
                type: "time(6)",
                nullable: false,
                defaultValue: new TimeOnly(0, 0, 0));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClosesAt",
                table: "Services");

            migrationBuilder.DropColumn(
                name: "OpensAt",
                table: "Services");

            migrationBuilder.AddColumn<int>(
                name: "OpeningHours",
                table: "Services",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
