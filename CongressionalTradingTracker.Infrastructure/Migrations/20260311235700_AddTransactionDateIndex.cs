using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CongressionalTradingTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTransactionDateIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Trades_TransactionDate",
                table: "Trades",
                column: "TransactionDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Trades_TransactionDate",
                table: "Trades");
        }
    }
}
