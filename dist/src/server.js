// (BigInt.prototype as any).toJSON = function () {
//   return this.toString();
// };
import app from "./app";
import { env } from "./config/env";
const PORT = env.PORT || 3000;
app.listen(PORT, () => {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);
    console.log(`Server running on http://localhost:${PORT}`);
});
