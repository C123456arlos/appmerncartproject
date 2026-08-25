import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import type { Order } from "../types"
import Loading from "../components/Loading"
import { ArrowLeftIcon, MapPinIcon, PhoneIcon } from "lucide-react"
import OrderOTP from '../components/OrderTracking/OrderOTP'
import LiveMap from '../components/OrderTracking/LiveMap'
import OrderTimeLine from '../components/OrderTracking/OrderTimeLine'
import api from "../config/api"
const OrderTracking = () => {
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [liveLocation, setLiveLocation] = useState<{ lat: number; lng: number } | null>(null)
    useEffect(() => {
        // setOrder(dummyDashboardOrdersData.find((o) => o.id === id) as any)
        api.get(`/orders/${id}`).then((res) => setOrder(res.data.order))
            .catch(() => navigate('/orders')).finally(() => setLoading(false))
    }, [id, navigate])
    useEffect(() => {
        if (!order || ['Delivered', 'Cancelled', 'Placed'].includes(order.status)) return
        const fetchLocation = async () => {
            try {
                const { data } = await api.get(`/orders/${id}/location`)
                if (data.liveLocation?.lat && data.liveLocation?.lng && data.liveLocation.updatedAt) {
                    setLiveLocation({
                        lat: data.liveLocation.lat,
                        lng: data.liveLocation.lng
                    })
                }
                if (data.status && data.status !== order.status) {
                    setOrder((prev) => prev ? { ...prev, status: data.status } : prev)
                }
            } catch {

            }
        }
        fetchLocation()
        const interval = setInterval(fetchLocation, 10000)
        return () => clearInterval(interval)
    }, [id, order?.status])
    if (loading) return <Loading></Loading>
    if (!order) null
    return (
        <div className="min-h-screen mb-20 bg-app-cream">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-sm text-app-text-light hover:text-app-green mb-6 transition-colors">
                    <ArrowLeftIcon className="size-4"></ArrowLeftIcon>back to orders
                </button>
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold tezt-app-green">order #{order!.id.slice(-8).toUpperCase()}</h1>
                        <p className="text-sm text-app-text-light mt-1">placed on {new Date(order!.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${order!.status === 'Delivered' ? 'bg-green-100 text-green-700' : order!.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-app-orange/10 text-app-orange'}`}>
                        {order!.status}
                    </span>

                </div>
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <OrderOTP order={order}></OrderOTP>
                        <LiveMap order={order} liveLocation={liveLocation}></LiveMap>
                        <OrderTimeLine order={order}></OrderTimeLine>
                        {order?.deliveryPartner && order.status !== 'Delivered' && order.status !== 'Cancelled' && (<div className="bg-white rounded-2xl p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-11 rounded-full bg-app-green flex-center">
                                    <span className="text-white font-semibold text-sm">
                                        {order.deliveryPartner.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-app-green">{order.deliveryPartner.name.charAt(0)}</p>
                                    <p className="text-xs text-app-text-light capitalize">{order.deliveryPartner.vehicleType} &middot; delivery partner</p>
                                </div>
                            </div>
                            <a href={`tel:${order.deliveryPartner.phone}`} className="p-2.5 bg-app-cream rounded-xl hover:bg-app-cream-dark transition-colors">
                                <PhoneIcon className="size-4 text-app-green"></PhoneIcon>
                            </a>
                        </div>
                        )}
                    </div>
                    <div className="space-y-5">
                        <div className="bg-white rounded-2xl p-5">
                            <h3>
                                <MapPinIcon className="size-4"></MapPinIcon>
                                delivery address
                            </h3>
                            <p className="text-sm text-app-text-light leading-relaxed">
                                {order?.shippingAddress.label}
                                <br></br>
                                {order?.shippingAddress.address}
                                <br></br>
                                {order?.shippingAddress.city}, {order?.shippingAddress.state},
                                {order?.shippingAddress.zip}
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-app-green mb-3">items ({order?.items.length})</h3>
                            <div className="space-y-3">
                                {order?.items.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <img src={item.image} alt={item.name} className="size-10 rounded-lg object-cover"
                                        ></img>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-app-green truncate">{item.name}</p>
                                            <p className="text-xs text-app-text-light">x {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-semibold">
                                            {currency}{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-3 border-t border-app-border space-y-1.5 text-sm">

                                <div className="flex justify-between">
                                    <span className="text-app-text-light">subtotal</span>
                                    <span>{currency}{order?.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-app-text-light">delivery</span>
                                    <span>{order?.deliveryFee === 0 ? 'free' : `${currency}${order?.deliveryFee.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-app-text-light">tax</span>
                                    <span>{currency}{order?.tax?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-app-border font-semibold text-app-green">
                                    <span>total</span>
                                    <span>{currency}{order?.total?.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderTracking