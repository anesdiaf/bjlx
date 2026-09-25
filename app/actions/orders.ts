import { ActionResult } from "@/types";

export const createQuickOrder = async (): Promise<ActionResult> => {
    try {


        return { success: true }
    } catch (err) {
        if (err instanceof Error) {

            console.log(err.message);
        }
        return { success: false, error: "Échec de l'enregistrement des informations utilisateur" }
    }
}