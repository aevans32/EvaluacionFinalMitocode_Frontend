export interface LoginApiResponse {
    data: {
        token: string;
        expiration: string;
    };
    success: boolean;
    errorMessage: string;
}

export interface RegisterRequestBody {
    documentNumber: string;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    documentType: number;
    age: number;
    confirmPassword: string;
}

export interface ChangePasswordRequestBody {
    email: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface RequestTokenBody {
    email: string;
}

export interface ChangePasswordBody {
    oldPassword: string;
    newPassword: string;
}