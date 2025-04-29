"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getOrderById, type Order } from "@/lib/firestore-service"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, User, Truck, ShoppingBag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as string)
    }
  }, [params.id])

  const fetchOrder = async (id: string) => {
    setIsLoading(true)
    try {
      const orderData = await getOrderById(id)
      if (orderData) {
        setOrder(orderData)
      } else {
        toast({
          title: "لم يتم العثور على الطلب",
          description: "الطلب المطلوب غير موجود",
          variant: "destructive",
        })
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error fetching order:", error)
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من جلب بيانات الطلب. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return ""

    const date = timestamp.toDate()
    return new Intl.DateTimeFormat("ar-DZ", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center" dir="rtl">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-12 w-12 text-red-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p>جاري تحميل بيانات الطلب...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-12 text-center" dir="rtl">
        <h2 className="text-2xl font-bold mb-4">لم يتم العثور على الطلب</h2>
        <Button onClick={() => router.push("/admin")}>
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة إلى لوحة التحكم
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <Button variant="outline" className="mb-6" onClick={() => router.push("/admin")}>
        <ArrowLeft className="ml-2 h-4 w-4" />
        العودة إلى لوحة التحكم
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl">تفاصيل الطلب #{order.orderNumber}</CardTitle>
                <CardDescription>تم الطلب في {formatDate(order.createdAt)}</CardDescription>
              </div>
              <Badge
                variant={order.status === "confirmed" ? "default" : "outline"}
                className={
                  order.status === "confirmed"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                }
              >
                {order.status === "confirmed" ? "مؤكد" : "قيد الانتظار"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium flex items-center mb-3">
                    <ShoppingBag className="ml-2 h-5 w-5 text-red-600" />
                    المنتجات
                  </h3>
                  <div className="rounded-md border">
                    {order.items.map((item) => (
                      <div key={item.id} className="p-4 flex justify-between items-center border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{item.price.toLocaleString()} دج</p>
                          <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium flex items-center mb-3">
                    <Truck className="ml-2 h-5 w-5 text-red-600" />
                    التوصيل
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">نوع التوصيل</p>
                        <p className="font-medium">{order.delivery.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">وقت التوصيل المتوقع</p>
                        <p className="font-medium">{order.delivery.estimatedTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">الولاية</p>
                        <p className="font-medium">{order.customer.wilaaya}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">البلدية</p>
                        <p className="font-medium">{order.customer.commune}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
              <div className="w-full max-w-md mr-auto">
                <div className="flex justify-between py-2">
                  <span>المجموع الفرعي</span>
                  <span>{order.subtotal.toLocaleString()} دج</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>رسوم التوصيل</span>
                  <span>{order.deliveryFee.toLocaleString()} دج</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between py-2 font-bold">
                  <span>المجموع الكلي</span>
                  <span>{order.total.toLocaleString()} دج</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="ml-2 h-5 w-5 text-red-600" />
                معلومات العميل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">الاسم الكامل</p>
                  <p className="font-medium">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">رقم الهاتف</p>
                  <p className="font-medium">{order.customer.phone}</p>
                </div>
                {order.customer.secondPhone && (
                  <div>
                    <p className="text-sm text-gray-500">رقم هاتف ثاني</p>
                    <p className="font-medium">{order.customer.secondPhone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                  <p className="font-medium">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">العنوان</p>
                  <p className="font-medium">
                    {order.customer.commune}، {order.customer.wilaaya}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline">
                التواصل مع العميل
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
