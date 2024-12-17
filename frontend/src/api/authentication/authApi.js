import baseUrl from "../baseUrl/BaseUrl";
// import { googleLogin } from "../../hooks/firebase";

async function SignIn({ email, password }) {
    try {
        const response = await baseUrl.post("/users/login", {
            email: email,
            password: password
        },
            { withCredentials: true }
        )

        // if (response) {
        //     const now = new Date();
        //     const oneMonth = 30 * 24 * 60 * 60 * 1000;
        //     const item = {
        //         value: true,
        //         expiry: now.getTime() + oneMonth,
        //     };
        //     sessionStorage.setItem('isLogin', JSON.stringify(item))
        // }

        return response
    } catch (error) {
        // console.log(error?.response?.data);
        return null
    }
}

async function SignInWithGoogle(token) {
    try {
        const formdata = new FormData()

        formdata.append('token', token)

        const response = await baseUrl.post('/users/googleLogin', formdata, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })

        // if (response) {
        //     const now = new Date();
        //     const oneMonth = 30 * 24 * 60 * 60 * 1000;
        //     const item = {
        //         value: true,
        //         expiry: now.getTime() + oneMonth,
        //     };
        //     sessionStorage.setItem('isLogin', JSON.stringify(item))
        // }

        return response
    } catch (error) {
        console.log(error)
    }
}

async function SignOut() {
    try {
        const response = await baseUrl.post("/users/logout", {}, { withCredentials: true })
        return response
    } catch (error) {
        console.log(error);
        return null
    }
}

async function SignUp({ username, fullname, email, password, avatar, coverImage }) {
    // // console.log(username, fullname, email, password, avatar[0], coverImage[0]);
    const formData = new FormData();

    const defaultAvatar = new File(
        [await fetch("/images/avatar.png").then((res) => res.blob())],
        "defaultAvatar.png",
        { type: "image/png" }
    )

    const defaultCoverImage = new File(
        [await fetch("/images/coverImage.jpg").then((res) => res.blob())],
        "defaultCoverImage.jpg",
        { type: "image/jpg" }
    )

    formData.append("username", username);
    formData.append("fullName", fullname);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar[0] || defaultAvatar);
    formData.append("coverImage", coverImage[0] || defaultCoverImage);

    try {
        const register = await baseUrl.post("/users/register", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        },)
        return register
    } catch (error) {
        console.error("Error during registration:", error);
        return null;
    }
}

async function userById(userId) {
    try {
        const response = await baseUrl.get("/users/userById", {
            params: { userId },
            withCredentials: true
        })

        return response
    } catch (error) {
        console.log(error);
    }
}

async function currentUser() {
    try {
        const response = await baseUrl.get('/users/current-user', {
            withCredentials: true
        })
        return response
    } catch (error) {
        console.log(error);
        throw error
    }
}

async function UpdateNameEmail(fullName, email) {
    // console.log(fullName, email);

    try {
        const updatedValue = await baseUrl.patch("/users/update-account",
            {
                fullName: fullName,
                email: email
            },
            { withCredentials: true }
        )

        return updatedValue
    } catch (error) {
        console.log(error);
    }
}

async function UpdateAvatar(avatarFile) {
    try {
        const formData = new FormData()
        formData.append("avatar", avatarFile)

        const response = await baseUrl.patch("/users/avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            withCredentials: true
        })
        return response
    } catch (error) {
        console.log(error);
    }
}

async function UpdateCoverImage(CoverImage) {
    try {
        // console.log(CoverImage);

        const formData = new FormData()
        formData.append("coverImage", CoverImage)

        const response = await baseUrl.patch("/users/cover-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        })
        return response
    } catch (error) {
        console.log(error);
    }
}

async function changeCurrentPassword({ oldPassword, newPassword }) {
    // console.log(oldPassword, newPassword);

    try {
        const response = await baseUrl.post("/users/change-password", {
            oldPassword,
            newPassword
        }, { withCredentials: true })

        return response
    } catch (error) {
        console.log(error);
    }
}

export { SignIn, SignOut, SignUp, userById, currentUser, UpdateNameEmail, UpdateAvatar, UpdateCoverImage, changeCurrentPassword, SignInWithGoogle }