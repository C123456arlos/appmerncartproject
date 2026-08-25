// import { Request, Response } from "express";
// import { prisma } from "../config/prisma.js";
// import { inngest } from "../inngest/index.js"
// import stripe from 'stripe'

// export const createOrder = async (req: Request, res: Response) => {

//     const { items, shippingAddress, paymentMethod } = req.body
//     if (!items || items.length === 0) {
//         return res.status(400).json({ message: 'no order items' })
//     }
//     const productIds = items.map((i: any) => i.product)
//     const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
//     // type Record<K extends keyof any, T> = { [P in K]: T; }
//     // Construct a type with a set of properties K of type T
//     const productMap: Record<string, (typeof products)[0]> = {}

//     products.forEach((p: any) => productMap[p.id] = p)
//     console.log(productMap)
//     for (const item of items) {
//         const product = productMap[item.product]
//         if (!product || (product.stock ?? 0) < item.quantity) {
//             return res.status(404).json({ message: 'product out of stock' })
//         }
//     }
//     const orderItems = items.map((item: any) => {
//         const dbProduct = productMap[item.product]
//         if (!dbProduct) throw new Error(`product ${item.product} not found`)
//         return {
//             product: dbProduct.id,
//             name: dbProduct.name,
//             image: dbProduct.image,
//             price: dbProduct.price,
//             unit: dbProduct.unit,
//             quantity: item.quantity
//         }
//     })
//     const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
//     console.log(subtotal)
//     const deliveryFee = subtotal > 20 ? 0 : 1.99
//     const tax = Math.round(subtotal * 0.08 * 100) / 100
//     const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100
//     const order = await prisma.order.create({
//         data: {
//             userId: '398c5966-6811-4c96-9b33-9adbd44611fe',
//             items: orderItems,
//             shippingAddress,
//             paymentMethod,
//             subtotal,
//             deliveryFee,
//             tax,
//             total,
//             statusHistory: [{ status: 'Placed', note: 'order placed successfully', timestamp: new Date() }]
//         }
//     })
//     console.log(order)
//     if (paymentMethod === 'card') {
//         const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY as string)
//        const  line_items= [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: 'payment groceries'
//                         },
//                         unit_amount: Math.round(total * 100)
//                     },
//                     quantity: 1,
//                 },
//             ]
//         const session = await stripeInstance.checkout.sessions.create({
//             success_url: `${req.headers.origin}/orders?clearCart=true`,
//             cancel_url: `${req.headers.origin}/checkout`,
//            line_items:line_items,
//             mode: 'payment',
//             metadata: { orderId: order.id }
//         });
//         return res.json({ url: session.url })
//     //   const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
//     //     const line_items = [{
//     //         price_data: {
//     //             currency: 'usd',
//     //             product_data: {
//     //                 name: showData.movie.title
//     //             },
//     //             unit_amount: Math.floor(booking.amount) * 100
//     //         },
//     //         quantity: 1
//     //     }]
//     //     const session = await stripeInstance.checkout.sessions.create({
//     //         success_url: `${origin}/loading/my-bookings`,
//     //         cancel_url: `${origin}/my-bookings`,
//     //         line_items: line_items,
//     //         mode: 'payment',
//     //         metadata: {
//     //             bookingId: booking._id.toString()
//     //         },
//     //         expires_at: Math.floor(Date.now() / 1000) + 30 * 60
//     //     })
//     //     booking.paymentLink = session.url









//     }
//     res.json({ order })
//     for (const item of orderItems) {
//         await prisma.product.update({
//             where: { id: item.product },
//             // data: {
//             //     stock: item.quantity
//             // }
//             data: { stock: { decrement: item.quantity } }
//         })
//     }
//     for (const item of orderItems) {
//         await inngest.send(
//             { name: 'inventory/stock.updated', data: { productId: item.product } })
//     }
//     await inngest.send({ name: 'order/placed', data: { orderId: order.id } })

// }
// export const getUserOrders = async (req: Request, res: Response) => {
//     const { status } = req.query
//     const where: any = {
//         userId: req.user!.id,
//         NOT: [{ paymentMethod: 'card', isPaid: false }]
//     }
//     if (status && status !== 'all') {
//         where.status = status
//     }
//     const orders = await prisma.order.findMany({
//         where,
//         include: { deliveryPartner: { select: { name: true, phone: true } } },
//         orderBy: { createdAt: 'desc' }
//     })
//     res.json({ orders })
// }
// export const getOrder = async (req: Request, res: Response) => {
//     const order = await prisma.order.findFirst({
//         where: { id: req.params.id as string, userId: req.user!.id },
//         include: { deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } } }
//     })
//     if (!order) {
//         return res.status(404).json({ message: 'order not found' })
//     }
//     res.json({ order })
// }
// export const updateOrderStatus = async (req: Request, res: Response) => {
//     const { status, note } = req.body
//     const order = await prisma.order.findUnique({ where: { id: req.params.id as string } })
//     if (!order) {
//         return res.status(404).json({ message: 'order not found' })
//     }
//     const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any
//     history.push({ status, note: note || `order ${status.toLowerCase()}`, timestamp: new Date() })
//     const updateOrder = await prisma.order.update({
//         where: { id: req.params.id as string },
//         data: { status, statusHistory: history }
//     })
//     res.json({ order: updateOrder })
// }
// export const getAllOrders = async (req: Request, res: Response) => {

//     const orders = await prisma.order.findMany({
//         where: { NOT: [{ paymentMethod: 'card', isPaid: false }] },
//         include: {
//             user: { select: { name: true, email: true } },
//             deliveryPartner: { select: { name: true, phone: true, email: true } }
//         },
//         orderBy: { createdAt: 'desc' }
//     })
//     res.json({ orders })
// }

// export const getOrderLocation = async (req: Request, res: Response) => {
//     const order = await prisma.order.findFirst({
//         where: { id: req.params.id as string, userId: req.user!.id },
//         select: { liveLocation: true, status: true }
//     }
//     )
//     if (!order) return res.status(404).json({ message: 'order not found' })
//     res.json({ liveLocation: order.liveLocation, status: order.status })
// }




















// import { Request, Response } from "express";
// import { prisma } from "../config/prisma.js";
// import { inngest } from "../inngest/index.js"
// import Stripe from 'stripe'

// export const createOrder = async (req: Request, res: Response) => {






// //     try {
// //             const { items, shippingAddress, paymentMethod } = req.body      
// //          const orderItems = items.map((item: any) => {
// //         const dbProduct = productMap[item.product]
// //         if (!dbProduct) throw new Error(`product ${item.product} not found`)
// //         return {
// //             product: dbProduct.id,
// //             name: dbProduct.name,
// //             image: dbProduct.image,
// //             price: dbProduct.price,
// //             unit: dbProduct.unit,
// //             quantity: item.quantity
// //         }
// //     })
// //             const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
// //             const deliveryFee = subtotal > 20 ? 0 : 1.99
// //     const tax = Math.round(subtotal * 0.08 * 100) / 100
// //     const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100
// //    const productIds = items.map((i: any) => i.product)
// //     const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
// //        const productMap: Record<string, (typeof products)[0]> = {}
       
// //         const order = await prisma.order.create({
// //         data: {
// //             userId: req.user!.id,
// //             items: orderItems,
// //             shippingAddress,
// //             paymentMethod,
// //             subtotal,
// //             deliveryFee,
// //             tax,
// //             total,
// //             statusHistory: [{ status: 'Placed', note: 'order placed successfully', timestamp: new Date() }]
// //         }
// //     })



// // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
// //         const session = await stripe.checkout.sessions.create({
// //             success_url: `${req.headers.origin}/orders?clearCart=true`,
// //             cancel_url: `${req.headers.origin}/checkout`,
// //             line_items: [
// //                 {
// //                     price_data: {
// //                         currency: 'usd',
// //                         product_data: {
// //                             name: 'payment groceries'
// //                         },
// //                         unit_amount: total * 100
// //                     },
// //                     quantity: 1,
// //                 },
// //             ],
// //             mode: 'payment',
// //             metadata: { orderId: order.id }
// //         });
// //         return res.json({ url: session.url })

// //     } catch (error) {
// //         res.json({ success: false, message: 'payment failed' })
// //     }

























//     const { items, shippingAddress, paymentMethod } = req.body
//     if (!items || items.length === 0) {
//         return res.status(400).json({ message: 'no order items' })
//     }
//     const productIds = items.map((i: any) => i.product)
//     const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
//     // type Record<K extends keyof any, T> = { [P in K]: T; }
//     // Construct a type with a set of properties K of type T
//     const productMap: Record<string, (typeof products)[0]> = {}

//     products.forEach((p: any) => productMap[p.id] = p)
//     console.log(productMap)
//     for (const item of items) {
//         const product = productMap[item.product]
//         if (!product || (product.stock ?? 0) < item.quantity) {
//             return res.status(404).json({ message: 'product out of stock' })
//         }
//     }
//     const orderItems = items.map((item: any) => {
//         const dbProduct = productMap[item.product]
//         if (!dbProduct) throw new Error(`product ${item.product} not found`)
//         return {
//             product: dbProduct.id,
//             name: dbProduct.name,
//             image: dbProduct.image,
//             price: dbProduct.price,
//             unit: dbProduct.unit,
//             quantity: item.quantity
//         }
//     })
//     const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
//     console.log(subtotal)
//     const deliveryFee = subtotal > 20 ? 0 : 1.99
//     const tax = Math.round(subtotal * 0.08 * 100) / 100
//     const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100
//     const order = await prisma.order.create({
//         data: {
//             userId: '398c5966-6811-4c96-9b33-9adbd44611fe',
//             items: orderItems,
//             shippingAddress,
//             paymentMethod,
//             subtotal,
//             deliveryFee,
//             tax,
//             total,
//             statusHistory: [{ status: 'Placed', note: 'order placed successfully', timestamp: new Date() }]
//         }
//     })
//     if (paymentMethod === 'card') {

//         const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
//         const session = await stripe.checkout.sessions.create({
//             success_url: `${req.headers.origin}/orders?clearCart=true`,
//             cancel_url: `${req.headers.origin}/checkout`,
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: 'payment groceries'
//                         },
//                         unit_amount: total * 100
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             metadata: { orderId: order.id }
//         });
//         return res.json({success:true, url: session.url })
//     }
//     res.json({ order })
//     for (const item of orderItems) {
//         await prisma.product.update({
//             where: { id: item.product },
//             // data: {
//             //     stock: item.quantity
//             // }
//             data: { stock: { decrement: item.quantity } }
//         })
//     }
//     for (const item of orderItems) {
//         await inngest.send(
//             { name: 'inventory/stock.updated', data: { productId: item.product } })
//     }
//     await inngest.send({ name: 'order/placed', data: { orderId: order.id } })

// }








// export const getUserOrders = async (req: Request, res: Response) => {
//     const { status } = req.query
//     const where: any = {
//         userId: req.user!.id,
//         NOT: [{ paymentMethod: 'card', isPaid: false }]
//     }
//     if (status && status !== 'all') {
//         where.status = status
//     }
//     const orders = await prisma.order.findMany({
//         where,
//         include: { deliveryPartner: { select: { name: true, phone: true } } },
//         orderBy: { createdAt: 'desc' }
//     })
//     res.json({ orders })
// }
// export const getOrder = async (req: Request, res: Response) => {
//     const order = await prisma.order.findFirst({
//         where: { id: req.params.id as string, userId: req.user!.id },
//         include: { deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } } }
//     })
//     if (!order) {
//         return res.status(404).json({ message: 'order not found' })
//     }
//     res.json({ order })
// }
// export const updateOrderStatus = async (req: Request, res: Response) => {
//     const { status, note } = req.body
//     const order = await prisma.order.findUnique({ where: { id: req.params.id as string } })
//     if (!order) {
//         return res.status(404).json({ message: 'order not found' })
//     }
//     const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any
//     history.push({ status, note: note || `order ${status.toLowerCase()}`, timestamp: new Date() })
//     const updateOrder = await prisma.order.update({
//         where: { id: req.params.id as string },
//         data: { status, statusHistory: history }
//     })
//     res.json({ order: updateOrder })
// }
// export const getAllOrders = async (req: Request, res: Response) => {

//     const orders = await prisma.order.findMany({
//         where: { NOT: [{ paymentMethod: 'card', isPaid: false }] },
//         include: {
//             user: { select: { name: true, email: true } },
//             deliveryPartner: { select: { name: true, phone: true, email: true } }
//         },
//         orderBy: { createdAt: 'desc' }
//     })
//     res.json({ orders })
// }

// export const getOrderLocation = async (req: Request, res: Response) => {
//     const order = await prisma.order.findFirst({
//         where: { id: req.params.id as string, userId: req.user!.id },
//         select: { liveLocation: true, status: true }
//     }
//     )
//     if (!order) return res.status(404).json({ message: 'order not found' })
//     res.json({ liveLocation: order.liveLocation, status: order.status })
// }




// export const stripePayment = async (req:Request, res:Response) => {
//     try {
//             const { items, shippingAddress, paymentMethod } = req.body      
//          const orderItems = items.map((item: any) => {
//         const dbProduct = productMap[item.product]
//         if (!dbProduct) throw new Error(`product ${item.product} not found`)
//         return {
//             product: dbProduct.id,
//             name: dbProduct.name,
//             image: dbProduct.image,
//             price: dbProduct.price,
//             unit: dbProduct.unit,
//             quantity: item.quantity
//         }
//     })
//             const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
//             const deliveryFee = subtotal > 20 ? 0 : 1.99
//     const tax = Math.round(subtotal * 0.08 * 100) / 100
//     const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100
//    const productIds = items.map((i: any) => i.product)
//     const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
//        const productMap: Record<string, (typeof products)[0]> = {}
       
//         const order = await prisma.order.create({
//         data: {
//             userId: req.user!.id,
//             items: orderItems,
//             shippingAddress,
//             paymentMethod,
//             subtotal,
//             deliveryFee,
//             tax,
//             total,
//             statusHistory: [{ status: 'Placed', note: 'order placed successfully', timestamp: new Date() }]
//         }
//     })



// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
//         const session = await stripe.checkout.sessions.create({
//             success_url: `${req.headers.origin}/orders?clearCart=true`,
//             cancel_url: `${req.headers.origin}/checkout`,
//             line_items: [
//                 {
//                     price_data: {
//                         currency: 'usd',
//                         product_data: {
//                             name: 'payment groceries'
//                         },
//                         unit_amount: total * 100
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: 'payment',
//             metadata: { orderId: order.id }
//         });
//         return res.json({ url: session.url })

//     } catch (error) {
//         res.json({ success: false, message: 'payment failed' })
//     }
// }

















import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js"
import Stripe from 'stripe'

export const createOrder = async (req: Request, res: Response) => {
    const { items, shippingAddress, paymentMethod } = req.body
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'no order items' })
    }
    const productIds = items.map((i: any) => i.product)
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } })
    // type Record<K extends keyof any, T> = { [P in K]: T; }
    // Construct a type with a set of properties K of type T
    const productMap: Record<string, (typeof products)[0]> = {}

    products.forEach((p: any) => productMap[p.id] = p)
    console.log(productMap)
    for (const item of items) {
        const product = productMap[item.product]
        if (!product || (product.stock ?? 0) < item.quantity) {
            return res.status(404).json({ message: 'product out of stock' })
        }
    }
    const orderItems = items.map((item: any) => {
        const dbProduct = productMap[item.product]
        if (!dbProduct) throw new Error(`product ${item.product} not found`)
        return {
            product: dbProduct.id,
            name: dbProduct.name,
            image: dbProduct.image,
            price: dbProduct.price,
            unit: dbProduct.unit,
            quantity: item.quantity
        }
    })
    const subtotal = orderItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    console.log(subtotal)
    const deliveryFee = subtotal > 20 ? 0 : 1.99
    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100
    const order = await prisma.order.create({
        data: {
            userId: req.user!.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            total,
            statusHistory: [{ status: 'Placed', note: 'order placed successfully', timestamp: new Date() }]
        }
    })
    if (paymentMethod === 'card') {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
        const session = await stripe.checkout.sessions.create({
            success_url: `${req.headers.origin}/orders?clearCart=true`,
            cancel_url: `${req.headers.origin}/checkout`,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'payment groceries'
                        },
                        unit_amount: Math.round(total * 100)
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: { orderId: order.id }
        });
        return res.json({ url: session.url })
    }
    res.json({ order })
    for (const item of orderItems) {
        await prisma.product.update({
            where: { id: item.product },
            // data: {
            //     stock: item.quantity
            // }
            data: { stock: { decrement: item.quantity } }
        })
    }
    for (const item of orderItems) {
        await inngest.send(
            { name: 'inventory/stock.updated', data: { productId: item.product } })
    }
    await inngest.send({ name: 'order/placed', data: { orderId: order.id } })

}
export const getUserOrders = async (req: Request, res: Response) => {
    const { status } = req.query
    const where: any = {
        userId: req.user!.id,
        NOT: [{ paymentMethod: 'card', isPaid: false }]
    }
    if (status && status !== 'all') {
        where.status = status
    }
    const orders = await prisma.order.findMany({
        where,
        include: { deliveryPartner: { select: { name: true, phone: true } } },
        orderBy: { createdAt: 'desc' }
    })
    res.json({ orders })
}
export const getOrder = async (req: Request, res: Response) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params.id as string, userId: req.user!.id },
        include: { deliveryPartner: { select: { name: true, phone: true, avatar: true, vehicleType: true } } }
    })
    if (!order) {
        return res.status(404).json({ message: 'order not found' })
    }
    res.json({ order })
}
export const updateOrderStatus = async (req: Request, res: Response) => {
    const { status, note } = req.body
    const order = await prisma.order.findUnique({ where: { id: req.params.id as string } })
    if (!order) {
        return res.status(404).json({ message: 'order not found' })
    }
    const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []) as any
    history.push({ status, note: note || `order ${status.toLowerCase()}`, timestamp: new Date() })
    const updateOrder = await prisma.order.update({
        where: { id: req.params.id as string },
        data: { status, statusHistory: history }
    })
    res.json({ order: updateOrder })
}
export const getAllOrders = async (req: Request, res: Response) => {

    const orders = await prisma.order.findMany({
        where: { NOT: [{ paymentMethod: 'card', isPaid: false }] },
        include: {
            user: { select: { name: true, email: true } },
            deliveryPartner: { select: { name: true, phone: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
    })
    res.json({ orders })
}

export const getOrderLocation = async (req: Request, res: Response) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params.id as string, userId: req.user!.id },
        select: { liveLocation: true, status: true }
    }
    )
    if (!order) return res.status(404).json({ message: 'order not found' })
    res.json({ liveLocation: order.liveLocation, status: order.status })
}
