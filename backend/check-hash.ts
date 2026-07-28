import * as bcrypt from "bcrypt";
async function main() {
  const match1 = await bcrypt.compare("Admin@123", "$2b$10$VsLp.37Nm.C1iR/vgeK.iet4lkr9d0EX/pk21VnbTuXNdpCBjypX6");
  const match2 = await bcrypt.compare("Password123!", "$2b$10$VsLp.37Nm.C1iR/vgeK.iet4lkr9d0EX/pk21VnbTuXNdpCBjypX6");
  const match3 = await bcrypt.compare("admin", "$2b$10$VsLp.37Nm.C1iR/vgeK.iet4lkr9d0EX/pk21VnbTuXNdpCBjypX6");
  console.log("Admin@123:", match1);
  console.log("Password123!:", match2);
  console.log("admin:", match3);
}
main();
