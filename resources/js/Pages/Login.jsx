import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { Button, FormHelperText } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "@mui/material/styles";
import { Inertia } from "@inertiajs/inertia";
import Loading from "@/Components/Loading";
import axios from "axios";
import Swal from "sweetalert2";


const Login = (props) => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmptyUsername, setIsEmptyUsername] = useState(false);
    const [isEmptyPassword, setIsEmptyPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleLogin = async () => {
        setIsEmptyUsername(username.trim().length === 0);
        setIsEmptyPassword(password.length === 0);
        if (username.trim().length > 0 && password.length > 0) {
            setIsLoading(true);
            await login();
            setIsLoading(false);
        }
    };
    const login = async () => {
        try {
            // const hashedPassword =  bcrypt.hashSync(password, 10);
            const data = { username, password };

            await axios.post("/login", data);
            setUsername("");
            setPassword("");
            Inertia.visit("dashboard");
        } catch (error) {
            Swal.fire({
                title: "Oops",
                text: error.response.data.error,
                icon: "error",
            });
        }
    };
    const handleUsernameChange = (event)=>{
        setUsername(event.target.value);
        setIsEmptyUsername(event.target.value.length === 0);
    }
    const handlePasswordChange = (event)=>{
        setPassword(event.target.value);
        setIsEmptyPassword(event.target.value.length === 0);
    }

    return (
        <>
            <Loading isLoading={isLoading} />
            <div className="row justify-content-center min-h-screen">
                <div className="col-lg-4 col-md-6 d-flex justify-content-center align-items-center">
                    <div className="login-card card mb-3 shadow">
                        <div className="card-body">
                            <h5 className="card-title text-center pb-3 px-4 mb-4">
                                Sign In
                            </h5>

                            <div className="row g-3">
                                <div className="col-12">
                                    <TextField
                                        id="outlined-basic"
                                        label="Username"
                                        variant="outlined"
                                        className="w-100 mb-2"
                                        onChange={(e) =>
                                            handleUsernameChange(e)
                                        }
                                        value={username}
                                        error={isEmptyUsername}
                                        helperText={
                                            isEmptyUsername
                                                ? "Username cannot be empty!"
                                                : ""
                                        }
                                    />
                                </div>
                                <div className="col-12">
                                    <FormControl
                                        className="w-100 mb-4"
                                        variant="outlined"
                                    >
                                        {isEmptyPassword ? (
                                            <InputLabel
                                                htmlFor="outlined-adornment-password"
                                                className="input-label-error"
                                            >
                                                Password
                                            </InputLabel>
                                        ) : (
                                            <InputLabel htmlFor="outlined-adornment-password">
                                                Password
                                            </InputLabel>
                                        )}
                                        <OutlinedInput
                                            id="outlined-adornment-password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            onChange={(e) =>
                                                handlePasswordChange(e)
                                            }
                                            value={password}
                                            error={isEmptyPassword}
                                            aria-describedby="outlined-weight-helper-text"
                                            inputProps={{
                                                "aria-label": "weight",
                                            }}
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
                                            id="outlined-weight-helper-text"
                                            sx={{ color: "#d32f2f" }}
                                        >
                                            {isEmptyPassword
                                                ? "Password cannot be empty!"
                                                : ""}
                                        </FormHelperText>
                                    </FormControl>
                                </div>
                            </div>
                            <div className="col-12 mt-2">
                                <Button
                                    variant="contained"
                                    className="w-100 p-2 mb-4 btn-login"
                                    onClick={() => handleLogin()}
                                >
                                    Login
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
