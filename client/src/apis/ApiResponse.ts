export default class ApiResponse {
    public success: boolean;
    public message: string;

    constructor(success: number, message: string) {
        this.message = message;

        if (success.toString().startsWith("2")) this.success = true;
        else this.success = false;
    }
}
