import { Component, h, Listen } from "@stencil/core";
import toast from "bulma-toast";

@Component({
    tag: 'notification-provider'
})
export class NotificationProvider 
{
    @Listen("notification")
    onNotification(e: {detail: {message: string, type: toast.ToastType, duration?: number}})
    {
        toast.toast({
            message: e.detail.message,
            type: e.detail.type,
            dismissible: true,
            animate: { in: "fadeIn", out: "fadeOut" },
        });

        document.querySelectorAll(".notification").forEach(el => {
            let handle = setTimeout(() => el.remove(), (e.detail.duration ?? 5) * 1000)
            
            el.querySelector(".delete").addEventListener("click", () => {
                el.remove();
                clearTimeout(handle);
            });
        });
    }

    @Listen("errorToast")
    onErrorToast(e: {detail: string})
    {
        return this.onNotification({detail: {
            message: e.detail,
            type: "is-danger"
        }});
    }

    @Listen("warnToast")
    onWarnToast(e: {detail: string})
    {
        return this.onNotification({detail: {
            message: e.detail,
            type: "is-warning"
        }});
    }

    @Listen("successToast")
    onSuccessToast(e: {detail: string})
    {
        return this.onNotification({detail: {
            message: e.detail,
            type: "is-success"
        }});
    }

    @Listen("infoToast")
    onInfoToast(e: {detail: string})
    {
        return this.onNotification({detail: {
            message: e.detail,
            type: "is-info"
        }});
    }

    render()
    {
        return <slot />;
    }
}
