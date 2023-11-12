import type { MiddlewaresConfig} from "@medusajs/medusa"
import cors from "cors"
  
export const config: MiddlewaresConfig = {
    routes: [
        {
            matcher: "/feature-display*",
            middlewares: [
                cors({
                  origin: "*",
                  credentials: true,
                }),
            ],
        },
        {
            matcher: "/images*",
            middlewares: [
                cors({
                  origin: "*",
                  credentials: true,
                }),
            ],
        },
    ],
}