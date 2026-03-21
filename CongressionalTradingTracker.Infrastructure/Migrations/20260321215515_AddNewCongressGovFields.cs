using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CongressionalTradingTracker.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNewCongressGovFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"ALTER TABLE ""Politicians"" ALTER COLUMN ""District"" TYPE integer USING (NULLIF(""District"", '')::integer);");

            migrationBuilder.AddColumn<string>(
                name: "ImageAltText",
                table: "Politicians",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Politicians",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageAltText",
                table: "Politicians");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Politicians");

            migrationBuilder.AlterColumn<string>(
                name: "District",
                table: "Politicians",
                type: "text",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }
    }
}
