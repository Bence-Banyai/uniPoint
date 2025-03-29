using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uniPoint_backend.Migrations
{
    /// <inheritdoc />
    public partial class ffsdsfdgdsddfasd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "OpeningHours",
                table: "Services",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OpeningHours",
                table: "Services");
        }
    }
}
