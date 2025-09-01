// Generic model to be used as a base for api responses.
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    errorMessage: string | null;
}