import AlertError from "./AlertError";
import AlertSuccess from "./AlertSuccess";
import AlertWarning from "./AlertWarning";

export enum AlertType {
    SUCCESS,
    WARNING,
    ERROR,
}

export interface AlertContent {
    type: AlertType;
    title: string;
    message?: string;
}
export default function Alert({ props }: { props: AlertContent }) {
    switch (props.type) {
        case AlertType.SUCCESS:
            return <AlertSuccess props={props}></AlertSuccess>;
        case AlertType.ERROR:
            return <AlertError props={props}></AlertError>;
        case AlertType.WARNING:
            return <AlertWarning props={props}></AlertWarning>;
    }
}
