"use server";

import { EnvCheck } from "../types/env";

async function checkEnv() {
    const requiredEnv = ["CONTROLD_API_KEY", "CONTROLD_PROFILE_ID", "BYPASS_OPT_ENV_CHECK"];
    const errors: EnvCheck["errors"] = [];

    if (process.env.BYPASS_OPT_ENV_CHECK === "true") return errors;

    for (const required of requiredEnv) {
        const envValue = process.env[required];
        if (!envValue || envValue.trim() === "") {
            errors.push({
                env_key: required.toUpperCase(),
                error_description: `La variable ${required.toUpperCase()} n'est pas défini.`,
                error_title: "Variable manquante",
            });
        }
    }
    return errors;
}
export default checkEnv;
