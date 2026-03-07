using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CongressionalTradingTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStockCompanyTrigram : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Ticker_Company_trgm",
                table: "Stocks",
                column: "Company")
                .Annotation("Npgsql:IndexMethod", "gin")
                .Annotation("Npgsql:IndexOperators", new[] { "gin_trgm_ops" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Ticker_Company_trgm",
                table: "Stocks");
        }
    }
}
