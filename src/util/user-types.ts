export type CreateAccountType = {
	email: string;
	password: string;
};

export type PasswordType = {
	password: string;
};

export type VerifyEmailCodeType = {
	code: number;
};

export type VerifyEmailResetCodeType = {
	email: string;
};

export type VerifyUsernameType = {
	username: string;
};
