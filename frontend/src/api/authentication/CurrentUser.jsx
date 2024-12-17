import { useEffect } from "react"
import useAxiosPrivet from "../../hooks/useAxiosPrivet"
import { useNavigate, useLocation } from "react-router-dom"
import userData from "../../zustand/userData"
function CurrentUser() {
    const PrivetBaseUrl = useAxiosPrivet()
    const navigate = useNavigate()
    const location = useLocation()
    const setCurrentUserData = userData((state) => state.setCurrentUserData)

    useEffect(() => {
        const controller = new AbortController()

        async function getUser() {
            setCurrentUserData({ data: null, loading: true, isUser: false })
            try {
                const response = await PrivetBaseUrl.get("/users/current-user", {
                    withCredentials: true,
                    signal: controller.signal
                })

                // console.log('response', response)
                setCurrentUserData({ data: response.data.data, loading: false, isUser: Boolean(response.data.data) })

                return response.data

            } catch (error) {
                if (error.code !== "ERR_CANCELED") {
                    // navigate("/", { state: { form: location }, replace: true })
                    setCurrentUserData({ data: null, loading: false, isUser: false, notUser: true })
                }
                console.log(error);
            }
        }

        getUser()

        return () => {
            controller.abort()
        }
    }, [])
}

export default CurrentUser
