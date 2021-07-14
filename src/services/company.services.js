import { http } from "./../utils/constants.util"

const createCompany = async (data) => {
    return await http.post("/ecommerce/company/register", data)
}

export default {
    createCompany,
}
