import { http } from "./../utils/constants.util"

const getCountries = async () => {
    return http.get("/register/countries")
}

export default {
    getCountries,
}
