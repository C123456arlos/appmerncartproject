import { useState } from "react"
import { heroSectionData } from "../assets/assets"
import { Link } from "react-router-dom"
import { BikeIcon, Loader2Icon, LockIcon, MailIcon, UserIcon } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

const Login = () => {
    const [isLoginState, setIsLoginState] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, register } = useAuth()
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (isLoginState) {
                await login(email, password)
            } else {
                await register(name, email, password)
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center">
                <img src={heroSectionData.hero_image} className="absolute inset-0 object-cover h-full bg-center opacity-10"></img>
                <div className="relative text-center px-12">
                    <h2 className="text-4xl font-semibold text-white mb-4">welcome back to instacart</h2>
                    <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">fresh groceries and organic produce delivered to your doorstep</p>
                </div>
            </div>
            <div className="flex-1 flex-center px-4 py-12 bg-app-cream">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <Link to={'/'} className="inline-flex items-center gap-2 mb-6">
                            <BikeIcon className="size-8 text-app-green"></BikeIcon>
                            <span className="text-2xl font-semibold text-app-green">instacart</span>
                        </Link>
                        <h1 className="text-2xl font-semibold text-app-green mb-2">
                            {isLoginState ? 'sign into your account' : 'signup for an account'}
                        </h1>
                        <p className="text-sm text-app-text-light">
                            {
                                isLoginState ? 'dont have an account' : 'already have an account'
                            }
                            <button onClick={() => setIsLoginState(!isLoginState)} className="text-orange-500 ml-1 font-semibold hover:text-orange-600 transition-colors"
                            >{isLoginState ? 'create one' : 'sign in'}</button>
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isLoginState && (
                            <label className="text-sm flex flex-col gap-1">
                                name
                                <div className="relative">
                                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light "></UserIcon>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                        required placeholder='your name' className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border-transition-all"></input>
                                </div>
                            </label>
                        )}
                        <label className="text-sm flex flex-col gap-1">
                            email address
                            <div className="relative">
                                <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light "></MailIcon>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                    required placeholder='test@example.com' className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border-transition-all"></input>
                            </div>
                        </label>
                        <label className="text-sm flex flex-col gap-1">
                            password
                            <div className="relative">
                                <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-app-text-light "></LockIcon>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    required placeholder='&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;&middot;' className="w-full pl-11 pr-4 py-3 text-sm bg-white rounded-xl border not-focus:border-app-border-transition-all"></input>
                            </div>
                        </label>
                        <button type="submit" disabled={loading} className="flex-center w-full py-3 bg-green-950 text-white font-semibold rounded-xl hover:bg-green-900 transition-color disabled:opacity-50">
                            {loading ? <Loader2Icon className="animate-spin"></Loader2Icon> : isLoginState ? 'sign in' : 'sign up'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login