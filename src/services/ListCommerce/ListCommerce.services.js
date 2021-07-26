// Import Utils
import { http, getHeaders, errorMessage } from "../../utils/constants.util"

export default async function ListCommerce() {
    try {
        // Obtenemos la lista de los comercios asociados al dueño de compañia
        const { data } = await http.get("/wallets/commerces", getHeaders())

        if (data.error) {
            throw String(data.message)
        }

        return data
    } catch (error) {
        errorMessage(error.toString())
    }
}
