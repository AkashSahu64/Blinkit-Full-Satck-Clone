import SummaryApi from "../common/SummaryApi"
import Axios from "./Axios.utils"

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.userDetail,
        });

        // Check if response contains valid data before returning
        if (response?.data) {
            return response.data;
        } else {
            throw new Error("No user data received");
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null; // Return null instead of crashing the app
    }
};

export default fetchUserDetails;
