using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CongressionalTradingTracker.ApiService.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexToStock : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Stocks_Symbol",
                table: "Stocks",
                column: "Symbol",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Stocks_Symbol",
                table: "Stocks");
        }
    }
}
