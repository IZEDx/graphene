
import toast from "bulma-toast";

export interface Notification
{
    message: string;
    type: toast.ToastType;
    duration?: number;
}