import { collection, addDoc, doc, getDoc, getDocs, query, where, Timestamp } from "firebase/firestore"
import { db } from "./firebase"

// Define the Order type
export interface Order {
  id?: string
  orderNumber: string
  customer: {
    name: string
    phone: string
    secondPhone?: string
    email: string
    wilaaya: string
    commune: string
  }
  delivery: {
    type: string
    estimatedTime: string
  }
  items: Array<{
    id: number
    name: string
    price: number
    quantity: number
    description: string
  }>
  status: "pending" | "confirmed"
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: Timestamp
}

// Save order to Firestore
export const saveOrder = async (order: Omit<Order, "createdAt">) => {
  try {
    console.log("Starting to save order to Firestore:", {
      orderNumber: order.orderNumber,
      status: order.status,
      customerName: order.customer.name,
      // Don't log sensitive information
    })

    const orderData = {
      ...order,
      createdAt: Timestamp.now(),
    }

    console.log("Attempting to add document to 'orders' collection...")
    const docRef = await addDoc(collection(db, "orders"), orderData)
    console.log("Document written with ID:", docRef.id)

    return { id: docRef.id, ...orderData }
  } catch (error) {
    console.error("Error saving order:", error)

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    // Check if it's a Firebase permission error
    if (error.toString().includes("permission-denied")) {
      console.error("Firebase permission denied. Check your security rules.")
      throw new Error("Permission denied. Please check your Firestore security rules.")
    }

    throw error
  }
}

// Get order by ID
export const getOrderById = async (id: string) => {
  try {
    const docRef = doc(db, "orders", id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting order: ", error)
    throw error
  }
}

// Get order by order number
export const getOrderByOrderNumber = async (orderNumber: string) => {
  try {
    const q = query(collection(db, "orders"), where("orderNumber", "==", orderNumber))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as Order
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting order by number: ", error)
    throw error
  }
}

// Get all orders
export const getAllOrders = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order)
  } catch (error) {
    console.error("Error getting all orders: ", error)
    throw error
  }
}

// Get orders by status
export const getOrdersByStatus = async (status: "pending" | "confirmed") => {
  try {
    const q = query(collection(db, "orders"), where("status", "==", status))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Order)
  } catch (error) {
    console.error("Error getting orders by status: ", error)
    throw error
  }
}
