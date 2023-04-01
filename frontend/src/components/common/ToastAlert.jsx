import { toast } from "react-toastify";

const ToastAlert = ({ type, message, position }) => {
  return toast(message, {
    position: position ? position : "top-right",
    autoClose: 2500,
    theme: "colored",
    type: type ? type : "success",
  });
};

export default ToastAlert;
