import toast from "react-hot-toast";

const AxiosTostError = (error) => {
  if (error.response) {
    toast.error(error.response.data.message);
  } else {
    toast.error(error.message);
  }
}

export default AxiosTostError;