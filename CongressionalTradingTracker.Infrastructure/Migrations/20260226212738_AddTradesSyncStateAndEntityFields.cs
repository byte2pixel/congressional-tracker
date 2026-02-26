using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace CongressionalTradingTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTradesSyncStateAndEntityFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Company",
                table: "Stocks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TickerType",
                table: "Stocks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BioGuideId",
                table: "Politicians",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Party",
                table: "Politicians",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Politicians",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SyncStates",
                columns: table => new
                {
                    SyncStateId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BulkSyncCompleted = table.Column<bool>(type: "boolean", nullable: false),
                    LastLiveSyncAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SyncStates", x => x.SyncStateId);
                });

            migrationBuilder.CreateTable(
                name: "Trades",
                columns: table => new
                {
                    TradeId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PoliticianId = table.Column<int>(type: "integer", nullable: false),
                    StockId = table.Column<int>(type: "integer", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReportDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Transaction = table.Column<string>(type: "text", nullable: false),
                    Range = table.Column<string>(type: "text", nullable: true),
                    Amount = table.Column<int>(type: "integer", nullable: false),
                    Party = table.Column<string>(type: "text", nullable: false),
                    House = table.Column<string>(type: "text", nullable: false),
                    District = table.Column<string>(type: "text", nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    ExcessReturn = table.Column<decimal>(type: "numeric", nullable: true),
                    PriceChange = table.Column<decimal>(type: "numeric", nullable: true),
                    SpyChange = table.Column<decimal>(type: "numeric", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trades", x => x.TradeId);
                    table.ForeignKey(
                        name: "FK_Trades_Politicians_PoliticianId",
                        column: x => x.PoliticianId,
                        principalTable: "Politicians",
                        principalColumn: "PoliticianId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Trades_Stocks_StockId",
                        column: x => x.StockId,
                        principalTable: "Stocks",
                        principalColumn: "StockId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trades_PoliticianId_StockId_TransactionDate_Transaction_Ran~",
                table: "Trades",
                columns: new[] { "PoliticianId", "StockId", "TransactionDate", "Transaction", "Range" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Trades_StockId",
                table: "Trades",
                column: "StockId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SyncStates");

            migrationBuilder.DropTable(
                name: "Trades");

            migrationBuilder.DropColumn(
                name: "Company",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "TickerType",
                table: "Stocks");

            migrationBuilder.DropColumn(
                name: "BioGuideId",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "Party",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Politicians");
        }
    }
}
