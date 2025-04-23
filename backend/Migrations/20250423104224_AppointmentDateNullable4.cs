using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace uniPoint_backend.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentDateNullable4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE Appointments
MODIFY COLUMN appointmentDate DATETIME(6) NULL;"
);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
