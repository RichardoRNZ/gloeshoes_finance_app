import { TroubleshootTwoTone, Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Breadcrumbs,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ConfirmModal from "../ConfirmModal";
import Loading from "../Loading";

const ChangeUserForm = ({ auth }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: auth.user.username,
        password: "",
        confirmPassword: "",
    });
    const [formErrors, setFormErrors] = useState({
        username: false,
        password: false,
        passwordLength: false,
        confirmPassword: false,
        passwordsMatch: true,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isNotValid, setIsNotValid] = useState(true);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleInputChange = (field) => (event) => {
        const { value } = event.target;
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateFields = () => {
        const usernameEmpty = formData.username.length === 0;
        const passwordEmpty = formData.password.length === 0;
        const confirmPasswordEmpty = formData.confirmPassword.length === 0;
        const passwordsMatch = formData.password === formData.confirmPassword;
        const passwordLength = formData.password.length < 8;

        setFormErrors({
            username: usernameEmpty,
            password: passwordEmpty,
            confirmPassword: confirmPasswordEmpty,
            passwordsMatch: passwordsMatch,
            passwordLength: passwordLength,
        });

        setIsNotValid(
            usernameEmpty ||
                passwordEmpty ||
                !passwordsMatch ||
                confirmPasswordEmpty
        );
    };

    const handleChangeData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.put("/change/user", {
                username: formData.username,
                password: formData.password,
            });
            Swal.fire({
                icon: "success",
                title: response.data.message,
                showConfirmButton: true,
                timer: 1500,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops!",
                text: error.response.data,
                showConfirmButton: true,
                timer: 1500,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {<Loading isLoading={isLoading} />}
            <div className="container">
                <div className="mb-4">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link
                            underline="none"
                            color="#243ab0"
                            href={route("dashboard")}
                        >
                            Home
                        </Link>
                        <Typography color="#243ab0" sx={{ fontWeight: "600" }}>
                            Change User Data
                        </Typography>
                    </Breadcrumbs>
                </div>
                <div className="row justify-content-center">
                    <div className="col-lg-9 mt-5">
                        <div className="login-card card mb-3">
                            <div className="card-body">
                                <div className="row g-3 mt-4">
                                    <div className="col-12">
                                        <TextField
                                            id="outlined-basic"
                                            label="Username"
                                            variant="outlined"
                                            className="w-100 mb-2"
                                            onChange={handleInputChange(
                                                "username"
                                            )}
                                            onBlur={validateFields}
                                            value={formData.username}
                                            error={formErrors.username}
                                            helperText={
                                                formErrors.username
                                                    ? "Username cannot be empty!"
                                                    : ""
                                            }
                                        />
                                    </div>
                                    <div className="col-12">
                                        <FormControl
                                            className="w-100 mb-2"
                                            variant="outlined"
                                        >
                                            <InputLabel
                                                htmlFor="outlined-adornment-password"
                                                error={formErrors.password}
                                            >
                                                New Password
                                            </InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                onChange={handleInputChange(
                                                    "password"
                                                )}
                                                onBlur={validateFields}
                                                value={formData.password}
                                                error={formErrors.password || formErrors.passwordLength }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={
                                                                handleClickShowPassword
                                                            }
                                                            onMouseDown={
                                                                handleMouseDownPassword
                                                            }
                                                            edge="end"
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Password"
                                            />
                                            <FormHelperText
                                                error={formErrors.password}
                                            >
                                                {formErrors.password
                                                    ? "Password cannot be empty!"
                                                    : formErrors.passwordLength
                                                    ? "Password must be at least 8 characters!"
                                                    : ""}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                    <div className="col-12">
                                        <FormControl
                                            className="w-100 mb-4"
                                            variant="outlined"
                                        >
                                            <InputLabel
                                                htmlFor="outlined-adornment-confirm-password"
                                                error={
                                                    formErrors.confirmPassword ||
                                                    !formErrors.passwordsMatch
                                                }
                                            >
                                                Confirm Password
                                            </InputLabel>
                                            <OutlinedInput
                                                id="outlined-adornment-confirm-password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                onChange={handleInputChange(
                                                    "confirmPassword"
                                                )}
                                                onBlur={validateFields}
                                                value={formData.confirmPassword}
                                                error={
                                                    formErrors.confirmPassword ||
                                                    !formErrors.passwordsMatch
                                                }
                                                endAdornment={
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={
                                                                handleClickShowPassword
                                                            }
                                                            onMouseDown={
                                                                handleMouseDownPassword
                                                            }
                                                            edge="end"
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff />
                                                            ) : (
                                                                <Visibility />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                }
                                                label="Confirm Password"
                                            />
                                            <FormHelperText
                                                error={
                                                    formErrors.confirmPassword ||
                                                    !formErrors.passwordsMatch
                                                }
                                            >
                                                {formErrors.confirmPassword
                                                    ? "Password cannot be empty!"
                                                    : !formErrors.passwordsMatch
                                                    ? "Passwords do not match!"
                                                    : ""}
                                            </FormHelperText>
                                        </FormControl>
                                    </div>
                                </div>

                                <div className="row d-flex justify-content-end">
                                    <div className="col-lg-3">
                                        <Button
                                            variant="contained"
                                            className="w-100 p-2 mb-4 btn-login"
                                            data-bs-toggle={
                                                !isNotValid ? "modal" : ""
                                            }
                                            data-bs-target={
                                                !isNotValid ? "#saveModal" : ""
                                            }
                                            onClick={validateFields}
                                            disabled={isLoading}
                                        >
                                            Update
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmModal
                id="saveModal"
                type="submit"
                text="Are you sure you want to save changes?"
                handleClick={handleChangeData}
            />
        </>
    );
};

export default ChangeUserForm;
