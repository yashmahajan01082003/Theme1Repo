// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "",
        institution: "",
        password: "",
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await axios.post("http://127.0.0.1:8000/api/register/", formData, {
                headers: { "Content-Type": "application/json" },
            });

            if (res.data.success) {
                setMessage({ type: "success", text: "Signup successful! 🎉 You can now log in." });
                setFormData({ name: "", email: "", role: "", institution: "", password: "" }); // reset form
            } else {
                setMessage({ type: "error", text: res.data.message || "Signup failed" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className='login-container'>
            <style>{`
/* Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Container with background video */
.login-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* Background video */
#bg-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
    filter: brightness(0.75) saturate(0.7) contrast(1.05);
}

/* Form box */
.form-box {
    background: rgba(35, 52, 35, 0.55);
    padding: 40px 30px;
    border: 1px solid rgba(50, 90, 60, 0.45);
    border-radius: 12px;
    backdrop-filter: blur(2px);
    box-shadow: rgba(40, 80, 50, 0.12);
    width: 400px;
    text-align: center;
    color: #fff;
    animation: fadeIn 1s ease-in-out;
}

/* Heading */
.form-box h2 {
    font-size: 42px;
    text-align: center;
    margin: 20px 0 30px;
    color: rgb(185, 214, 182);
}

.input-box {
    position: relative;
    height: 50px;
    margin-bottom: 30px;
    border-bottom: 2px solid #172939;
    background: transparent;
}

.input-box input {
    width: 100%;
    height: 100%;
    background: transparent !important;
    border: none;
    outline: none;
    color: #fff;
    font-size: 16px;
    padding: 0 5px;
}

.input-box label {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    pointer-events: none;
    transition: 0.3s ease all;
    color: #fff;
}

/* Floating label effect */
.input-box input:focus~label,
.input-box input:valid~label {
    top: -10px;
    font-size: 12px;
    color: #ffd700;
}

.remember-forgot {
    display: flex;
    justify-content: end;
    align-items: center;
    font-size: 14px;
    margin-bottom: 20px;
}

.remember-forgot label {
    color: #fff;
}

.remember-forgot input {
    margin-right: 5px;
    color: #fff;
}

.remember-forgot a {
    color: rgb(185, 214, 182);
    text-decoration: none;
}

.remember-forgot a:hover {
    text-decoration: underline;
}

/* Button */
.btn {
    width: 100%;
    padding: 12px;
    background: rgb(185, 214, 182);
    border: none;
    cursor: pointer;
    font-size: 18px;
    font-weight: 900;
    border-radius: 5px;
    transition: 0.3s ease;
    color: #172939;
}

.btn:hover {
    background: rgb(147, 242, 137);
}

/* Register link */
.login-register {
    text-align: center;
    margin: 25px 0;
    color: #fff;
}

.login-register a {
    color: rgb(185, 214, 182);
    text-decoration: none;
}

.login-register a:hover {
    text-decoration: underline;
}

/* Animation */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
            `}</style>

            <video id="bg-video" loop autoPlay muted>
                <source src="/assets/login.mp4" type="video/mp4" />
            </video>

            <form className="form-box" onSubmit={handleSubmit}>
                <h2>Sign Up</h2>

                <div className="input-box">
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <label>Name</label>
                </div>

                <div className="input-box">
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <label>Email</label>
                </div>

                <div className="input-box">
                    <input
                        name="role"
                        type="text"
                        value={formData.role}
                        onChange={handleChange}
                        required
                    />
                    <label>Role</label>
                </div>

                <div className="input-box">
                    <input
                        name="institution"
                        type="text"
                        value={formData.institution}
                        onChange={handleChange}
                        required
                    />
                    <label>Institution</label>
                </div>

                <div className="input-box">
                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <label>Password</label>
                </div>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? "Signing up..." : "Join the Adventure!"}
                </button>

                {/* ✅ Message Display */}
                {message && (
                    <p
                        style={{
                            marginTop: "10px",
                            color: message.type === "success" ? "green" : "red",
                            fontWeight: "bold",
                        }}
                    >
                        {message.text}
                    </p>
                )}

                <div className="login-register">
                    <p>
                        Already a member? <a href="/login">Log In</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Register;
