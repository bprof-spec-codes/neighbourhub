using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    /// <inheritdoc />
    public partial class PinPoint : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PinPoint_FloorPlans_FloorPlanId",
                table: "PinPoint");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PinPoint",
                table: "PinPoint");

            migrationBuilder.RenameTable(
                name: "PinPoint",
                newName: "PinPoints");

            migrationBuilder.RenameIndex(
                name: "IX_PinPoint_FloorPlanId",
                table: "PinPoints",
                newName: "IX_PinPoints_FloorPlanId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PinPoints",
                table: "PinPoints",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PinPoints_FloorPlans_FloorPlanId",
                table: "PinPoints",
                column: "FloorPlanId",
                principalTable: "FloorPlans",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PinPoints_FloorPlans_FloorPlanId",
                table: "PinPoints");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PinPoints",
                table: "PinPoints");

            migrationBuilder.RenameTable(
                name: "PinPoints",
                newName: "PinPoint");

            migrationBuilder.RenameIndex(
                name: "IX_PinPoints_FloorPlanId",
                table: "PinPoint",
                newName: "IX_PinPoint_FloorPlanId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PinPoint",
                table: "PinPoint",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PinPoint_FloorPlans_FloorPlanId",
                table: "PinPoint",
                column: "FloorPlanId",
                principalTable: "FloorPlans",
                principalColumn: "Id");
        }
    }
}
