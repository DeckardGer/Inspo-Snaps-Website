import { Unosend } from "@unosend/node";
import { serverEnv } from "@/config/env/server";

export const unosend = new Unosend(serverEnv.UNOSEND_API_KEY);
