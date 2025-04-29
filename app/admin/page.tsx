"use client"

import { useState, useEffect } from "react"
import { getAllOrders, getOrdersByStatus, type Order } from "@/lib/firestore-service"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [activeTab])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      let fetchedOrders: Order[]

      if (activeTab === "pending") {
        fetchedOrders = await getOrdersByStatus("pending")
      } else if (activeTab === "confirmed") {
        fetchedOrders = await getOrdersByStatus("confirmed")
      } else {
        fetchedOrders = await getAllOrders()
      }

      // Sort by creation date (newest first)
      fetchedOrders.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())

      setOrders(fetchedOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من جلب الطلبات. يرجى المحاولة مرة أخرى.",
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

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">لوحة إدارة الطلبات</CardTitle>
          <CardDescription>عرض وإدارة طلبات البطاقات الرقمية</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
              <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
              <TabsTrigger value="confirmed">مؤكدة</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="w-full">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 text-red-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  لا توجد طلبات {activeTab === "pending" ? "قيد الانتظار" : activeTab === "confirmed" ? "مؤكدة" : ""}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>رقم الطلب</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>العميل</TableHead>
                        <TableHead>المنتج</TableHead>
                        <TableHead>المجموع</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>العمليات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell>
                            <div>
                              <div>{order.customer.name}</div>
                              <div className="text-sm text-gray-500">{order.customer.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>{order.items.map((item) => item.name).join(", ")}</TableCell>
                          <TableCell>{order.total.toLocaleString()} دج</TableCell>
                          <TableCell>
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
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" className="ml-2">
                              عرض التفاصيل
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
