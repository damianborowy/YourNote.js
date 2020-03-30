export default class ApiResponse {
    public success: boolean;

    constructor(success: number, public payload: any = null) {
        if (success.toString().startsWith("2")) this.success = true;
        else this.success = false;
    }
}
